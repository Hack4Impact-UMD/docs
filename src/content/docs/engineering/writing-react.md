---
title: Writing Better React
description: Tips for cleaner, idiomatic, and correct React code
---

> *TLDR:* Avoid `useEffect` unless absolutely necessary, follow rules of hooks, make components that compose, create reusable hooks for common logic.

## Avoid `useEffect`

`useEffect` should almost never be used. It has plenty of foot-guns and degrades readability. There are almost always better alternatives.

See the great [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) article.

## Compose Instead of Branch

Prefer writing composable components. These will be the building blocks for your app. Changing logic or UI should be as easy as swapping out a component, adding, or removing a component.

See this excellent short talk: [Composition is All You Need](https://www.youtube.com/watch?v=4KvbVq3Eg5w)

## Write Your Own Hooks

Hooks are a powerful feature of modern React. Leverage it to make your code cleaner and isolate common logic.

See this talk for greater detail on how you can use hooks and their internals: [React Today and Tomorrow and 90% Cleaner React With Hooks](https://www.youtube.com/watch?v=dpw9EHDh2bM)
