# Feature Specification: MealPlanner - Personal Recipe Catalog & Weekly Meal Scheduler

**Feature Branch**: `001-mealplanner-catalog`  
**Created**: 2026-11-04  
**Status**: Updated after Week 03 planning meeting (2026-11-11)
**Input**: User description: "Create a project specification for MealPlanner, a full-stack personal recipe catalog and weekly meal scheduling web application with authentication, recipe discovery, calendar scheduling, custom recipe management, and community feedback."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Authenticated Meal-Planning Workspace (Priority: P0)

A user signs up or logs in through Clerk, remains signed in across visits, and opens a workspace containing only that user's saved plans and custom recipes.

**Why this priority**: Authentication and ownership boundaries are required for all personalized catalog and calendar behavior.

**Independent Test**: A new user can complete sign-up, sign in, refresh the workspace, sign out, and verify protected content is inaccessible while signed out.

**Acceptance Scenarios**:

1. **Given** an unauthenticated visitor, **When** they open a protected route, **Then** they are redirected to the authentication flow.
2. **Given** valid authentication, **When** sign-in completes, **Then** the user returns to the dashboard and a persistent session is established.
3. **Given** a signed-in user, **When** they sign out, **Then** protected routes redirect to authentication and personalized data is not rendered.
4. **Given** invalid or expired session data, **When** the user requests a protected operation, **Then** the system rejects it without exposing another user's data.

---

### User Story 2 - Discover and Filter Recipes (Priority: P0/P1)

A user browses pre-seeded and eligible custom catalog recipes, then enters one or more ingredients to dynamically narrow results.

**Why this priority**: Catalog discovery is the foundational experience and ingredient filtering is a core enhancement.

**Independent Test**: Recipes can be browsed and filtered from the catalog, including no-results and multi-ingredient states.

**Acceptance Scenarios**:

1. **Given** the catalog, **When** it loads, **Then** seeded recipes and eligible custom recipes are displayed.
2. **Given** ingredient input, **When** one ingredient is entered, **Then** matching recipes are returned.
3. **Given** multiple ingredients, **When** the user applies them, **Then** results are filtered consistently.
4. **Given** no matching recipes, **When** filtering completes, **Then** an empty-result message is shown.
5. **Given** malformed, oversized, empty, or duplicate search input, **When** a request is submitted, **Then** the system rejects or normalizes it safely.

---

### User Story 3 - Manage a Weekly Meal Calendar (Priority: P1)

A signed-in user views a Monday through Sunday weekly schedule and assigns recipes to lunch or dinner slots.

**Why this priority**: The planner is one of the application's primary workflows.

**Independent Test**: A user can assign, view, update, and clear lunch or dinner entries across a week.

**Acceptance Scenarios**:

1. **Given** an authenticated user with no schedule, **When** the calendar opens, **Then** 14 lunch/dinner slots render as empty states.
2. **Given** a valid recipe, day, and meal slot, **When** assignment is submitted, **Then** the slot is persisted.
3. **Given** an occupied slot, **When** the user updates it, **Then** the intended assignment is replaced.
4. **Given** an occupied slot, **When** the user clears it, **Then** the entry is removed.
5. **Given** invalid input or unauthorized access, **When** a mutation is attempted, **Then** the action is rejected and no partial update is persisted.

---

### User Story 4 - Manage Custom Recipes (Priority: P1)

A signed-in user creates, views, edits, and deletes recipes that they authored.

**Why this priority**: Custom recipe management provides one of the required CRUD workflows.

**Independent Test**: An authenticated owner can perform the full create/read/update/delete lifecycle while non-owners cannot edit or delete the recipe.

**Acceptance Scenarios**:

1. **Given** valid recipe fields, **When** create is submitted, **Then** a user-owned recipe is persisted.
2. **Given** required fields are missing or invalid, **When** create or edit is submitted, **Then** validation errors are shown.
3. **Given** a recipe owned by the current user, **When** they edit it, **Then** validated changes are persisted.
4. **Given** a recipe owned by another user, **When** edit or delete is requested, **Then** access is denied.
5. **Given** an owned recipe referenced by a calendar entry, **When** deletion is requested, **Then** related references are handled safely.

