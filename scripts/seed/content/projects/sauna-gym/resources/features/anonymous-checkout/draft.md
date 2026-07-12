# Anonymous Checkout

## Problem

- Mariana Tek requires two separate actions before any interaction with the site:
  1. **Login.** A user account must exist and the user must be authenticated.
  2. **Select a location.** The user must choose a location (any location, not necessarily a home) before they can browse products, add to cart, or check out.
- Both are mandatory for any cart action: create cart, add items, or checkout.
- The client's business model depends on walk-in customers who should never need to create an account or pick a location.
- No existing MT API pathway for guest/anonymous purchases.

## Constraints

- A user account must exist before any cart can be created. No user, no cart.
- A location must be selected before any cart interaction. MT scopes products, pricing, and availability per location. It does not have to be a home location, any location works.
- Mariana Tek merges open carts by user+partner by default. Having multiple open carts for the same user at the same location causes unexpected side effects.

## Solution Overview

- Solve the "login required" constraint by creating temporary "anonymous" MT user accounts behind the scenes when an unauthenticated visitor first adds an item
- Solve the "location required" constraint with a fixed "Corporate Location." The client sets up all purchasable products to be available at this location (in addition to their real physical locations). The frontend hardcodes this corporate location ID and uses it for all standard purchases, both anonymous and logged-in. The client's requirement was to get clean sales reporting per location: purchases made at physical locations are tracked there, while purchases made on the site are allocated to the corporate location. The gateway is unaware of this distinction: it simply receives a `locationId` and uses it.
- At checkout, migrate the temporary cart to a real user identity (created from the checkout form data)
- Scheduled cleanup deletes abandoned anonymous accounts after 24 hours

## Implementation Details

### Gateway Layer (`mariana-tek-gateway`)

**Anonymous account creation (`AnonymousAccountService`)**
- `createAnonymousUser(locationId)` generates a throwaway MT user:
  - Email: `anonymous_user_{random_9_digit_number}@hotbox.com`
  - Name: "Anonymous User"
  - Password: random 8-character hex string (the user never sees or uses it)
  - No signup verification tag — the account is invisible to the user's own MT login
- `findOrCreateAccount({ email, firstName, lastName, locationId })` serves the dual purpose of cart creation (upsert-style: finds existing by email or creates new) and cart migration (resolves a real identity at checkout time)

**Cart creation (`CartService.createCart`)**
- When `userId` is absent from the `CreateCartDto`:
  - Creates an anonymous user via `AnonymousAccountService.createAnonymousUser()`
  - Schedules a BullMQ cleanup job with 24-hour delay (3 retry attempts)
- When `userId` is present (authenticated flow), skips account creation
- After resolving the user (anonymous or authenticated), clears any open carts that user already has at the location (MT merges carts by default). In practice, this only matters for authenticated users since a brand-new anonymous user has no existing carts.
- Feature-gated behind `features.enableAnonymousAccounts.enabled`

**Cart migration (`CartService.updateCartUser`)**
- Called when an anonymous user fills in the checkout form (name, email, location)
- Resolves the real identity by calling `findOrCreateAccount` with the provided details:
  - If an account with that email already exists, reuses it
  - If not, creates a new one (still unverified — no signup tag)
- Clears any open carts the resolved user already has at the location (MT cart merging prevention)
- Reassigns the anonymous cart to the resolved user via PATCH to Mariana Tek's `/carts/{id}` endpoint (updates the `user` relationship)
- Also updates the local MongoDB tracking record if reservation cart tracking is enabled: finds the local cart record by the cart ID, and if it belongs to a reservation session (has a `sessionId`), updates the user ID to the newly resolved identity

**Checkout (`CartService.checkoutCart`)**
- Supports two payment channels in a single checkout call:
  - `accountBalance` — deduct from user's MT account balance
  - `paymentByBankCard` — charge a saved bank card by ID
- Posts to MT's `/checkouts/` endpoint via admin API
- Returns order with purchased items, refund status, and pricing

**Cleanup (`AnonymousAccountCleanupProcessor`)**
- BullMQ processor that runs 24 hours after anonymous account creation
- Clears any remaining open carts for the anonymous user
- Archives the user in Mariana Tek
- Prevents accumulating garbage anonymous accounts

