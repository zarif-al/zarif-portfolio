# Auto-generated related links via shared Tags

Related Projects and related Blog Posts on detail pages are derived automatically from shared Tags at render time, rather than using explicit relationship fields in Payload.

**Why:** Manual relationship fields require editors to maintain bidirectional links — adding a "Related Projects" field to both the Projects and Blogs collections, then keeping them in sync. With Tags as the canonical categorization, related items fall out naturally: two items sharing a tag are related. Zero editorial maintenance, and the related links stay accurate as new content is added without editors revisiting old items.

**Considered alternative:** Payload `relationship` fields for explicit "Related Projects" and "Related Posts" on each collection. Rejected because it duplicates the categorization work Tags already do and creates a maintenance burden that grows with content volume.

**Consequence:** Tags must be chosen with related-link intent — editors should use specific, meaningful tags (e.g. "CMS Migration" rather than "Tech") to produce useful related links. If a project and post are conceptually related but share no tags, no link is generated. This is acceptable because the Tag model encourages deliberate categorization.
