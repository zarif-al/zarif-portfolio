## Overview

Led the migration of a premium gym from a restrictive legacy Gym Management System (Mariana Tek) to a modern, multi-platform solution. The project decoupled content management from the GMS, introduced Sanity as the CMS, built a NestJS synchronization service, and delivered a Next.js web app alongside a Flutter mobile app.

## Architecture Decisions

- **Headless CMS decoupling:** The legacy system bundled a basic web builder into the GMS, severely limiting content creation. We moved content management to Sanity, giving the client full creative control.
- **Data enrichment pipeline:** The GMS didn't support enriching data before it reached the frontend. We built a NestJS synchronizer that pulled GMS data into Sanity, where editors could add custom fields, translations, and marketing content.
- **Regional subdomain strategy:** Each region the gym operated in required separate domains. We implemented a subdomain structure with multi-language support, simplifying regional content management.
- **Mobile via Flutter:** Chose Flutter to reduce development costs while delivering a high-performance app across iOS and Android from a single codebase.
- **Web via Next.js:** The website was API-heavy with multiple data sources. Next.js with React Suspense allowed us to break pages into asynchronously loaded components, ensuring smooth user experience.

## Challenges

**Spot booking system:** The GMS provided a basic booking view but it was visually generic, not mobile-friendly, and redirected users to a separate page. We built a custom booking experience from scratch — an airplane-style seat picker where users could see their spot positioned relative to key points in the classroom (trainers, equipment, exits). Custom layout images were uploaded in Sanity with a drag-and-drop spot placement interface.

**Class list viewer:** The GMS required users to manually select country and gym location before browsing classes. We built a unified class list component that could be embedded across multiple pages (gym detail, trainer detail, class type pages) with React Suspense for parallel data fetching and skeleton loading states.

## Outcome

- **Dramatically improved booking UX** — users could visually select spots based on room layout
- **Content updates no longer required multiple people** — editors managed everything in Sanity
- **Consistent brand experience** across web and mobile platforms
