## Overview

Building a custom integration layer on top of Mariana Tek Gym Management System for a sauna business. The core challenge: the GMS only supports single-spot booking with mandatory user login — the client needs anonymous group booking where customers can reserve multiple spots in one session without creating an account.

## Architecture Decisions

- **NestJS integration layer:** A dedicated service sits between the client application and the Mariana Tek API, handling the complexities of translating anonymous group bookings into the GMS's single-booking authenticated model.
- **Sanity for content:** The sauna's marketing pages, service descriptions, and booking flows are managed in Sanity, keeping content separate from the booking logic.
- **Next.js frontend:** A responsive booking experience built with Next.js that guides users through group selection, spot preferences, and checkout without ever requiring login.
