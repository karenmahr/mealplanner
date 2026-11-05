# Feature Specification: MealPlanner - Personal Recipe Catalog & Weekly Meal Scheduler

**Feature Branch**: `001-mealplanner-catalog`
**Created**: 2026-11-04
**Status**: Draft
**Input**: User description: "Create a project specification for MealPlanner, a full-stack personal recipe catalog and weekly meal scheduling web application with authentication, recipe discovery, calendar scheduling, custom recipe management, and community feedback."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Authenticated Meal-Planning Workspace (Priority: P0)

A busy home cook signs up or logs in through Clerk or Auth.js, remains signed in
across visits, and opens a workspace containing only that user's saved plans,
custom recipes, and review activity.

**Why this priority**: Authentication and ownership boundaries are required for
all personalized catalog and calendar behavior.

**Independent Test**: A new user can complete sign-up, sign in, refresh the
workspace, sign out, and verify protected content is inaccessible while signed out.

**Acceptance Scenarios**:

1. **Given** an unauthenticated visitor, **When** they open a protected route,
   **Then** they are redirected to the authentication flow.
2. **Given** valid authentication, **When** sign-in completes, **Then** the user
   returns to the dashboard and a persistent session is established.
3. **Given** a signed-in user, **When** they sign out, **Then** protected routes
   redirect to authentication and personalized data is not rendered.
4. **Given** invalid or expired session data, **When** the user requests a
   protected operation, **Then** the system rejects it without exposing another
   user's data.

---

### User Story 2 - Discover and Filter Recipes (Priority: P0/P1)

A user browses pre-seeded and custom catalog recipes, then enters one or more
ingredients to dynamically narrow results without losing the rest of their view.

**Why this priority**: Catalog discovery is the foundational P0 experience and
ingredient filtering is the first core P1 enhancement.

**Independent Test**: Recipes can be searched and filtered from the public catalog,
including no-results and multi-ingredient states, without an authenticated session
where catalog access is intended.

**Acceptance Scenarios**:

1. **Given** the catalog, **When** it loads, **Then** seeded recipes and eligible
   published custom recipes are displayed with title, summary, ingredients, and
   ratings when available.
2. **Given** ingredient tokens, **When** one token is entered, **Then** matching
   recipes are returned after runtime validation of the query.
3. **Given** multiple ingredients, **When** the user applies them, **Then** results
   contain recipes matching the defined filtering mode consistently across requests.
4. **Given** no matching recipes, **When** filtering completes, **Then** an
   empty-result message is shown without displaying stale results.
5. **Given** malformed, oversized, or duplicate search input, **When** a request
   is submitted, **Then** the system rejects or normalizes it and returns a
   user-safe validation response.

---

### User Story 3 - Manage a Weekly Meal Calendar (Priority: P1)

A signed-in user views a Monday through Sunday weekly schedule, assigns recipes
to lunch or dinner slots, swaps or updates entries, and clears individual or
multiple schedule entries.

**Why this priority**: The interactive planner directly addresses weekly decision
fatigue and is the primary scheduling workflow.

**Independent Test**: A user can assign, view, swap, update, and clear lunch or
dinner entries across a week while empty slots remain distinguishable from errors.

**Acceptance Scenarios**:

1. **Given** an authenticated user with no schedule, **When** the calendar opens,
   **Then** all 14 supported lunch/dinner slots render as explicitly empty states.
2. **Given** a valid recipe, day, and meal slot, **When** assignment is submitted,
   **Then** the slot is persisted and the current schedule is revalidated immediately.
3. **Given** an occupied slot, **When** the user swaps or updates it, **Then** the
   operation atomically replaces the intended assignment without overwriting an
   unrelated slot.
4. **Given** an occupied slot, **When** the user clears it, **Then** the entry is
   removed and the slot renders as empty.
5. **Given** invalid day, meal slot, recipe ownership, or session state, **When**
   mutation is attempted, **Then** the action returns an actionable error and no
   partial calendar update is persisted.
6. **Given** a database or network failure, **When** a mutation is attempted,
   **Then** the UI retains or clearly restores the last known state and reports
   a non-destructive error.

---

### User Story 4 - Manage Custom Recipes (Priority: P2)

A signed-in user creates, views, edits, and deletes recipes that they authored,
including title, description, ingredients, steps, optional metadata, and publication
eligibility.

