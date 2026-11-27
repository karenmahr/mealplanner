import Image from 'next/image';
import Link from 'next/link';

import type { Recipe } from '@/types';

type PreviewCardProps = {
  recipe: Recipe;
};

export default function PreviewCard({ recipe }: PreviewCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <Image
        alt={recipe.title}
        className="h-52 w-full object-cover"
        height={416}
        src={recipe.imageUrl}
        width={640}
      />
      <div className="space-y-3 p-5">
        <p className="text-sm font-semibold text-[#2E6F40]">
          {recipe.prepTimeMinutes} minutes
        </p>
        <h2 className="font-display text-2xl font-bold text-[#1F2937]">
          {recipe.title}
        </h2>
        <p className="text-sm leading-6 text-slate-600">{recipe.description}</p>
        <Link
          className="inline-flex font-semibold text-[#2E6F40] underline underline-offset-4"
          href={`/recipes/${recipe.id}`}
        >
          View recipe
        </Link>
      </div>
    </article>
  );
}
