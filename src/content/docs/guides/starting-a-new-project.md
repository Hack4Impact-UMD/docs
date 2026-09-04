---
title: Starting a New Project
description: A practical guide to getting a new H4I project off the ground
authors:
  - name: Ori Marx
    url: https://github.com/orimcoding
---

This guide is a practical starting point for new Hack4Impact UMD engineering projects. It pulls together the recommendations from the rest of these docs into a concrete setup flow you can follow when kicking off a new app.

If you want a strong default, start from the [Vite + tRPC + Firebase template](https://github.com/Hack4Impact-UMD/vite-trpc-firebase-template). It is a minimal full-stack TypeScript monorepo that already includes many of the patterns recommended in these docs.

## What this guide assumes

This guide assumes you want a stack with:

- a React frontend
- a backend that owns business logic
- end-to-end TypeScript typesafety
- local development with Firebase emulators
- automated linting, formatting, typechecking, and tests

If that matches your project, the template is a very good place to start.

## Recommended default stack

The template uses:

- **Frontend:** React, Vite, TanStack Router, Tailwind CSS
- **Backend:** tRPC on Express, deployed with Firebase Cloud Functions
- **Shared code:** common types and [ArkType](https://arktype.io/) schemas
- **Tooling:** `pnpm`, Turborepo, `oxlint`, `oxfmt`, Vitest, and Playwright

This stack aligns well with the guidance in [Choosing a Tech Stack](/docs/tl/tech-stack) and [General Best Practices](/docs/engineering/best-practices).

## Why this template is a good default

A good starter project should make the right things easy:

- keep the frontend thin
- centralize logic in the backend
- validate data at the boundary
- make local development easy to run
- make correctness checks automatic

The template does all of these reasonably well out of the box.

### Frontend and backend separation

The frontend calls the backend through tRPC instead of talking directly to the database. This matches the recommendation in [General Best Practices](/docs/engineering/best-practices) that the frontend should stay thin and the backend should remain the source of truth.

### End-to-end typesafety

The frontend, backend, and shared package all use TypeScript source directly. tRPC exposes backend procedure types to the frontend, and shared schemas define the shape of data in one place.

### Schema-first development

The template uses ArkType for validation. A strong pattern is to define schemas first, then infer TypeScript types from them. That reduces duplication and prevents drift between runtime validation and static types.

### Strong local development

The template uses Firebase emulators and a demo project ID by default, so you can get started without needing a real Firebase project. That makes onboarding easier and lowers the risk of accidentally touching production resources during development.

## Before you start

Install these tools first:

- **Node.js:** 22 or later
- **pnpm:** 11 or later
- **Java:** 21 or later

Java is required because the Firebase Auth and Firestore emulators depend on it.

You do **not** need a Firebase account to begin. The template uses the project ID `demo-vtf-template`, and Firebase treats `demo-` projects as offline demo projects.

## Initial setup flow

### 1. Start from the template

Use the [Vite + tRPC + Firebase template](https://github.com/Hack4Impact-UMD/vite-trpc-firebase-template) as your base.

This gives you:

- basic routing and protected routes
- a minimal login/logout flow
- Firestore setup
- shared schemas and types
- sample unit tests and E2E tests
- CI-friendly commands

### 2. Install dependencies

Run the install step from the template README.

Once installed, the main development command is `pnpm dev`.

### 3. Verify the local environment works

The development environment starts three main processes:

- Vite on `http://127.0.0.1:5173`
- the backend bundler in watch mode
- Firebase emulators, with Emulator UI on `http://127.0.0.1:4000`

Before writing feature code, make sure everyone on the team can boot the app locally.

### 4. Run the checks early

Use the provided checks before making major changes:

- `pnpm checks`
- `pnpm test:e2e`

This confirms the template is healthy on your machine before you start customizing it.

## How to structure work in the template

### Add a page

TanStack Router uses file-based routing. New route files in `packages/frontend/src/routes` become pages.

This is a good default because it keeps routing explicit, discoverable, and typesafe.

### Add backend functionality

A typical flow looks like this:

1. define the input schema in `packages/common/src/schemas.ts`
2. add the procedure in `packages/backend/src/routers/index.ts`
3. call it from the frontend with the generated tRPC helpers
4. add unit tests for the procedure

This is a clean pattern because validation, backend logic, and frontend usage stay connected.

### Share types and schemas centrally

Keep shared domain models in the common package whenever both frontend and backend need them. Avoid redefining the same shapes in multiple places.

## Recommended engineering conventions

When starting a new project, align on these conventions early.

### Keep the frontend thin

The frontend should focus on rendering UI, collecting input, and calling backend procedures. Avoid putting core business rules in React components.

For more on this, see [General Best Practices](/docs/engineering/best-practices).

### Prefer query and mutation libraries over manual effects

Use TanStack Query for server state. Avoid hand-rolled fetching in `useEffect` when a query or mutation hook is the better fit.

For related React guidance, see [Writing Better React](/docs/engineering/writing-react).

### Validate all external input

Treat all frontend input as untrusted. Validate it in the backend using shared schemas.

This is one of the highest-leverage habits you can establish early.

### Use aliases instead of relative imports

The template bans relative import paths in many cases and provides aliases like:

- `@common/*`
- `@backend/*`
- `@frontend/*`
- `@e2e/*`

This keeps imports more stable as the codebase grows.

## CI and quality gates

A new project should have automated checks from day one.

The template already supports:

- linting
- formatting
- typechecking
- unit tests
- E2E tests
- full builds

These map directly to the recommendations in [General Best Practices](/docs/engineering/best-practices#ci-checks).

If you adopt this template, make those checks required on pull requests as early as possible.

## Local development expectations

A healthy project should be easy to run and hard to misuse.

Aim for these properties:

- one command to start local development
- local services isolated from production
- seeded or reproducible test data
- a documented setup process for new engineers

The template already gets you close to this standard through `pnpm dev` and the Firebase emulator setup.

## When to connect a real Firebase project

Do not rush to connect production infrastructure.

Start locally first. Once the team is comfortable:

1. create the Firebase project
2. enable Authentication, Firestore, Hosting, and Cloud Functions
3. configure the Firebase CLI
4. copy `.env.example` to `.env`
5. add the real web app configuration

This sequence reduces setup mistakes and keeps early development fast.

## Deployment model

The template deploys with `pnpm deploy`.

At a high level:

- the frontend and backend are built first
- the backend bundle is prepared in a Firebase-compatible format
- Firebase Hosting and Functions receive the built output

The repository also includes GitHub Actions workflows for checks and deployment, which makes it a strong baseline for team projects.

## Suggested kickoff checklist

When starting a new H4I project, try to complete this checklist in the first few days:

- choose the stack and document why
- confirm everyone can run local development
- verify emulator-based auth and database flows work
- set up required CI checks on pull requests
- define shared schemas for core domain models
- decide how test data will be generated
- document environment setup and common commands
- identify one or two key E2E flows to protect early

## Related docs

- [Choosing a Tech Stack](/docs/tl/tech-stack)
- [General Best Practices](/docs/engineering/best-practices)
- [Writing Better React](/docs/engineering/writing-react)
- [Vite + tRPC + Firebase template](https://github.com/Hack4Impact-UMD/vite-trpc-firebase-template)

## Recap

If you want a practical default for a new Hack4Impact UMD app, the [Vite + tRPC + Firebase template](https://github.com/Hack4Impact-UMD/vite-trpc-firebase-template) is a strong choice.

It gives you:

- a clear frontend/backend boundary
- end-to-end typesafety
- schema validation
- local development with emulators
- built-in quality checks
- a deployment path that already works

That means your team can spend less time on boilerplate and more time building the product.
