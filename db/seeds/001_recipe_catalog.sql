-- Seeded recipe catalog.
-- Safe to run more than once: existing rows are left alone.

-- Catalog recipes belong to a system user, since recipe.user_id is required.
INSERT INTO users (name, email)
VALUES ('MealPlanner Catalog', 'catalog@mealplanner.local')
ON CONFLICT (email) DO NOTHING;

INSERT INTO ingredient (name)
VALUES
  ('rice'),
  ('chicken thighs'),
  ('frozen mixed vegetables'),
  ('soy sauce'),
  ('garlic'),
  ('eggs'),
  ('potatoes'),
  ('onion'),
  ('ground beef'),
  ('cheddar cheese'),
  ('pasta'),
  ('canned tomatoes'),
  ('black beans'),
  ('corn'),
  ('salsa'),
  ('tortillas'),
  ('carrots'),
  ('celery'),
  ('chicken broth'),
  ('olive oil')
ON CONFLICT (name) DO NOTHING;

-- Recipes are matched by title so the seed does not create duplicates.
INSERT INTO recipe (title, description, image_url, instructions, prep_time_minutes, user_id)
SELECT v.title, v.description, v.image_url, v.instructions, v.prep_time_minutes, u.id
FROM (
  VALUES
    (
      'Chicken Fried Rice',
      'Leftover rice, chicken, and frozen vegetables fried together with soy sauce.',
      NULL,
      'Dice and brown the chicken in a large pan. Add the garlic and frozen vegetables and cook until hot. Push everything to the side, scramble the eggs, then stir in the cold rice and soy sauce. Cook until the rice is hot and a little crispy.',
      25
    ),
    (
      'Loaded Baked Potatoes',
      'Baked potatoes topped with seasoned beef and melted cheddar.',
      NULL,
      'Bake the potatoes at 400 F for about 50 minutes, until soft. Brown the ground beef with the onion. Split the potatoes, top with the beef and cheese, and bake 5 more minutes to melt the cheese.',
      60
    ),
    (
      'One Pot Tomato Pasta',
      'Pasta cooked right in a garlic tomato sauce, so there is only one pot to wash.',
      NULL,
      'Soften the onion and garlic in olive oil. Add the canned tomatoes, the dry pasta, and enough water to cover. Simmer, stirring often, until the pasta is tender and the sauce is thick, about 15 minutes.',
      25
    ),
    (
      'Black Bean Burrito Bowls',
      'Rice bowls with black beans, corn, salsa, and cheese.',
      NULL,
      'Cook the rice. Warm the black beans and corn together. Fill bowls with rice, then beans and corn, and top with salsa and cheddar cheese. Serve with warm tortillas on the side.',
      30
    ),
    (
      'Chicken and Potato Soup',
      'A filling soup made from cheap pantry vegetables and chicken broth.',
      NULL,
      'Soften the onion, carrots, and celery in olive oil. Add diced potatoes, diced chicken thighs, and chicken broth. Simmer until the potatoes are soft and the chicken is cooked through, about 25 minutes.',
      40
    ),
    (
      'Beef and Rice Skillet',
      'Ground beef, rice, and tomatoes cooked together in one skillet.',
      NULL,
      'Brown the ground beef with the onion and garlic. Stir in the rice, canned tomatoes, and water. Cover and simmer for 20 minutes, until the rice is tender. Top with cheddar cheese.',
      35
    )
) AS v(title, description, image_url, instructions, prep_time_minutes)
CROSS JOIN (SELECT id FROM users WHERE email = 'catalog@mealplanner.local') AS u
WHERE NOT EXISTS (SELECT 1 FROM recipe r WHERE r.title = v.title);

INSERT INTO ingredients (recipe_id, ingredient_id, quantity)
SELECT r.id, i.id, v.quantity
FROM (
  VALUES
    ('Chicken Fried Rice', 'rice', '3 cups cooked'),
    ('Chicken Fried Rice', 'chicken thighs', '1 lb'),
    ('Chicken Fried Rice', 'frozen mixed vegetables', '2 cups'),
    ('Chicken Fried Rice', 'soy sauce', '3 tbsp'),
    ('Chicken Fried Rice', 'garlic', '2 cloves'),
    ('Chicken Fried Rice', 'eggs', '2'),
    ('Loaded Baked Potatoes', 'potatoes', '4 large'),
    ('Loaded Baked Potatoes', 'ground beef', '1 lb'),
    ('Loaded Baked Potatoes', 'onion', '1'),
    ('Loaded Baked Potatoes', 'cheddar cheese', '1 cup shredded'),
    ('One Pot Tomato Pasta', 'pasta', '1 lb'),
    ('One Pot Tomato Pasta', 'canned tomatoes', '1 can (28 oz)'),
    ('One Pot Tomato Pasta', 'onion', '1'),
    ('One Pot Tomato Pasta', 'garlic', '3 cloves'),
    ('One Pot Tomato Pasta', 'olive oil', '2 tbsp'),
    ('Black Bean Burrito Bowls', 'rice', '1 cup dry'),
    ('Black Bean Burrito Bowls', 'black beans', '1 can (15 oz)'),
    ('Black Bean Burrito Bowls', 'corn', '1 cup'),
    ('Black Bean Burrito Bowls', 'salsa', '1 cup'),
    ('Black Bean Burrito Bowls', 'cheddar cheese', '1 cup shredded'),
    ('Black Bean Burrito Bowls', 'tortillas', '4'),
    ('Chicken and Potato Soup', 'potatoes', '4 medium'),
    ('Chicken and Potato Soup', 'chicken thighs', '1 lb'),
    ('Chicken and Potato Soup', 'onion', '1'),
    ('Chicken and Potato Soup', 'carrots', '2'),
    ('Chicken and Potato Soup', 'celery', '2 stalks'),
    ('Chicken and Potato Soup', 'chicken broth', '6 cups'),
    ('Chicken and Potato Soup', 'olive oil', '1 tbsp'),
    ('Beef and Rice Skillet', 'ground beef', '1 lb'),
    ('Beef and Rice Skillet', 'rice', '1 cup dry'),
    ('Beef and Rice Skillet', 'canned tomatoes', '1 can (15 oz)'),
    ('Beef and Rice Skillet', 'onion', '1'),
    ('Beef and Rice Skillet', 'garlic', '2 cloves'),
    ('Beef and Rice Skillet', 'cheddar cheese', '1/2 cup shredded')
) AS v(recipe_title, ingredient_name, quantity)
JOIN recipe r ON r.title = v.recipe_title
JOIN ingredient i ON i.name = v.ingredient_name
ON CONFLICT (recipe_id, ingredient_id) DO NOTHING;
