## Overview

A Payload CMS deployment serving 40+ tenants from a single codebase — each with isolated data, custom schema extensions, and a shared-but-scoped media pipeline. The platform replaced 40+ individual WordPress instances, cutting infrastructure costs by 60% while giving each tenant the flexibility to define their own content models.

## Architecture Decisions

- **Database isolation:** Per-tenant PostgreSQL schemas with a shared connection pool, keeping data physically separate while avoiding per-tenant instance overhead.
- **Schema extensions:** A plugin system allowing tenants to register custom collections and fields without forking the core — validated at build time with TypeScript.
- **Media pipeline:** S3-backed storage with tenant-scoped prefixes and signed URLs, served through a caching CDN layer.
- **Access control:** Row-level security via Payload's access control API, extended with tenant-context aware middleware.

## Challenges

The hardest problem was allowing per-tenant schema customization without breaking the shared upgrade path. Tenants needed to add fields to core collections without those changes leaking into other tenants or being wiped by platform updates. The solution was a layered collection registration system: core schemas ship from the platform, tenant extensions are merged at runtime through a deterministic merge strategy, and conflicts are caught by CI.
