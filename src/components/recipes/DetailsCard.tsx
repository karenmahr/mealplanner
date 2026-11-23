import Image from 'next/image';

import type { Recipe } from '@/types';

type DetailsCardProps = {
  recipe: Recipe;
};

export default function DetailsCard({ recipe }: DetailsCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <Image
        alt={recipe.title}
        className="h-72 w-full object-cover sm:h-96"
        height={768}
        priority
        src={recipe.imageUrl}
        width={1280}
      />
      <div className="space-y-7 p-6 sm:p-8">
        <div>
          <p className="mb-2 text-sm font-semibold text-[#2E6F40]">
            {recipe.prepTimeMinutes} minutes
          </p>
          <h1 className="font-display text-3xl font-bold text-[#1F2937] sm:text-4xl">
            {recipe.title}
          </h1>
          <p className="mt-3 leading-7 text-slate-600">{recipe.description}</p>
        </div>
        <section aria-labelledby="instructions-heading">
          <h2
            className="font-display text-2xl font-bold text-[#1F2937]"
            id="instructions-heading"
          >
            Instructions
          </h2>
          <p className="mt-3 whitespace-pre-line leading-7 text-slate-700">
            {recipe.instructions}
          </p>
        </section>
      </div>
    </article>
  );
}
