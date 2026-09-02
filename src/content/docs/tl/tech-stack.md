---
title: Choosing a Tech Stack
description: What to prioritize and some suggested technologies
---

> *TLDR*: See the [new project template repo](https://github.com/Hack4Impact-UMD/vite-trpc-firebase-template) for a concrete example of these suggestions. Feel free to use it as is, make changes, or make your own stack! It's a minimal template designed to help you get started faster without worrying about boilerplate.

Choosing your tech stack will be among the first things you'll 
do when starting a new project. Project constraints and requirements may influence it. This page provides some suggestions on what to prioritize and showcases some helpful technologies to ensure your project is successful.

## What to prioritize

When selecting technologies and services for your app, it's good to keep these things in mind:

1. **Cost:** Always ensure your hosting provider and services are within your NPOs budget. Try to estimate cost based on expected usage as best you can and communicate that with the NPO ahead of time.

1. **Support:** Well-supported projects with an established user-base will make your developer experience easier. You'll be more likely to find documentation or resources from people who have encountered similar issues. New technologies may have a lack of resources, and are less likely to work well with AI tools.

1. **Typesafety**: Prioritize libraries and frameworks with first-class TypeScript support. Strive for end-to-end typesafety across your frontend and backend when possible as well. Typesafe libraries will provide a superior developer experience (better autocomplete in your editor and type hints)and make your code more reliable. The more you can verify at build time, the less likely you are to miss bugs.

1. **Team Familiarity**: Try to find technologies that you and your team are familiar with. This will make you a better resource when issues come up, and reduce the time it takes for engineers to ramp up. **This does not mean you should never pick new tools**. Learning new stuff is a constant in software engineering (and pretty fun!). Being able to pick things up quickly will serve your team well in the future. As always, weigh the tradeoffs.

These are general suggestions from past experience. Each project has different constraints and priorities. Your judgement will always be best.

## Useful Tech

A collection of frameworks, libraries, and services that might be a good fit based on experience from past H4I projects.

### Package Managers

Prefer [`pnpm`](https://pnpm.io). It provides greater security protections compared to `npm` and has first-class monorepo support with workspaces. It's also [faster](https://pnpm.io/motivation#boosting-installation-speed). 

You can just replace `npm` with `pnpm` when writing commands and it'll just work most of the time.

### Backend Solutions

Your backend will usually need to provide four main services: Compute, Database, Hosting, and Storage.

#### Firebase

Most H4I projects use Firebase. It's a cost-efficient solution that provides most services you need for a full-stack app (auth, database, web hosting, cloud storage, and cloud functions). Most of these services are pretty good. The database offering, Firestore, is very basic compared to most other document database options. The lack of good tooling, migration features, and full-text search are the main things you'll notice as your project grows.

#### Supabase

Supabase is an open source Firebase alternative. It provides most of the same services as Firebase.

Supabase uses PostgreSQL for their database offering. PostgreSQL is significantly popular compared to Firestore, and thus has much better developer tooling and libraries available ([Drizzle](https://orm.drizzle.team/) is a great example).

Supabase pricing uses a flat monthly subscription + usage based billing for anything above limits. This usually ends up being more expensive than Firebase for projects of our scale.

#### Custom

You can achieve similar cost to Firebase by building your own backend stack. A few good options:

* **Cloudflare**: [R2](https://www.cloudflare.com/products/r2/) is their cloud storage service, [D1](https://developers.cloudflare.com/d1/) is their serverless SQL offering, and [Workers](https://www.cloudflare.com/products/workers/) is their serverless compute product. Cloudflare pricing is usage based and usually pretty generous.
* **Neon**: Neon is a serverless PostgreSQL database service. Usage based pricing is comparable to Firebase.
* **Auth**: Clerk, Auth0, and WorkOS provide auth solutions similar to Firebase. Pricing, features, and integrations vary by the provider.

### Web Frameworks

#### Vite SPAs

The standard approach and most popular with past projects. Your frontend and backend are more isolated. If you go with this, make sure to use a backend framework that facilitates end-to-end typesafety with your frontend like [tRPC](https://trpc.io). It will dramatically reduce the amount of code you need to write and eliminates a class of bugs.

For an example, see the [new project template repo](https://github.com/Hack4Impact-UMD/vite-trpc-firebase-template).

#### TanStack Start

[TanStack Start](https://tanstack.com/start) is a modern full-stack React framework with an emphasis on typesafety, server side rendering, and fast page loads. Server functions let you call your backed from your frontend directly and reduce code duplication. Uses TanStack Router. Recommended if you're willing to invest some time to setup deployments and auth. You'll most likely run into two common issues:

1. If using with Firebase in a monorepo environment, deployments to App Hosting may take some additional setup. You'll likely need to use the `isolate` package for functions deployments. See the [KFK repo](https://github.com/Hack4Impact-UMD/kfk-gift-registry) for reference.
2. If using with Firebase, you may need to implement both session-cookie based auth and client side auth. See the [KFK repo](https://github.com/Hack4Impact-UMD/kfk-gift-registry) for reference.

#### Next.JS

Vercel's full-stack React framework. Has been around much longer than TanStack, and thus has a larger community and resources. Has integration with Firebase App Hosting (however Vercel has historically provided a worse experience on other hosting providers) and has server side features for end-to-end typesafety.

**If you do use Next.JS, make sure you leverage the server side features**. Next.JS without them has little benefit over a traditional SPA.

### Frontend

#### Data Fetching & State Management

Always use [TanStack Query](https://tanstack.com/query). There's rarely a good reason to write data fetching logic yourself.

#### Routing

Usually this will be decided for you by the framework you choose. When you can pick for yourself, try to use a typesafe router like [TanStack Router](https://tanstack.com/router) when possible.

React Router is the default choice for most existing projects. Its declarative mode is very basic and lacks modern features, like validation and file-based routing, that other routers support.

### Backend

#### Express & Hono (HTTP)

[Express](https://expressjs.com/) and [Hono](https://hono.dev/) are HTTP API frameworks. They let you structure your routes, parse dynamic arguments, and create middleware for reusable request logic. Hono is newer, lighter, and usually faster with support for runtimes other than Node.

Use these directly only if your project requires an external HTTP/REST API. Always make sure to pair them up with strict schema validation to make sure data coming into the API is valid.

#### tRPC (RPC)

[tRPC](https://trpc.io) is a typesafe remote procedure call framework. It allows you to define
procedures on your backend (think of these as functions) and call them
from your frontend.

tRPC differentiates itself from other frameworks by ensuring that you can only
call your backend with input that adheres to the expected schema. Likewise, tRPC
makes your frontend aware of the exact schema that each procedure will return.

Combined, this provides a better developer experience (your editor will show you
the types each procedure accepts and returns) and rules out an entire class of bugs
at build time (you can no longer give your backend bad data!).

tRPC is tightly integrated with TanStack Query, allowing you to easily turn your
procedures into queries and mutations. You'll see examples of this in the template.
