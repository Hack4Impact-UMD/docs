---
title: Architecture Decisions
description: What to decide early, what to optimize for, and how to avoid common structural mistakes
authors:
  - name: Ori Marx
    url: https://github.com/orimcoding
---

Early architecture decisions matter less because they are permanent and more because they create defaults. Once a team starts building, those defaults become habits. If the defaults are good, the codebase tends to stay understandable. If they are bad, the team spends the semester working around them.

This page is not about finding the perfect stack. It is about making a few high-leverage decisions early so the project stays easy to build, review, and hand off.

## What to optimize for

For most Hack4Impact projects, the best architecture is usually not the most sophisticated one. It is the one that best supports:

- fast onboarding for new engineers
- clear ownership of business logic
- safe local development
- predictable deployment
- maintainable handoff at the end of the semester

That usually means preferring boring, well-supported tools and a structure that makes responsibilities obvious.

## Decisions to make explicitly in week 1

A tech lead should make these decisions early and document them somewhere the team can find.

### 1. Where does business logic live?

This should have a clear answer: **the backend**.

If validation, permissions, and core rules are spread across frontend components, the app becomes harder to reason about and easier to break. The frontend should mostly collect input, render state, and call backend functionality.

This is one of the most important architectural boundaries to defend.

### 2. What is the contract between frontend and backend?

Do not let this become informal.

Your frontend and backend need a shared understanding of:

- what inputs are valid
- what outputs look like
- what errors can happen

A good default is to define schemas once and use them as the source of truth. This reduces drift between runtime validation and TypeScript types.

### 3. What should local development depend on?

Local development should depend on local services whenever possible, not production infrastructure.

If engineers need access to shared cloud resources just to run the app, onboarding slows down and people become hesitant to test aggressively. Emulator-based local development is usually the right default.

### 4. What checks are required before code merges?

Decide this before the codebase grows.

At minimum, most projects should require:

- linting
- formatting or format checks
- typechecking
- a full build
- tests for critical flows

If you wait too long to enforce these, the team will build around the absence of constraints.

## Frontend and backend boundaries

A lot of project pain comes from weak boundaries rather than bad code.

A useful rule of thumb:

- **frontend:** rendering, interaction, local UI state, auth state, calling backend procedures
- **backend:** validation, permissions, business rules, database access, side effects

This does not mean the frontend should be dumb. It means the frontend should not be authoritative.

If a rule matters for correctness or security, it belongs on the backend.

## Shared schemas and types

Shared code is valuable when it reduces duplication. It becomes harmful when it turns into a dumping ground.

A good use of shared code:

- schemas for data crossing the frontend/backend boundary
- types inferred from those schemas
- small utilities that are truly cross-cutting

A bad use of shared code:

- frontend-specific helpers used nowhere else
- backend implementation details
- large abstractions created “just in case”

Keep the shared layer narrow. It should define contracts, not blur responsibilities.

## Choosing managed services pragmatically

For most H4I projects, managed services are a good tradeoff. They reduce setup burden and let the team focus on product work.

That said, you should still make the tradeoff consciously.

### Firebase is a good fit when:

- you want fast setup
- your data model is not highly relational
- your team values integrated auth, hosting, storage, and functions
- emulator support will meaningfully improve local development

### Firebase may be a worse fit when:

- your app needs complex relational queries
- you expect heavy reporting or analytics requirements
- your team would benefit more from SQL tooling and migrations

This is why `tech-stack.md` emphasizes tradeoffs rather than one universal answer.

## Complexity: when to accept it and when to avoid it

Not all complexity is bad. Some complexity buys safety, clarity, or speed later.

Good complexity usually:

- enforces a useful boundary
- removes repeated manual work
- prevents a class of bugs
- makes team behavior more consistent

Bad complexity usually:

- exists to feel “enterprise”
- solves a problem the project does not have yet
- hides simple behavior behind too many abstractions
- makes onboarding harder without a clear payoff

A good tech lead is not the person who chooses the simplest stack at all costs. It is the person who chooses complexity deliberately.

## How to document decisions

You do not need long design docs for every choice. But you do need a record of why important decisions were made.

A short architecture note is usually enough. For each major decision, write down:

- the decision
- the alternatives considered
- why the chosen option fits this project
- what tradeoffs the team is accepting

This is especially useful at handoff time. Future engineers should not have to reverse-engineer the reasoning from the codebase.

## Common bad decisions

A few patterns are worth avoiding:

- letting the frontend talk directly to the database
- duplicating types instead of sharing schemas
- introducing multiple ways to fetch or mutate server state
- choosing tools because they are trendy rather than well-supported
- delaying CI and tests until after major features are built
- over-abstracting before the team understands the domain

These mistakes are common because they feel fast in the moment. They usually create drag later.

## A practical default

If you want a concrete example of these ideas, the [Vite + tRPC + Firebase template](https://github.com/Hack4Impact-UMD/vite-trpc-firebase-template) is a strong reference point.

It is useful not because every project should copy it exactly, but because it encodes several good defaults:

- a clear frontend/backend boundary
- shared schemas at the contract layer
- local development with emulators
- built-in checks and tests
- a deployment path that is already thought through

Use it when its tradeoffs fit your project. Otherwise, borrow the architectural ideas even if you choose different tools.

## Related docs

- [Choosing a Tech Stack](/docs/tl/tech-stack)
- [General Best Practices](/docs/engineering/best-practices)
- [Writing Better React](/docs/engineering/writing-react)
- [Vite + tRPC + Firebase template](https://github.com/Hack4Impact-UMD/vite-trpc-firebase-template)
