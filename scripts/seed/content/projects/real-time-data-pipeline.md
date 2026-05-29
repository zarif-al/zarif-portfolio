## Overview

An event-driven pipeline built on NestJS that syncs product catalog, inventory, and order data between a legacy ERP system and a modern Sanity + Next.js storefront. Processing 50,000+ events per day with idempotent guarantees and a dead-letter queue for failed synchronizations.

## Architecture Decisions

- **Idempotent processing:** Every event carries a deterministic idempotency key derived from the source record hash + event type — replays are safe, duplicates are dropped.
- **Redis Streams:** Chosen over Kafka for operational simplicity at this scale — consumer groups for parallel processing, automatic backpressure.
- **Dead-letter queue:** Failed events land in a BullMQ-backed DLQ with retry strategies configurable per event type — no data is silently dropped.
- **Schema validation at the boundary:** Zod schemas validate every incoming event before it enters the processing pipeline.

## Challenges

The legacy ERP had no webhook support and no API — data extraction required polling a read replica on a fixed interval, then diffing against the last known state. The diff engine had to handle partial updates gracefully: if a product changed its price but not its inventory, only the price field should propagate, avoiding unnecessary Sanity mutations and CDN cache invalidations.
