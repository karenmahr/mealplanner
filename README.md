# MealPlanner

MealPlanner is a full-stack recipe catalog and weekly meal-planning application. Authenticated users will be able to discover recipes by ingredient, manage their own recipes, and organize lunch and dinner plans for the week.

## Team members

Replace the placeholders before submitting Week 03.

- [ ] **Member 1:** `Erandy Ramirez`
- [ ] **Member 2:** `Nestor Rivera`
- [ ] **Member 3:** `Andrew Parry`
- [ ] **Member 4:** `Karen Mahr`

## Technology stack

- Next.js with App Router
- TypeScript
- Tailwind CSS
- Neon PostgreSQL
- Neon serverless driver with parameterized SQL queries
- Versioned SQL migrations (no ORM)
- Clerk authentication
- Vercel deployment

## Local development

### Prerequisites

- Node.js and npm
- A Neon PostgreSQL database connection string once database work begins

### Setup

```bash
git clone https://github.com/karenmahr/mealplanner.git
cd mealplanner
npm install
```

Create a `.env.local` file when database work begins:

```env
DATABASE_URL="your-neon-postgresql-connection-string"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
CLERK_SECRET_KEY="your-clerk-secret-key"
```

Never commit `.env.local` or database credentials.

### Run the application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

## Planned MVP

- Authentication and protected user workspace
- Recipe catalog and ingredient-based filtering
- Recipe detail pages
- Custom recipe create, read, update, and delete workflows
- Weekly lunch and dinner planner
- Responsive and accessible interface

Recipe feedback and ratings will be added after the core MVP is stable.

## Project conventions

- Application code lives in `src/`.
- Database access runs only on the server.
- Database queries use parameterized SQL through the Neon serverless driver.
- SQL schema changes are stored as versioned migration files.
- Secrets are stored in local or Vercel environment variables, never in Git.
- Pull requests require teammate review before merging.

## Project planning

The Week 03 project specification and technical decisions are documented in [spec.md](./spec.md).

## Deployment

The application will be deployed to Vercel. The Neon `DATABASE_URL` will be configured in Vercel project environment variables before deployment.

## Current status

The project is in its planning and architecture phase for Week 03. Implementation begins in Week 04.

## Known issues

- Clerk authentication has not yet been configured.
- Database schema, migrations, and seed data have not yet been implemented.

## Future improvements

- Recipe ratings and feedback persistence
- Saved/favorite recipes
- Advanced recipe filtering
- Meal recommendations and meal swapping