**Why this priority**: Authoring turns the application from a catalog into a
personal recipe system after the core planning workflows are stable.

**Independent Test**: An authenticated owner can perform the full create/read/update/delete
lifecycle while non-owners cannot edit or delete the recipe.

**Acceptance Scenarios**:

1. **Given** valid recipe fields, **When** create is submitted, **Then** a user-owned
   recipe is persisted and available in the owner's catalog.
2. **Given** required fields are missing or invalid, **When** create or edit is
   submitted, **Then** field-level validation is shown and no record is persisted.
3. **Given** a recipe owned by the current user, **When** they edit it, **Then**
   validated changes replace the previous values and remain visible after refresh.
4. **Given** a recipe owned by another user, **When** edit or delete is requested,
   **Then** access is denied and no data changes.
5. **Given** an owned recipe used in scheduled slots, **When** deletion is requested,
   **Then** the user receives a clear confirmation; after confirmation, scheduled
   references are safely handled and the recipe is removed according to the
   approved deletion contract.

---

### User Story 5 - Read and Submit Catalog Feedback (Priority: P2)

A user reads ratings and feedback for published catalog recipes and an
authenticated user submits, updates, or removes their own review.

**Why this priority**: Community feedback improves recipe selection but depends
on stable catalog identities and authenticated user records.

**Independent Test**: Published feedback can be read and an owner can submit,
edit, and remove only their own review while unauthenticated users are gated from
mutations.

**Acceptance Scenarios**:

1. **Given** a published recipe, **When** its detail view opens, **Then** approved
   existing ratings and feedback are displayed with aggregate information.
2. **Given** an authenticated user and valid rating/comment values, **When** they
   submit feedback, **Then** it is validated, persisted once, and catalog data is
   revalidated immediately.
3. **Given** duplicate review submission by the same user, **When** submitted,
   **Then** the existing review is updated instead of creating a duplicate where
   update semantics are defined.
4. **Given** invalid rating or content values, **When** submission occurs, **Then**
   field-level errors are returned and no review is persisted.
5. **Given** a signed-out user, **When** they attempt review mutation, **Then**
   authentication is required and no data changes.
6. **Given** unauthorized review modification or deletion, **When** requested,
   **Then** the operation is denied and the original review is unchanged.

### Edge Cases

- The weekly schedule has no entries for the requested week.
- A recipe is deleted, renamed, or unpublished while another user has a calendar
  reference to it.
- Multiple ingredient tokens normalize to the same ingredient or contain invalid
  punctuation.
- Search contains excessive tokens, empty tokens, or a query longer than the
  validated limit.
- MongoDB is unavailable, validation fails, or an action response is stale.
- Authenticated session data expires during a create, update, swap, delete, or
  review operation.
- A user submits duplicate mutations or rapid repeated clicks for the same slot
  or review.
- Published catalog recipes and user-owned custom recipes have different visibility
  and ownership rules.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST authenticate users with Clerk or Auth.js and derive
  personalization strictly from the authenticated provider user identity.
- **FR-002**: The system MUST connect to MongoDB and persist users' weekly schedule
  entries, custom recipes, and submitted feedback.
- **FR-003**: The system MUST ship with a reproducible pre-seeded recipe catalog.
- **FR-004**: The catalog MUST support discovery of seeded and eligible custom
  recipes by recipe fields and dynamic multi-ingredient filtering.
- **FR-005**: The system MUST provide lunch and dinner slots for each Monday through
  Sunday calendar day.
- **FR-006**: The system MUST allow authenticated users to assign, view, update,
  swap, and clear calendar entries while preserving empty-slot semantics.
- **FR-007**: The system MUST enforce ownership and authorization for custom recipes,
  calendar entries, and reviews.
- **FR-008**: The system MUST allow authenticated owners to create, view, edit, and
  delete custom recipes with explicit validation and confirmation.
- **FR-009**: The system MUST display aggregate and individual published feedback on
  recipe detail views.
- **FR-010**: The system MUST allow authenticated users to submit or maintain one
  review per eligible recipe and provide clear error feedback for invalid content.
- **FR-011**: The system MUST expose `GET /api/recipes` for catalog retrieval and
  query/ingredient filtering, return stable error shapes, and never accept persisted
  mutations through this Route Handler.
