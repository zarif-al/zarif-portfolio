## Overview

Migrated a 10,000+ document editorial backend from WordPress to Sanity with custom content modeling, automated redirect mapping, and a zero-downtime cutover strategy. The accompanying Next.js frontend with Incremental Static Regeneration cut page load times by 70%.

## Architecture Decisions

- **Content modeling first:** Spent two weeks auditing the existing WordPress structure — taxonomies, custom fields, ACF blocks — before writing a single Sanity schema. The model was cleaner than the source, not a 1:1 port.
- **Automated redirects:** Generated a 10,000-line redirect map via a Python script that crawled the old site, matched slugs to the new Sanity document structure, and output a Vercel redirects config.
- **Zero-downtime cutover:** Ran both backends in parallel for a week. Editorial team wrote in Sanity; content was served from WordPress until the DNS flip. A final sync caught any last-minute WordPress edits.
- **ISR over SSR:** ISR with a 60-second revalidation window meant editorial changes propagated automatically without full rebuilds — and page loads were near-static fast.
