Modules, decorators, dependency injection — NestJS has all the Spring Boot patterns Node.js developers love to hate. But the real reason I reach for it isn't the architecture patterns. It's that NestJS forces structure that survives team turnover.

## Convention over configuration

When you open a NestJS project, you know where things are. Controllers are in `*.controller.ts`. Services in `*.service.ts`. DTOs in a `dto/` folder. Guards in `guards/`. This isn't enforced by the framework — it's enforced by the community. Every developer who touches a NestJS project learns the same patterns. That's worth more than any individual feature.

## Dependency injection done right

Express lets you wire things however you want. That freedom is a liability on a team of five. NestJS's DI container gives you a single way to compose services. Your `OrderService` depends on `PaymentService` and `InventoryService`? Declare them in the constructor. The container handles instantiation, lifecycle, and scoping. You handle the business logic.

## When I don't use it

For a single-endpoint microservice? Overkill. For a serverless function? Too heavy. For a CLI tool? Wrong tool. NestJS shines when you have multiple modules, shared middleware, and a team that will grow. It's not the answer to every problem — but when the problem is "organize a growing backend codebase so the next engineer can understand it in ten minutes," it's the best answer I've found.
