---
title: Vibe Coding
description: Guidance on AI tools
lastUpdated: 2026-09-29
authors:
  - name: Ramy Kaddouri
    url: https://github.com/rk234

  - name: Hita Thota
    url: https://github.com/spoofle
---

*TLDR*: Use AI responsibly. Ensure you understand, review, and test generated code. Ensure that the generated code is as simple, concise, and idiomatic as possible. Increasingly you'll be tasked with reviewing AI output. Knowing the difference between good code and bad code requires experience writing code, often bad code, yourself. Investing time in this learning process will make you a better and more productive engineer.

## Overview

Your primary goal as an engineer is to produce maintainable, working, and efficient code that solves your problem within your project's constraints. You should use all the tools at your disposal to achieve this goal, but be mindful of the compromises and issues that may arise with each. Unlike most tools we use (compilers, code gen, static analysis, etc.), LLMs are non-deterministic and so must be treated with greater care. Powerful tools can be incredibly useful, but can also cause significant damage when used improperly.

## Ownership and disclosure

**You own every line you submit, regardless of who or what wrote it.** "AI/Claude/Gemini/etc. wrote it" is never an answer in code review. If a reviewer asks why a line exists or what it does, you must be able to explain it. If you can't, you aren't done yet.

Disclose AI use in your PRs. Add a short note in the PR description saying which parts were generated (for example, "tests and the migration were generated with Claude Code; the service layer was written by hand"). This helps TLs understand how the code was written and isn't something that will be used against you. T

## Common Issues

### Verbosity

