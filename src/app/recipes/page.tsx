import Link from 'next/link';

import PreviewCard from '@/components/recipes/PreviewCard';
import { demoRecipes } from '@/lib/recipes';

export default function RecipesPage() {
  return (
    <main className="page-shell py-12 sm:py-16">
      <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#2E6F40]">
            Your collection
          </p>
          <h1 className="font-display mt-2 text-4xl font-bold text-[#1F2937]">
            Recipes
          </h1>
          <p className="mt-3 max-w-xl text-slate-600">
            Create and keep the meals you want to make again.
          </p>
        </div>
        <Link
          className="inline-flex w-fit rounded-lg bg-[#2E6F40] px-5 py-3 font-semibold text-white transition hover:bg-[#245a33] focus:outline-none focus:ring-2 focus:ring-[#2E6F40] focus:ring-offset-2"
          href="/recipes/new"
        >
          Create recipe
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {demoRecipes.map((recipe) => (
          <PreviewCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </main>
  );
}
