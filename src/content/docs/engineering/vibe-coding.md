---
title: Vibe Coding
description: Guidance on AI tools
authors:
  - name: Ramy Kaddouri
    url: https://github.com/rk234
---

*TLDR*: Use AI responsibly. Ensure you understand, review, and test generated code. Ensure that the generated code is as simple, concise, and idiomatic as possible. Increasingly you'll be tasked with reviewing AI output. Knowing the difference between good code and bad code requires experience writing code, often bad code, yourself. Investing time in this learning process will make you a better and more productive engineer.

## Overview

Your primary goal as an engineer is to produce maintainable, working, and efficient code that solves your problem within your project's constraints. You should use all the tools at your disposal to achieve this goal, but be mindful of the compromises and issues that may arise with each. Unlike most tools we use (compilers, code gen, static analysis, etc.), LLMs are non-deterministic and so must be treated with greater care. Powerful tools can be incredibly useful, but can also cause significant damage when used improperly.

## Common Issues

### Verbosity

LLMs tend to produce [verbose and overly defensive code](https://noenthuda.substack.com/p/why-llms-write-horrible-code). More code increases the surface area for bugs and introduces additional review burden on your team. Nobody can meaningfully review [1k+ line PRs](https://www.cubic.dev/blog/does-pr-size-actually-matter).

### Unidiomatic code

LLMs are trained on historical data. As a result, they may not know about newer language constructs, APIs, or libraries that make code simpler and more concise. They'll sometimes try to reinvent the wheel when pre-existing solutions exist.

### Poor design decisions

LLMs usually follow the path of least resistance when implementing a solution. Rarely is this also the most maintainable or sound solution. As your project grows, this tends to compound into a series of hacky fixes that make future work even more difficult. 

### Lack of verification

Without a means to verify that changes were correct and did not introduce regressions, agents are more likely to produce faulty code based on bad assumptions. Likewise, without automated verification it's difficult for reviewers to trust the correctness and quality of LLM generated code. 

## Best Practices

Most of the ways to mitigate these issues are standard software engineering practices. Implementing them will make the developer experience for both humans and agents better and more productive.

### Use Git

Create a branch for an agent to work on and make frequent commits. This allows you the freedom to experiment without risking messing up existing working code.

### Split up tasks

Split up tasks for your agent, or prompt them to split up a large task into smaller pieces. When assigning a larger task, ask the agent to submit stacked PRs for each logical piece. This makes reviewing the changes easier and gives the model smaller individual pieces of work, reducing the chance of mistakes.

See the [best practices](/docs/engineering/best-practices#prs) doc for more on stacked PRs.

### Enforce strict deterministic checks

Give agents a way to verify their changes end to end. This can be done through:

1. A robust test suite, with both unit and end to end tests when needed
2. Strict linting, static analysis, typechecking and build checks
3. Asking the agent to take a screenshot of its final result to prove it's completed the task

The more that can be verified automatically, the better feedback the model gets and the less you have to worry about as a reviewer.

### Design and research first

For larger changes, come up with the design yourself first. Make sure to research any relevant technologies or potential road blocks you may encounter. Agents tend to jump straight into implementation without taking a step back to examine whether their plan is possible, introduces unforeseen issues, or if there are better technologies to use. 

### Reference docs and examples

Include links to documentation as much as you can. This is especially important when working with newer libraries that may not be well represented in training data. 

Provide examples of existing code in your code base if you're implementing something similar. Models are pretty good at maintaining similar code style and implementation patterns when you show them exactly what you want. Even better if you wrote the initial example yourself by hand.

## How do I know if the LLM produced "good" code?

By writing bad code yourself and realizing why it was bad.

Everyone will start out writing bad code. When you have to maintain and use the code you wrote, you'll start to notice its issues and shortcomings. The pain and friction you experience is what drives the learning process. The next time you go to implement something similar, you'll know what not to do.

The more you do this, the more skilled an engineer you become and the more you develop your taste. You'll be able to spot code smells while reviewing code because you've made those same mistakes yourself, and you'll know how to address them.

This taste is essential to reviewing code, regardless of whether a human or LLM wrote it. Investing time in developing it will pay dividends both in your personal development as an engineer and in your career.