LLMs tend to produce [verbose and overly defensive code](https://noenthuda.substack.com/p/why-llms-write-horrible-code). More code increases the surface area for bugs and introduces additional review burden on your team. Nobody can meaningfully review [1k+ line PRs](https://www.cubic.dev/blog/does-pr-size-actually-matter).

**Example:** Here's what verbosity looks like in practice. A typical LLM response to "get a user's display name":

```ts
// Before: generated
function getDisplayName(user: User | null | undefined): string {
  try {
    if (user === null || user === undefined) {
      return "";
    }
    if (user.displayName !== null && user.displayName !== undefined && user.displayName !== "") {
      return user.displayName;
    } else if (user.email !== null && user.email !== undefined) {
      return user.email;
    } else {
      return "";
    }
  } catch (error) {
    console.error("Error getting display name", error);
    return "";
  }
}
```

The same thing, written idiomatically:

```ts
function getDisplayName(user?: User): string {
  return user?.displayName || user?.email || "";
}
```

The `try/catch` can't trigger, the null checks are redundant, and the comment explains nothing. Ask the agent to simplify, or simplify it yourself before opening the PR.

### Unidiomatic code

LLMs are trained on historical data. As a result, they may not know about newer language constructs, APIs, or libraries that make code simpler and more concise. They'll sometimes try to reinvent the wheel when pre-existing solutions exist.

### Poor design decisions

LLMs usually follow the path of least resistance when implementing a solution. Rarely is this also the most maintainable or sound solution. As your project grows, this tends to compound into a series of hacky fixes that make future work even more difficult. 

### Lack of verification

Without a means to verify that changes were correct and did not introduce regressions, agents are more likely to produce faulty code based on bad assumptions. Likewise, without automated verification it's difficult for reviewers to trust the correctness and quality of LLM generated code. 

## Security and privacy

* **Never paste secrets into a prompt.** API keys, service account files, `.env` contents, database URLs, and any real user data stay out of chat windows and agent sessions. Agents can read files in your repo, so keep secrets out of the repo too (use `.gitignore` and your platform's secret manager).
* **Watch for hallucinated packages.** Models invent plausible library names, and attackers register those names on npm and PyPI with malicious code ("slopsquatting"). Before installing any dependency an agent suggests, confirm it exists, is actively maintained, and is the package you think it is. Check the repo, the download count, and the publish date.
* **Treat some generated code as high-risk.** Anything touching authentication, authorization, user input handling, SQL or Firestore queries, file paths, or shell commands gets a closer read than the rest of the diff. These are the places where a subtle mistake becomes a vulnerability.
* **Respect licensing and IP rules.** Check with your tech lead about any restrictions from the nonprofit you're working with. Some partners have rules about AI tools or about where their data can be sent. Don't paste a partner's proprietary code or documents into a third-party tool without confirming that's allowed.

## Best Practices

Most of the ways to mitigate these issues are standard software engineering practices. Implementing them will make the developer experience for both humans and agents better and more productive.

### Use Git

Create a branch for an agent to work on and make frequent commits. This allows you the freedom to experiment without risking messing up existing working code.

### Split up tasks

Split up tasks for your agent, or prompt them to split up a large task into smaller pieces. When assigning a larger task, ask the agent to submit stacked PRs for each logical piece. This makes reviewing the changes easier and gives the model smaller individual pieces of work, reducing the chance of mistakes.

See the [PRs section of the best practices doc](/docs/engineering/best-practices#prs) for more on stacked PRs.

### Set up project context

Keep a project context file at the root of your repo (`CLAUDE.md`, `AGENTS.md`, or whatever your tool reads). This is the single biggest advantage you have on output quality. It should contain:

* The commands to install, run, lint, typecheck, test, and build the project (for most H4I projects that's `pnpm install`, `pnpm dev`, `pnpm lint`, `pnpm test`, and `pnpm build`; check your project's `package.json` for the exact scripts)
* Project conventions: folder layout, naming, how state is managed, which libraries to use for what
* Things to avoid: deprecated patterns, files not to touch

Keep sessions focused as well. When the context gets long or the agent starts going in circles, start a fresh session with a clean summary of the task instead of piling on corrections.

Highly recommended: Use plan mode, or ask for a plan first, before letting an agent edit files. Read the plan, fix it, and only then let it implement.

### Enforce strict deterministic checks

Give agents a way to verify their changes end to end. This can be done through:

1. A robust test suite, with both unit and end to end tests when needed
2. Strict linting, static analysis, typechecking and build checks
3. Asking the agent to take a screenshot of its final result to prove it's completed the task

The more that can be verified automatically, the better feedback the model gets and the less you have to worry about as a reviewer.

A few things to watch on the testing side:

* **Write or at least specify the tests yourself.** An agent that writes both the code and its tests can make them agree with each other while both are wrong. At the very minimum, list the cases you want covered and check that the generated tests actually exercise them.
* **Watch for agents gaming the checks.** Agents will weaken assertions, skip or delete tests, add `// eslint-disable` comments, or special-case inputs just to get CI green. Any change to an existing test or lint config in an AI-generated diff requires a second look.

### Design and research first

For larger changes, come up with the design yourself first. Make sure to research any relevant technologies or potential road blocks you may encounter. Agents tend to jump straight into implementation without taking a step back to examine whether their plan is possible, introduces unforeseen issues, or if there are better technologies to use. 

### Reference docs and examples

Include links to documentation as much as you can. This is especially important when working with newer libraries that may not be well represented in training data. 

Provide examples of existing code in your code base if you're implementing something similar. Models are pretty good at maintaining similar code style and implementation patterns when you show them exactly what you want. Even better if you wrote the initial example yourself by hand.

## Reviewing AI output

You'll spend a large amount of your time reviewing code that a model wrote, whether it's your own agent's output or a teammate's PR. Run through this checklist on every AI-generated diff:

* Is this the simplest approach that works? Could it be half the size?
* Does it duplicate a utility, hook, or component that already exists in the codebase?
* Are there `try/catch` blocks, fallbacks, or default values that can never trigger or that hide real failures?
* Are there comments that restate the code instead of explaining why?
* Are there unrelated changes in the diff (reformatting, renamed variables, touched files that have nothing to do with the task)?
* Did any test or lint config get weakened?
* Does any new dependency actually exist, and do we need it?
* For anything touching auth, input handling, queries, or file paths: did you read it line by line?

If the answer to the first question is "no," send it back before reviewing the rest.

### When not to use AI

There are times when generating the code robs you of the learning. Write it yourself when:

* You're learning a new language, framework, or concept for the first time
* You're doing onboarding tasks on a new project. The point of those tasks is for you to learn the codebase.
* It's the first time you've ever built a particular kind of thing

That's where the "write bad code yourself" lesson actually happens. Once you've built something once by hand, you'll be far better at judging whether the generated version is any good.

While you're still learning, use AI as a tutor rather than a generator. Prompts like "explain what this function does," "what's wrong with my approach here," or "what are the tradeoffs between these two designs" build your understanding. "Write this for me" doesn't.

## How do I know if the LLM produced "good" code?

By writing bad code yourself and realizing why it was bad.

Everyone will start out writing bad code. When you have to maintain and use the code you wrote, you'll start to notice its issues and shortcomings. The pain and friction you experience is what drives the learning process. The next time you go to implement something similar, you'll know what not to do.

The more you do this, the more skilled an engineer you become and the more you develop your taste. You'll be able to spot code smells while reviewing code because you've made those same mistakes yourself, and you'll know how to address them.

This taste is essential to reviewing code, regardless of whether a human or LLM wrote it. Investing time in developing it will pay dividends both in your personal development as an engineer and in your career.