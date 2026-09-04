---
title: General Best Practices
description: Suggestions to make your team more productive
authors:
  - name: Ramy Kaddouri
    url: https://github.com/rk234
---

These are a collection of engineering best practices to make your team more productive and build reliable apps. Some of these may be opinionated or not relevant to your project's context. Take them as suggestions and feel free to contribute your thoughts as well!

## Architecture

At a high level:

* **Your frontend should be a thin client.** Ideally, your frontend code exists to query the backend, hold local authentication state, and do minimal processing on the data it fetches. **Your frontend should never have direct database access**. Firestore [security](https://env.fail/posts/firewreck-1/) rules are limited, prone to errors, and it is simply bad practice. No serious production web application does this for good reason.
* **Your backend should handle the core logic of the app.** Your backend must handle requests from the frontend, validate any data received, interact with the database, and verify authentication. It is the central source of truth.

Mixing these responsibilities leads to less maintainable and buggy code (speaking from experience).

## PRs

PRs should represent self-contained units of work. Smaller PRs make reviewing easier and more effective. Meaningfully reviewing 1k+ line PRs is almost never feasible.

When possible, use and encourage [stacked PRs](https://docs.github.com/en/pull-requests/how-tos/stacked-pull-requests). Stacked PRs let you split up large code changes into a chain of smaller, dependent PRs you can review and merge independently. Each PR in the stack builds on top of the changes from the PRs below it. For example, if you're writing a signup page you can split up the stack like this:

1. PR#1: Add backend functionality for sign up with tests (bottom of the stack)
2. PR#2: Create the frontend for the sign up page
3. PR#3: Integrate the frontend with the backend (top of the stack)

Splitting up a task this way makes reviews easier. Each PR now encapsulates only a small portion of the work, reducing the burden on reviewers and giving them better context on the changes.


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

## Local Dev

Make sure you have an easy to use local development environment. Your local dev environment should be completely disconnected from the deployed version of your app. Ideally, you should be able to spin it up with just one command (`pnpm dev`).

For Firebase, this means you should make use of the Firebase emulators. Ensure that when run locally, your app automatically connects to the emulators.

## Test Data

As your app grows, you'll need to test on a growing set of user flows, states, and use cases. Manually reproducing these cases each time is time consuming and prone to error. Instead, you should invest time (or tokens) in creating some tooling to generate test data for you. Libraries like [faker](https://github.com/faker-js/faker) and the [flame](https://github.com/rk234/flame-cli) CLI make this easier.

For an example, see the seed scripts in the [KFK repo](https://github.com/Hack4Impact-UMD/kfk-gift-registry/tree/main/scripts).

This greatly accelerates your development process allowing you to iterate faster and can be reused for automated testing.

