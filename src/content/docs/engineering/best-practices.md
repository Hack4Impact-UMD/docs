---
title: Best Practices
description: Suggestions to make your team more productive
---

These are a collection of engineering best practices to make your team more productive and build reliable apps. Some of these may be opinionated or not relevant to your project's context. Take them as suggestions and feel free to contribute your thoughts as well!

## CI Checks

CI is a great way to enforce automated quality and correctness checks on PRs. CI checks reduce review burden and give immediate feedback. Some good checks include:

* **Linting**: Linters parse the source code and search for harmful patterns defined in lint rules. Strict linting can help catch some easy bugs and prevent the use of risky or dangerous constructs. `oxlint` is a great example.

* **Formatting**: Format checks ensure all code uses correct formatting. This is useful for upholding consistent conventions across the project. `oxfmt` is recommended.

* **Typecheck**: Sometimes, changes to one part of the codebase can introduce type errors in an entirely different part. Typechecking the full project in CI lets you catch type errors before they're deployed.

* **Full Build**: Fully building the project will catch build errors before you try to deploy, saving you from troubleshooting on main.

* **Unit/E2E Tests**: Test full project functionality to make sure nothing broke.

## Testing

Good unit and E2E tests will save manual testing time and make you more confident in changes. As projects grow, even small changes can have unexpected impacts on the rest of the codebase. Being able to identify issues quickly and ensure the robustness of your code is critical. **Issues after handoff are not fun, especially when people depend on your work.**

:::note

Historically, testing has been seen as overly time consuming for H4I projects. The one-to-two semester timelines meant writing tests was deprioritized over implementing functionality.

Now, AI tools change this calculation. Generating tests is fast, although quality may not always be great. **You should always make sure your tests address all possible edge cases and prioritize key user flows.** A small number of high quality tests is better than many slop ones.

Tests are an investment in future reliability and maintainability. Any serious piece of software *needs* testing, and preferably *automated* testing.
:::

### On E2E Testing

E2E testing is very valuable . It simulates your app in the same environments users will see it (with a real browser!). You can automate clicks, inputs, and scrolling. Use it against a local dev environment (like Firebsae emulators) to test your apps frontend and backend together. 

E2E tests can uncover issues that unit tests miss, usually at the boundary between your frontend and backend. But, they will provide less specific feedback when things go wrong. Use them for key user flows you want to be sure work every time.

## Schema Validation

**You should never trust data from your frontend**. For both correctness and security reasons, you backend should always validate the data it receives. There are many schema validation library options that follow the standard schema spec to choose from. The main ones are:

1. [ArkType](https://arktype.io/): newer option that's fast with a familiar TypeScript like syntax
2. [Zod](https://zod.dev/): Tried and tested
