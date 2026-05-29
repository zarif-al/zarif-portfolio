## Overview

A centralized API gateway sitting at the edge of a microservices ecosystem — handling rate limiting, authentication, distributed request tracing, and schema validation before requests ever reach a downstream service. Drastically reduced inter-service coupling and gave the platform team observability they'd never had.

## Architecture Decisions

- **Kong at the edge:** Chose Kong as the gateway engine for its plugin ecosystem — rate limiting, JWT validation, and request transformation are declarative plugins, not custom code.
- **Custom auth service:** A lightweight NestJS service behind Kong that handles token issuance, refresh, and revocation — Kong proxies auth decisions, the service owns the logic.
- **OpenTelemetry tracing:** Every request gets a trace ID injected at the gateway and propagated through all downstream services — debugging a slow request across five microservices went from hours to minutes.
- **Schema validation at the edge:** JSON Schema validation at the gateway catches malformed requests before they waste downstream compute — invalid payloads never leave the edge.
