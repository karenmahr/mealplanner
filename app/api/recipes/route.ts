import type { NextRequest } from 'next/server';

import { getCatalogRecipes, parseRecipeSearch } from '@/lib/recipes-db';

// GET /api/recipes?search=rice&ingredients=chicken,eggs
export async function GET(request: NextRequest) {
  const parsed = parseRecipeSearch(request.nextUrl.searchParams);

  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const recipes = await getCatalogRecipes(parsed.value);
    return Response.json({ recipes, count: recipes.length });
  } catch (error) {
    console.error('GET /api/recipes failed', error);
    return Response.json(
      { error: 'Something went wrong loading recipes. Please try again.' },
      { status: 500 }
    );
  }
}