---

### User Story 5 - Read and Submit Catalog Feedback (Priority: P2 / Phase 2)

A user reads ratings and feedback for published recipes and an authenticated user can submit or maintain their own review.

**Why this priority**: Feedback improves the experience but is not required for the core MVP.

**Independent Test**: If implemented, feedback can be read and a user can only manage their own review.

**Acceptance Scenarios**:

1. **Given** a recipe with feedback, **When** its detail view opens, **Then** existing ratings and feedback are displayed.
2. **Given** valid rating/comment values, **When** a user submits feedback, **Then** it is validated and persisted.
3. **Given** duplicate review submission by the same user, **When** submitted, **Then** the existing review is updated instead of duplicated.
4. **Given** invalid rating or content values, **When** submission occurs, **Then** validation errors are returned.
5. **Given** a signed-out user, **When** they attempt review mutation, **Then** authentication is required.
6. **Given** unauthorized review modification or deletion, **When** requested, **Then** the operation is denied.

**Phase 2 Note**: This story must not block completion of the MVP.

---

### Edge Cases

- Weekly schedule has no entries.
- A recipe is deleted while referenced by the planner.
- Ingredient values contain duplicates or invalid input.
- Search input exceeds expected limits.
- The SQL database is unavailable.
- Authentication expires during a mutation.
- A user attempts to modify another user's data.
- Duplicate or repeated mutations are submitted.
- Unexpected request data is received.

---

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST authenticate users with Clerk and associate personalized data with the authenticated identity.
- **FR-002**: The system MUST persist weekly schedules, custom recipes, ingredients, feedback, and other required application data in a relational SQL database.
- **FR-003**: The system MUST provide a reproducible pre-seeded recipe catalog.
- **FR-004**: The catalog MUST support recipe discovery and multi-ingredient filtering.
- **FR-005**: The system MUST provide lunch and dinner slots for Monday through Sunday.
- **FR-006**: The system MUST allow authenticated users to assign, view, update, and clear calendar entries.
- **FR-007**: The system MUST enforce ownership and authorization for user-specific recipes and calendar data.
- **FR-008**: The system MUST allow authenticated owners to create, view, edit, and delete custom recipes.
- **FR-009**: If feedback functionality is implemented, the system MUST display published recipe ratings and feedback.
- **FR-010**: If feedback functionality is implemented, authenticated users MUST be able to submit, update, and remove their own review.
- **FR-011**: The system MUST expose `GET /api/recipes` as a Next.js Route Handler for recipe retrieval and validated search/filter queries.
- **FR-012**: Calendar mutations MUST verify session state, validate inputs, enforce ownership, persist valid changes, and update affected planner data.
- **FR-013**: The system MUST provide loading, error, validation, and empty states where appropriate.
- **FR-014**: The system MUST validate user input, query parameters, environment configuration, and database-bound data before processing or persistence.
- **FR-015**: The system MUST prevent cross-user access or modification of protected data.
- **FR-016**: The system MUST return user-safe validation and persistence errors without exposing secrets, stack traces, or internal database details.

---

### API and Mutation Specifications

#### `GET /api/recipes`

- Implemented as a Next.js Route Handler.
- Retrieves recipe data from the relational SQL database.
- Accepts optional search and ingredient query parameters.
- Validates incoming query parameters.
- Returns JSON.
- Returns HTTP 200 for valid searches, including empty result sets.
- Returns HTTP 400 for invalid input.
- Returns HTTP 500 for unexpected server errors.

---

#### Calendar Mutations

- Require an authenticated session.
- Validate day, meal type, recipe ID, and week information.
- Restrict mutations to the authenticated user's schedule.
- Support assign, update, and clear operations.
- Prevent partial persistence when validation or database operations fail.
- Update affected planner data after a successful change.

---

#### Recipe Mutations