- **FR-012**: The system MUST implement calendar slot CRUD and feedback mutations as
  Server Actions that verify session state, parse inputs with Zod, enforce ownership,
  and immediately revalidate affected routes or cache keys.
- **FR-013**: The system MUST use loading and error boundaries for authenticated
  dashboard routes and display explicit empty states for schedules and search results.
- **FR-014**: The system MUST reject invalid environment configuration, malformed
  MongoDB documents, and unknown external payload fields according to Zod validation
  rules before data enters application logic.
- **FR-015**: The system MUST prevent cross-user mutation and must not return data
  that the requesting session is not authorized to read.
- **FR-016**: The system MUST provide consistent user-safe validation and persistence
  error messages while avoiding exposure of secrets, database details, or stack traces.

### API and Mutation Specifications

#### `GET /api/recipes`

- Accepts optional validated query parameters for text search, one or more
  ingredients, pagination, and approved sorting/filter options.
- Matches ingredient tokens without returning stale client-side-only results.
- Returns HTTP 200 for valid searches, including empty-result arrays; HTTP 400 for
  invalid query parameters; HTTP 401 only where the operation requires authentication;
  and HTTP 500 for unexpected server failures.
- Uses the shared Zod response model contract and does not mutate data.

#### Calendar Server Actions

- Define typed actions for assigning, updating/swapping, deleting/clearing, and
  querying calendar mutations for the authenticated user's selected week.
- Require a valid provider session, Zod-valid day, meal-slot, recipe ID, and week
  date.
- Revalidate the dashboard schedule and relevant catalog/cache paths after every
  successful mutation.
- Return typed success or failure data; persistence failures do not partially update
  the visible schedule or database.

#### Feedback Server Actions

- Define typed actions for submitting/updating and removing the current user's
  review.
- Require session authentication, a valid recipe ID, and Zod-valid rating and
  feedback content.
- Revalidate recipe detail and catalog aggregate data after success.
- Restrict removal and update operations to the review owner.

### Key Entities *(include if feature involves data)*

- **User**: Authentication identity, account-scoped custom recipes, schedules, and
  reviews.
- **Recipe**: Catalog or user-owned recipe with title, description, ingredients,
  preparation details, status, owner, and aggregate feedback metadata.
- **Ingredient**: Normalized recipe ingredient name and optional quantity/unit data.
- **ScheduleWeek**: A user's calendar keyed by normalized week, containing explicit
  lunch and dinner entries for Monday through Sunday.
- **CalendarSlot**: A specific day and meal slot with either a recipe reference or
  an explicit empty state.
- **Review**: A user's rating and feedback for a published recipe, including
  timestamps and ownership.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can sign in, reach the personalized dashboard, and sign out
  successfully in under two minutes.
- **SC-002**: Ingredient search returns validated results or an explicit empty state
  within two seconds at normal catalog scale.
- **SC-003**: At least 95% of first-time calendar users can assign and clear a meal
  slot without assistance during usability validation.
- **SC-004**: No cross-user schedule, custom recipe, or review mutation succeeds in
  authorization tests.
- **SC-005**: All empty calendar weeks render 14 explicit empty lunch/dinner states
  and no phantom entries.
- **SC-006**: A custom recipe owner can complete create and delete flows without
  validation errors from a valid submission.
- **SC-007**: Published recipe feedback is visible with aggregate information and
  unauthorized mutations are rejected.

## Implementation Priority

### P0 - Foundation

- Configure Clerk or Auth.js and protected `(auth)` and `(dashboard)` route groups.
- Configure MongoDB and typed, Zod-validated data boundaries.
- Add reproducible seeded recipe data and a basic catalog view.
- Establish loading, error, validation, and session-gating conventions.

### P1 - Discovery and Planning

- Implement dynamic multi-ingredient recipe search and `GET /api/recipes`.
- Implement the interactive Monday through Sunday, lunch/dinner weekly planner.
- Implement assignment, update/swap, delete/clear, empty states, and cache revalidation.
- Add component and unit coverage for search, calendar logic, and mutations.

### P2 - Personalization and Feedback

- Implement custom user recipe create/read/update/delete workflows.
- Implement review read/submit/update/remove workflows and aggregate display.
- Add ownership checks, deletion confirmation, and mock database/API validation.
- Complete end-to-end acceptance coverage for signed-in and signed-out paths.
