export type Recipe = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  instructions: string;
  prepTimeMinutes: number;
  createdAt: string;
  userId: string | null;
};

export type RecipeInput = Omit<Recipe, 'id' | 'createdAt' | 'userId'>;