- Require authentication for persisted user-owned recipes.
- Validate required recipe fields.
- Allow only the owner to update or delete a custom recipe.
- Return safe validation and persistence errors.
- Update affected recipe views after successful operations.

---

#### Feedback Mutations _(Phase 2)_

If implemented:

- Require authentication.
- Validate rating and feedback content.
- Restrict update and delete operations to the review owner.
- Update recipe feedback data after successful operations.

---

### Data Model

The application will use Neon PostgreSQL as its relational SQL database, deployed alongside the application on Vercel. Server-side application code will access the database with parameterized SQL through the Neon serverless driver; no ORM will be used.

| Entity / table | Key fields |
| --- | --- |
| **Users** | `id`, `clerkUserId` (unique), `name`, `email` (unique), `createdAt` |
| **Recipes** | `id`, `title`, `description`, `imageUrl`, `instructions`, `prepTimeMinutes`, `createdAt`, `userId` (nullable foreign key for seeded recipes) |
| **Ingredients** | `id`, `name` (unique) |
| **RecipeIngredients** | `recipeId` (foreign key), `ingredientId` (foreign key), `quantity`; composite primary key (`recipeId`, `ingredientId`) |
| **Feedback** _(Phase 2)_ | `id`, `rating` (integer constrained to 1–5), `comment`, `userId` (foreign key), `recipeId` (foreign key), `createdAt`; unique (`userId`, `recipeId`) |
| **ScheduleWeeks** | `id`, `userId` (foreign key), `weekStartDate`; unique (`userId`, `weekStartDate`) |
| **MealPlanEntries** | `id`, `scheduleWeekId` (foreign key), `recipeId` (foreign key), `dayOfWeek`, `mealType`; unique (`scheduleWeekId`, `dayOfWeek`, `mealType`) |
| **SavedRecipes** _(if implemented)_ | `userId` (foreign key), `recipeId` (foreign key); composite primary key (`userId`, `recipeId`) |

**Relationships**

- One **User** has many **Recipes**, **Feedback** records, and **ScheduleWeeks**.
- One **Recipe** has many **Feedback** records and **MealPlanEntries**.
- **Recipes** and **Ingredients** are many-to-many through **RecipeIngredients**.
- **Users** and saved **Recipes** are many-to-many through **SavedRecipes**; recipe IDs are not stored as an array on the user record.
- One **ScheduleWeek** has many **MealPlanEntries**; a meal-plan entry belongs to exactly one recipe.

### Database Access

