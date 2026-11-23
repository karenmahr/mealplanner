import type { Recipe } from '@/types';

// Temporary data while the Neon database and SQL queries are implemented.
// Replace these functions with parameterized SQL queries in a later PR.
export const demoRecipes: Recipe[] = [
  {
    id: 'lemon-herb-pasta',
    title: 'Lemon Herb Pasta',
    description: 'A bright, simple pasta for busy weeknights.',
    imageUrl:
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80',
    instructions:
      'Cook the pasta in salted water. Reserve one cup of pasta water. Toss the pasta with olive oil, lemon zest, lemon juice, Parmesan, and fresh herbs. Add reserved pasta water as needed, then season to taste.',
    prepTimeMinutes: 25,
    createdAt: '2026-11-20T00:00:00.000Z',
    userId: null,
  },
];

export function getRecipeById(id: string) {
  return demoRecipes.find((recipe) => recipe.id === id);
}
