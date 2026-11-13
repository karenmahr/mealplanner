# MealPlanner repository instructions

## Project and stack

- MealPlanner is a personal recipe catalog and weekly meal-planning web app.
- Use Next.js 16 App Router, React, TypeScript, and Tailwind CSS.
- Deploy the app to Vercel.
- The target source layout is `src/app`, `src/components`, `src/lib`, and `src/types`. Keep application code inside `src/`. If migrating existing root-level application files, move related imports together and do not leave duplicate route trees.
- Use the existing npm scripts: `npm run dev`, `npm run lint`, `npm run build`, and `npm run format:check`.

## Architecture

- Use App Router file conventions for routes. MVP routes are `/`, `/login`, `/recipes`, `/recipes/new`, `/recipes/[id]`, `/recipes/[id]/edit`, `/dashboard`, and `/planner`.
- Keep reusable UI in `src/components` and group it by feature: `layout`, `auth`, `ingredients`, `recipes`, `planner`, and `feedback`.
- Keep shared server-only database access and validation helpers in `src/lib`; shared TypeScript types belong in `src/types`.
- Prefer Server Components. Add `'use client'` only to components that need state, event handlers, browser APIs, or interactive controls.
- Keep Client Component props serializable. Do not import server-only modules from Client Components.

## Authentication and authorization

- Use Clerk for sign-up, sign-in, session management, identity, and protected routes. Do not add Auth.js or custom password/session handling.
- Store an application profile in the local `Users` table with a unique `clerkUserId`; use the local user ID for foreign-key relationships.
- Enforce ownership server-side for recipes, feedback, schedules, and meal-plan entries. Never rely on client-side checks for authorization.
- Keep Clerk secrets in environment variables. Never expose `CLERK_SECRET_KEY` to client code or commit credentials.

## Database

- Use Neon PostgreSQL through the Neon serverless driver. Do not add an ORM.
- Run database queries only from server-only code: Server Components, Route Handlers, Server Actions, or server modules.
- Always use parameterized SQL; never concatenate user input into SQL strings.
- Store SQL schema changes in ordered files under `db/migrations` and seeded development data under `db/seeds`.
- `DATABASE_URL` belongs in `.env.local` locally and Vercel environment variables in deployments. Never commit secrets.
- Preserve the agreed relational model: Users, Recipes, Ingredients, RecipeIngredients, ScheduleWeeks, MealPlanEntries, Feedback, and optional SavedRecipes.

## UI and accessibility

- Use Tailwind CSS and the shared design system.
- Use Warm Alabaster `#FAF9F6` for the page background, Sage Basil Green `#2E6F40` for primary actions, Warm Terracotta `#E07A5F` for decorative accents and ratings, and Charcoal Ink `#1F2937` for text and contrast.
- Use Plus Jakarta Sans for headings and recipe names, and Inter for body text and controls.
- Terracotta must not be the only indicator of state or be used as small text on the Alabaster background. Terracotta badges use Charcoal Ink text.
- Follow the spacing scale: 4, 8, 12, 16, 24, 32, and 48 px.
- Build mobile-first layouts that expand to recipe grids and planner columns on larger screens.
- Use visible labels, semantic headings, descriptive image alt text, keyboard-accessible controls, and visible focus states. Implement loading, empty, validation, and error states where relevant.

## Engineering conventions

- Use clear, feature-focused names and TypeScript types. Validate all external and user-provided input on the server.
- Do not introduce dependencies, database providers, ORMs, authentication providers, or UI libraries without team approval.
- Keep feedback persistence as a later enhancement; it must not block the core MVP of authentication, catalog search, recipe CRUD, and the weekly planner.
- Before submitting a pull request, run the relevant validation commands, at minimum `npm run lint` and `npm run build` for application changes.
