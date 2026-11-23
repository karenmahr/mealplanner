import RecipeForm from '@/components/recipes/RecipeForm';

export default function NewRecipePage() {
  return (
    <main className="page-shell max-w-3xl py-12 sm:py-16">
      <RecipeForm mode="create" />
    </main>
  );
}
