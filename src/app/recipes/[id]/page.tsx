import Link from 'next/link';
import { notFound } from 'next/navigation';

import DetailsCard from '@/components/recipes/DetailsCard';
import { getRecipeById } from '@/lib/recipes';

type RecipeDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function RecipeDetailsPage({
  params,
}: RecipeDetailsPageProps) {
  const { id } = await params;
  const recipe = getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  return (
    <main className="page-shell max-w-4xl py-12 sm:py-16">
      <div className="mb-6 flex flex-wrap gap-4">
        <Link
          className="font-semibold text-[#2E6F40] underline underline-offset-4"
          href="/recipes"
        >
          Back to recipes
        </Link>
        <Link
          className="font-semibold text-[#2E6F40] underline underline-offset-4"
          href={`/recipes/${recipe.id}/edit`}
        >
          Edit recipe
        </Link>
      </div>
      <DetailsCard recipe={recipe} />
    </main>
  );
}
