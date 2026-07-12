# Reservation Flow

## Problem

- Mariana Tek requires a user to pre-purchase a membership or credit bundle before they can book any reservation. There is no "pay at checkout" option for bookings.
- Mariana Tek allows only one reservation at a time per user. A group of 5 people would require going through the entire booking flow 5 separate times.
- Mariana Tek has two separate checkouts: one for the reservation and another for add-on products. Add-ons can only be purchased after the reservation is complete, in a special post-reservation cart.

## What the Client Needed

- Customers must be able to book a session without owning a membership or credit bundle upfront. Payment happens at checkout, not before.
- Customers must be able to book multiple spots in a single flow. Selecting a session, choosing a group size, and checking out once should reserve spots for the entire group.
- Add-on products (towels, drinks, etc.) must be purchasable in the same checkout as the booking. No separate post-reservation purchase step.
- The flow must work for both logged-in members and anonymous walk-in customers.

## What Mariana Tek Requires

- A user must own a prepaid membership or credit bundle to create a reservation. The GMS checks entitlements at booking time, not at payment time.
- A user can only have one active reservation per session. Creating a second self-reservation in the same session is rejected.
- Add-on products exist in a separate cart type tied to an existing reservation. They cannot be added to the reservation cart itself.

## Solution Overview

- **Single-seat credits.** Create credit products in Mariana Tek that cover exactly one seat each, scoped to specific class types and locations using MT's tag system. Users buy these at checkout instead of buying bundles upfront.
- **Spot hold system.** Reserve spots in Redis with an 11-minute TTL before the user commits to booking. Prevents other customers from taking the same spots while the user completes checkout.
- **Payment option allocation.** For logged-in users, apply any existing credits or memberships first, then buy single-seat credits for remaining seats. For anonymous users, all seats are paid via single-seat credits.
- **Single cart for everything.** Credits and add-on products go into the same cart and are checked out together. Add-on details are posted as session notes so staff know which customer bought what, since MT's UI would otherwise not show them.
- **Atomic queue-based reservation.** After payment, the reservation request is enqueued in BullMQ. The processor creates each reservation sequentially (MT's per-session locking requires this), and if any reservation fails, all are rolled back (cancelled + refunded).

## Implementation Details

### Gateway Layer (`mariana-tek-gateway`)

**Spot hold (`SpotHoldService`)**
- Uses Redis with per-session distributed locks to prevent race conditions between concurrent booking attempts.
- `holdSpots(sessionId, count)` auto-assigns `count` available spots for a session. Returns a `holdId`, the spot IDs held, and an expiry time.
- `holdSpotsByIds(sessionId, spotIds)` holds specific spots (used for UX where the user picks exact spots).
- `updateHold(holdId, sessionId, count)` resizes an existing hold (growing or shrinking the group).
- `releaseHold(holdId, sessionId)` releases the hold. Called on booking completion, cancellation, or expiry.
- `confirmHold(holdId, sessionId)` extends the hold TTL to 24 hours. Called when the group reservation is enqueued, so spots stay locked if the queue job takes longer than the 11-minute window.
- Holds expire after 11 minutes. A frontend timer warns the user and releases spots if time runs out.
- Private sessions have additional validation: minimum spot requirements, exclusivity (only one hold at a time per session).

**Single-seat credits (`CreditService`)**
- Credits are standard Mariana Tek credit products configured by the client with a quantity of 1 per package.
- MT's class tag and location scoping system means a single credit can be restricted to specific class types and locations. Credits for "Sauna Session" in "Dublin" only apply to that combination.
- `getCreditPackages(creditId)` fetches the purchasable packages for a credit.
- `getAllCreditPackages(locationId)` fetches all active credit packages for a location, grouped by parent credit ID. Used by the frontend to find the cheapest applicable credit for a session.

**Group reservation (`ReservationService.createGroupReservation`)**
- Validates that the number of reservations matches the number of held spots.
- Calls `confirmHold` to extend the hold before enqueuing (prevents expiry during queue processing).
- Enqueues a BullMQ job with `attempts: 1` (no retries, failure triggers rollback within the job).

**Group reservation processor (`GroupReservationProcessor`)**
- Processes jobs with concurrency 10 (up to 10 group bookings in parallel across different sessions).
- Phase 1: Validates input data.
- Phase 2: Checks for existing self-reservations in the session. If found, all new reservations in this batch are treated as guests.
- Phase 3: Creates reservations sequentially. MT's per-session locking causes spot conflicts on concurrent requests, so sequential processing within a group is required.
  - First non-guest item becomes the self-reservation.
  - If a self-reservation already exists, all items (including the first) are promoted to guests.
  - Guests get generated names and emails (e.g. `Guest_a1b2c3d4`).
- On success: releases the hold, posts session notes for add-on products, links orders to the reservation in MongoDB, sends confirmation emails.
- On failure (`handleRollback`): cancels all created reservations with grace (`grace: true`, no penalty), releases the hold, refunds all orders, sends failure emails to both customer and location staff.

**Payment option allocation (frontend, server-side via `buildReservationItems`)**
- Fetches the user's eligible payment options for the session (both self and guest).
- For anonymous users post-checkout: filters out credit bundles (multi-use), keeps only single credits (transaction amount of 1).
- For authenticated users: checks for existing self-reservations to determine if all seats should be guests.
- `allocatePaymentOptions`: allocates seat 0 as self (using self options if available), remaining seats as guests (using guest options). Existing entitlements are consumed first; unpaid seats are covered by single-seat credit packages in the cart.

**Session notes for add-ons**
- After successful group reservation, the processor aggregates non-credit order lines across all orders and posts a session note to Mariana Tek.
- Format: "User: John Doe\n- Towel x2\n- Water x1". This is the workaround for MT's UI not showing add-ons purchased alongside the reservation.

### Frontend Layer (`kohere`)

**Group booking flow (`useGroupBookingFlowHandlers`, `prepareGroupReservation`)**
- The booking flow is a multi-screen modal: select-slot → cart → checkout → confirmation.
- `prepareGroupReservation` is called on initial booking and when group size changes:
  1. Holds spots via `holdSpot` or `updateHold`.
  2. Builds reservation items via `buildReservationItems` (server-side call to determine which seats need credits).
  3. Syncs the cart: adds or updates credit package line items for unpaid seats.
  4. On failure at the select-slot screen, releases the hold. On later screens, preserves the hold.
- A timer in the UI shows remaining hold time. When it expires, spots are released and the user is returned to slot selection.
- Group size can be changed at any point before checkout, resizing the hold and recalculating credits.

**Cart integration**
- The reservation cart (`bookingCart`) is a separate store from the standard purchase cart.
- Credits are added as cart items alongside add-on products. The checkout flow is the same `CheckoutForm` component used for standard purchases, parameterized for the booking flow.
- After checkout, the reservation payload (session, spots, payment options, guest info) is sent via `createGroupReservation` mutation, which enqueues the job.

**Post-checkout confirmation**
- The frontend calls `createGroupReservation` after successful cart checkout. This returns immediately (the job is enqueued).
- A confirmation screen shows the booking status. The actual reservations are created asynchronously by the queue.
- Confirmation and failure emails are sent by the processor, not the frontend.

## Key Architectural Decisions

- **Credits over bundles.** Using 1-seat credits instead of forcing membership purchases decouples payment from booking. The user pays for exactly what they need at checkout.
- **Redis for spot holds.** Redis provides sub-millisecond atomicity for hold operations and automatic TTL-based expiry, avoiding stale holds from abandoned sessions.
- **Sequential reservation creation.** MT's internal locking means concurrent reservation requests for the same session can fail with spot conflicts. Processing sequentially within a group avoids this, at the cost of latency per seat.
- **Atomic rollback.** If any reservation in a group fails, all are cancelled and all orders refunded. The user never ends up in a partial state where 3 of 5 friends are booked and 2 are not.
- **Session notes as add-on tracking.** Rather than building a separate add-on checkout flow matching MT's model, add-ons go into the same cart and are recorded as session notes. Staff see what was purchased without needing MT's UI to support it.
