When you're building a CMS that needs to serve forty different clients — each with their own content model, their own users, and their own media library — the instinct is to spin up forty instances. Don't. Here's what I learned designing a single-codebase, multi-tenant Payload CMS platform.

## Database isolation without the overhead

PostgreSQL schemas are the sweet spot. Each tenant gets their own schema within the same database — physically separate tables, logically grouped. One connection pool, per-schema search paths, and a middleware layer that sets `search_path` based on the request's tenant context. It's not as isolated as separate databases, but for a CMS where tenants shouldn't share data (but can share infrastructure), it's perfect.

## The schema extension problem

This was the hard one. Tenants needed to add custom fields to core collections — a blog tenant wants an `authorBio` field on posts; an e-commerce tenant wants `priceTier`. But those extensions had to survive platform updates without forking. The solution: a layered registration system. Core schemas are loaded first. Tenant extensions are registered as overrides in a deterministic merge. CI validates that no extension breaks the base contract. It's not pretty, but it works.

## Media storage with tenant scoping

S3 prefixes are cheap. Every tenant gets `/tenant-{id}/` as their root. Signed URLs enforce access at the CDN layer. The Payload media collection is tenant-aware — an upload hook stamps the tenant ID, and the access control reads it back. No cross-tenant media leaks possible unless someone rewrites S3 IAM policies.

## What I'd do differently

I'd invest earlier in a tenant provisioning UI. The CLI-based tenant creation was fine for the first ten, but by forty it was a bottleneck. A simple admin panel with tenant creation, schema management, and usage dashboards would have saved the platform team dozens of hours.
