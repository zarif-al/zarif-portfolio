## Overview

Consolidated three disparate payment providers — Stripe, a local bank gateway, and a manual invoicing system — behind a single NestJS API layer. Built reconciliation tooling to match transactions across providers, normalized webhook handling, and delivered an admin dashboard for the finance operations team. The unified system processed over $2 million in its first quarter.

## Architecture Decisions

- **Provider abstraction layer:** A strategy pattern with per-provider adapters — each implements the same interface (charge, refund, webhook verification) but handles provider-specific logic internally.
- **Idempotent payment processing:** Every payment intent gets a client-generated idempotency key that survives retries, network failures, and provider timeouts — no double-charges.
- **Webhook normalization:** Each provider sends events in a different shape. A normalization layer maps all of them to a canonical internal event format before they hit business logic.
- **Reconciliation engine:** A Temporal workflow runs daily, matching internal transaction records against provider settlement reports and flagging discrepancies for manual review.