- Store the Neon connection string only in `DATABASE_URL` environment variables (`.env.local` for local development and Vercel project settings for deployments); never commit it to source control.
- Store Clerk configuration only in Clerk environment variables (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`); never commit secrets to source control.
- Store versioned SQL migration files for tables, relations, indexes, constraints, and schema changes.
- Query Neon with parameterized SQL only in Server Components, Route Handlers, Server Actions, and server-only modules. Client Components must call server code rather than importing the database driver or credentials.
- Use seeded development data and a non-production Neon branch/database for local testing.

### Component Architecture

The shared layout, ingredient, and recipe components are Week 04 implementation priorities. `StarRating` and `FeedbackItem` may be built as presentational, reusable components in Week 04, while persisted feedback workflows remain Phase 2. Components with user interaction (forms, badges, rating selection) are Client Components; layout and presentational components remain Server Components unless they require client behavior.

```text
src/components/
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── NavLinks.tsx
├── auth/
│   └── LoginForm.tsx
├── ingredients/
│   ├── IngredientInput.tsx
│   └── IngredientBadge.tsx
├── recipes/
│   ├── PreviewCard.tsx
│   ├── DetailsCard.tsx
│   └── RecipeList.tsx
└── feedback/
    ├── StarRating.tsx
    └── FeedbackItem.tsx
```

Initial MVP routes: `/`, `/login`, `/recipes`, `/recipes/[id]`, `/dashboard`, and `/planner`. The shared `Header`, `Footer`, and `NavLinks` wrap applicable views. `RecipeList` renders `PreviewCard`; the recipe detail view composes `DetailsCard`, `StarRating`, and `FeedbackItem` when Phase 2 feedback is enabled.

### Design System

| Token | Value | Use |
| --- | --- | --- |
| Background | `#FAF9F6` Warm Alabaster | Main page surface |
| Primary | `#2E6F40` Sage Basil Green | Primary actions and active states |
| Secondary | `#E07A5F` Warm Terracotta | Match badges, accents, and star ratings |
| Ink | `#1F2937` Charcoal Ink | Headings, body copy, icons, and footer contrast |
| Display font | Plus Jakarta Sans | Logo, page headings, and recipe titles |
| Body font | Inter | Body copy, forms, ingredients, and buttons |

Use Tailwind CSS for responsive styling. Keep a consistent spacing scale (4, 8, 12, 16, 24, 32, 48 px), a centered content container, recipe/planner/feedback cards with rounded corners and subtle borders or shadows, and a one-column mobile layout that expands to multi-column grids on larger screens. Forms use visible labels and consistent validation, disabled, loading, and error states. Every interactive control has hover and visible keyboard-focus states.

Sage Basil Green is the primary accessible action color. Warm Terracotta is reserved for decorative accents, badges, and star ratings: it must not be the sole indicator of state or be used as small text on the Alabaster background. Terracotta badges use Charcoal Ink text. Recipe imagery is bright, natural, food-focused, and displayed at consistent aspect ratios. Use one shared icon library, such as Lucide React, if icons are needed.

---

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A new user can sign in, access the personalized workspace, and sign out.
- **SC-002**: Ingredient search returns matching recipes or a clear empty state.
- **SC-003**: A user can assign, update, and clear weekly meal slots.
- **SC-004**: Cross-user recipe and planner mutations are rejected.
- **SC-005**: An empty weekly planner renders exactly 14 lunch/dinner slots.
- **SC-006**: A custom recipe owner can create, view, update, and delete their recipe.
- **SC-007**: Meal-plan data remains persisted after refresh.
- **SC-008**: Validation, empty, loading, and failure states provide understandable feedback.
- **SC-009**: If feedback is implemented, users can read published feedback and manage only their own review.

---

## Course / Technical Requirements

The project implementation must also satisfy the general WDD 430 project requirements.

These are implementation constraints rather than additional MealPlanner functional requirements.

- Use Next.js with App Router.
- Use TypeScript.
- Use Neon PostgreSQL as the application database, deployed with Vercel.
- Use the Neon serverless driver and parameterized SQL for server-side database access.
- Use Clerk for authentication, identity management, and protected routes.
- Demonstrate appropriate Server Component and Client Component usage.
- Demonstrate at least one complete Client → Route Handler → Database flow.
- Implement complete CRUD behavior for at least two data models.
- Provide at least three distinct application views.
- Reuse at least five UI components.
- Provide a consistent design system.
- Support responsive desktop and mobile layouts.
- Provide validation and error handling.
- Deploy the application to Vercel or another approved platform.
- Maintain the project in GitHub using branches, issues, pull requests, and code review.
- Include a project README with setup, environment, development, deployment, API, known issues, and future improvements.

---

## Implementation Priority

### P0 - Foundation

- Authentication.
- Neon PostgreSQL connection, versioned SQL migrations, and seeded development data.
- Seeded recipe data.
- Basic recipe catalog.
- Protected application workspace.
- Initial validation and error handling conventions.

### P1 - Core MVP

- Ingredient filtering.
- `GET /api/recipes`.
- Weekly meal planner.
- Meal-plan CRUD.
- Custom recipe CRUD.
- Ownership enforcement.
- Responsive layouts.
- Required reusable components.

### P2 - Phase 2

Only after P0 and P1 are stable:

- Ratings.
- Reviews.
- Community feedback.
- Publishing custom recipes.
- Advanced meal swapping.
- Advanced filtering.
- Recommendation features.

P2 functionality MUST NOT block completion of the core MVP.
