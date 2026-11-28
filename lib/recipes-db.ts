import 'server-only';

import { sql } from './mealplanner-db';

export type RecipeIngredient = {
  name: string;
  quantity: string;
};

export type CatalogRecipe = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  instructions: string;
  prepTimeMinutes: number | null;
  createdAt: string;
  userId: string;
  ingredients: RecipeIngredient[];
};

export type RecipeSearch = {
  search: string | null;
  ingredients: string[];
};

type RecipeRow = {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  instructions: string;
  prep_time_minutes: number | null;
  created_at: string | Date;
  user_id: number;
  ingredients: RecipeIngredient[];
};

const MAX_SEARCH_LENGTH = 100;
const MAX_INGREDIENTS = 10;
const MAX_INGREDIENT_LENGTH = 50;
const INGREDIENT_PATTERN = /^[a-z][a-z '-]*$/;

type ParseResult =
  { ok: true; value: RecipeSearch } | { ok: false; error: string };

// Reads ?search=...&ingredients=rice,eggs (or repeated ?ingredient=rice).
// Blank entries and duplicates are dropped. Anything else that looks wrong is rejected.
export function parseRecipeSearch(params: URLSearchParams): ParseResult {
  const rawSearch = params.get('search');
  const search = rawSearch?.trim() || null;

  if (search && search.length > MAX_SEARCH_LENGTH) {
    return {
      ok: false,
      error: `search must be ${MAX_SEARCH_LENGTH} characters or less.`,
    };
  }

  const rawIngredients = [
    ...params.getAll('ingredients').flatMap((value) => value.split(',')),
    ...params.getAll('ingredient'),
  ];

  const ingredients: string[] = [];
  for (const raw of rawIngredients) {
    const name = raw.trim().toLowerCase().replace(/\s+/g, ' ');
    if (!name) continue;

    if (name.length > MAX_INGREDIENT_LENGTH) {
      return {
        ok: false,
        error: `Each ingredient must be ${MAX_INGREDIENT_LENGTH} characters or less.`,
      };
    }
    if (!INGREDIENT_PATTERN.test(name)) {
      return {
        ok: false,
        error:
          'Ingredients can only contain letters, spaces, hyphens, and apostrophes.',
      };
    }
    if (!ingredients.includes(name)) ingredients.push(name);
  }

  if (ingredients.length > MAX_INGREDIENTS) {
    return {
      ok: false,
      error: `You can search with up to ${MAX_INGREDIENTS} ingredients.`,
    };
  }

  return { ok: true, value: { search, ingredients } };
}

// Escapes LIKE wildcards so user input is matched literally.
function likePattern(value: string) {
  return `%${value.replace(/[\\%_]/g, (char) => `\\${char}`)}%`;
}

function toCatalogRecipe(row: RecipeRow): CatalogRecipe {
  return {
    id: String(row.id),
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    instructions: row.instructions,
    prepTimeMinutes: row.prep_time_minutes,
    createdAt: new Date(row.created_at).toISOString(),
    userId: String(row.user_id),
    ingredients: row.ingredients ?? [],
  };
}

// Returns recipes whose title matches the search and that contain every ingredient asked for.
export async function getCatalogRecipes({
  search,
  ingredients,
}: RecipeSearch): Promise<CatalogRecipe[]> {
  const searchPattern = search ? likePattern(search) : null;
  const ingredientPatterns = ingredients.map(likePattern);

  const rows = (await sql`
    SELECT
      r.id,
      r.title,
      r.description,
      r.image_url,
      r.instructions,
      r.prep_time_minutes,
      r.created_at,
      r.user_id,
      COALESCE(
        json_agg(
          json_build_object('name', i.name, 'quantity', ri.quantity)
          ORDER BY i.name
        ) FILTER (WHERE i.id IS NOT NULL),
        '[]'
      ) AS ingredients
    FROM recipe r
    LEFT JOIN ingredients ri ON ri.recipe_id = r.id
    LEFT JOIN ingredient i ON i.id = ri.ingredient_id
    WHERE (${searchPattern}::text IS NULL OR r.title ILIKE ${searchPattern}::text)
      AND NOT EXISTS (
        SELECT 1
        FROM unnest(${ingredientPatterns}::text[]) AS wanted(pattern)
        WHERE NOT EXISTS (
          SELECT 1
          FROM ingredients ri2
          JOIN ingredient i2 ON i2.id = ri2.ingredient_id
          WHERE ri2.recipe_id = r.id
            AND i2.name ILIKE wanted.pattern
        )
      )
    GROUP BY r.id
    ORDER BY r.title
  `) as RecipeRow[];

  return rows.map(toCatalogRecipe);
}

export async function getRecipeById(id: string): Promise<CatalogRecipe | null> {
  if (!/^\d+$/.test(id)) return null;

  const rows = (await sql`
    SELECT
      r.id,
      r.title,
      r.description,
      r.image_url,
      r.instructions,
      r.prep_time_minutes,
      r.created_at,
      r.user_id,
      COALESCE(
        json_agg(
          json_build_object('name', i.name, 'quantity', ri.quantity)
          ORDER BY i.name
        ) FILTER (WHERE i.id IS NOT NULL),
        '[]'
      ) AS ingredients
    FROM recipe r
    LEFT JOIN ingredients ri ON ri.recipe_id = r.id
    LEFT JOIN ingredient i ON i.id = ri.ingredient_id
    WHERE r.id = ${Number(id)}
    GROUP BY r.id
  `) as RecipeRow[];

  return rows[0] ? toCatalogRecipe(rows[0]) : null;
}