**Account lifecycle (`AccountService`)**
- `createAccount` (the OTP-verified signup flow) handles three states:
  - No existing account: creates a new MT user with the `selfCreatedTagId` (verified)
  - Existing anonymous account: promotes it by updating name/email and adding the `selfCreatedTagId`
  - Existing verified account: throws ConflictException
- `findAccountByEmail` determines account state by checking for the `selfCreatedTagId` tag
- Sends a welcome email after successful creation or promotion

**Feature flags (`enableAnonymousAccounts`)**
- `enabled: boolean` — master switch
- `selfCreatedTagId: number` — the Mariana Tek tag ID that marks a fully registered (non-anonymous) user
- Tenant-specific configuration in `the-hotbox-sauna.ts` (dev: tag 249, prod: tag 272)

### Frontend Layer (`kohere`)

**Cart initialization (`cart-items.ts` → `ensureCart`)**
- When adding an item with no existing cart, calls `createCart` mutation with `locationId` only
- For standard purchases, this `locationId` is the hardcoded "Corporate Location" ID. The corporate location is a special MT location where all purchasable products are made available by the client. This is separate from booking flows where the user selects a real physical location.
- Gateway creates the anonymous user and cart transparently. The frontend never knows the user is temporary.
- The returned `CartObject` includes `userId` for subsequent API calls

**Checkout page (`CheckoutForm`)**
- Detects authentication state via `useSession()`
- Authenticated: shows saved payment methods, account balance, save-card option
- Anonymous: shows `AnonymousCustomerForm` (First Name, Last Name, Email) instead of saved payment methods
- Both paths use the same `useCheckout` hook — the flow branches inside `handlePay`

**Payment execution (`useCheckout.handlePay`)**
- Anonymous path:
  1. Calls `updateCartUser` mutation with customer's name, email, and location — triggers cart migration in the gateway
  2. Checks if the cart total changed after migration (backend may auto-apply a global discount once customer identity is known) and notifies user
  3. Updates local cart state with the migrated cart
  4. Sets Sentry `user.id` context with the resolved MT user ID for tracing
- Payment dispatch:
  - No card needed (balance covers total, or cart is $0): checkout directly via MT
  - Saved card selected (authenticated only): checkout via MT with card ID
  - New card (Stripe): tokenize via Stripe Elements, then checkout via MT
- Both MT-direct and Stripe paths call the same `checkoutCart` mutation with different payloads

**Error handling**
- Payment declined → "Payment was declined. Please try again." error message
- Sentry metrics track: payment success/failure counts by channel (`mt-direct` vs `stripe`), payment amounts

## Key Architectural Decisions

- **Admin API key as super-user.** All cart and account operations go through the MT admin API, not per-user auth. This is what makes anonymous cart creation possible — the gateway impersonates any user.
- **Lazy identity resolution.** The user's real identity is only needed at checkout time, not at cart creation. This keeps the browsing experience frictionless.
- **Email as identity anchor.** The anonymous-to-real account transition is keyed on email address. Providing the same email at checkout that already exists in MT triggers account reuse rather than duplication.
- **Cart merging prevention.** MT merges carts by default for the same user+partner. The gateway clears existing open carts before creating new ones or reassigning carts to prevent silent merges.
- **24-hour cleanup window.** Abandoned anonymous accounts and their carts are cleaned up after 24 hours via BullMQ delayed jobs, preventing accumulation of garbage accounts in MT.

## Omitted from Final Article

The following details exist in the implementation but will be cut from the final blog post to keep the article focused on the core anonymous checkout flow:

- **Feature flag gating.** The `enableAnonymousAccounts.enabled` flag and tenant-specific `selfCreatedTagId` configuration are infrastructure details that distract from the solution narrative.
- **Account promotion flow.** When an anonymous user later signs up via OTP, the system promotes their existing anonymous account rather than creating a duplicate. This is a separate sign-up concern, not part of the checkout path.
- **Cleanup job.** The BullMQ scheduled job that archives abandoned anonymous accounts after 24 hours. Important for production hygiene but not central to the checkout story.
- **Dual-purpose `findOrCreateAccount`.** The upsert-style method that serves both cart creation and cart migration. The final article will present these as two distinct operations for clarity.
