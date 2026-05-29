Most integrations start with CRUD. REST endpoint here, PUT there, maybe a cron job for good measure. That works until you're syncing a product catalog between a twenty-year-old ERP and a modern headless storefront at 50,000 events a day. At that volume, CRUD becomes a liability.

## Why events beat polling

Polling the ERP for changes meant a baseline latency of however long your cron interval was — plus the cost of diffing entire tables every cycle. Events flip the model: the source system emits "this thing changed" and downstream reacts. No wasted work, no stale data, and latency drops from minutes to sub-second.

## Idempotency is not optional

When you're processing 50k events a day, duplicates are inevitable — network retries, consumer restarts, at-least-once delivery semantics. Every event handler must be idempotent. My approach: a deterministic idempotency key derived from the source record hash plus the event type. Check Redis for the key before processing. If it exists, skip. If not, process and write the key. Simple, fast, and it catches everything.

## The dead-letter queue pattern

Some events will fail — malformed data from the ERP, a transient database outage, a schema mismatch. You need somewhere those events go so they don't block the pipeline. A BullMQ-backed DLQ lets you inspect failures, fix the root cause, and replay. Configure retry strategies per event type: transient failures retry with backoff; schema failures go straight to DLQ for human review.

## Testing event-driven systems

You can't write effective tests for an event pipeline without making the events deterministic. I built a test harness that replays recorded production event streams against a local Postgres + Redis instance. Every change to the processing logic runs against real data before it hits staging. It caught three silent data corruption bugs before they shipped.
