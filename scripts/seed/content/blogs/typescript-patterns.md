Your DTO layer is the most important code in a NestJS service. Get it right and bugs stop at the boundary. Get it wrong and invalid data flows through your entire system. Here are the patterns I reach for on every project.

## Branded types

A string is a string — until it's a `UserId`, a `TenantId`, or a `PaymentIntentId`. TypeScript's structural typing means all three are interchangeable unless you brand them. A simple branded type wrapper gives you compile-time safety without runtime overhead. Pass a `TenantId` where a `UserId` is expected? Compiler error. This catches an entire class of argument-ordering bugs.

## Zod at the boundary

Validate once at the edge, trust everywhere inside. A Zod schema at your controller layer means the data entering your service is guaranteed to match your types. Parse incoming, never cast. The pattern: `const parsed = MySchema.parse(req.body)`. If it passes, the rest of your code gets a fully-typed, runtime-validated object. No defensive null checks three layers deep.

## Discriminated unions for API responses

A REST endpoint that returns `User | { error: string }` forces every consumer to narrow the type before accessing fields. Discriminated unions make this explicit. Now consumers check `response.status` and TypeScript narrows automatically. This is especially powerful in generated API clients where the types are shared between frontend and backend.
