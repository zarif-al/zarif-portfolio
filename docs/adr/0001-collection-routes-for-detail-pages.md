# Collection routes for Project and Blog Post detail pages

Project and Blog Post detail pages are served via dedicated Next.js routes (`projects/[slug]`, `blog/[slug]`) rather than as `[[...slug]]` Pages built from blocks.

**Why:** The site's six listing pages (Home, About, Projects, Blog, Contact, Now) are block-built Pages — editors compose them in the admin. But individual Project and Blog Post detail pages need structured data integrity (title, tags, body, outcome stats), not block-level composition. Using Payload collections for this data gives us validation, admin UI, and API consistency for free. Dedicated Next.js routes let us control the detail template precisely — header, body, stats, stack, related links — without giving editors block-level control they don't need.

**Considered alternative:** Making every detail page a `[[...slug]]` Page with blocks. Rejected because it puts structured content into the Pages collection, where validation is looser and the admin experience is less suited to repetitive data entry (50+ projects and posts).

**Consequence:** Adding a new content type that needs detail pages requires a new collection and a new dedicated route, not just a new block. The boundary is: if content has its own URL and a consistent template, it's a collection. If content is composed onto a listing page, it's a block.
