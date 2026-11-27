import { notFound } from 'next/navigation';

import RecipeForm from '@/components/recipes/RecipeForm';
import { getRecipeById } from '@/lib/recipes';

type EditRecipePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const { id } = await params;
  const recipe = getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  return (
    <main className="page-shell max-w-3xl py-12 sm:py-16">
      <RecipeForm
        initialValues={{
          title: recipe.title,
          description: recipe.description,
          imageUrl: recipe.imageUrl,
          instructions: recipe.instructions,
          prepTimeMinutes: recipe.prepTimeMinutes,
        }}
        mode="edit"
      />
    </main>
  );
}
