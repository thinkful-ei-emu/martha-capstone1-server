CREATE TABLE cookbook_recipes (
  id SERIAL PRIMARY KEY, 
  title TEXT NOT NULL, 
  author TEXT NOT NULL, 
  serving_size INTEGER NOT NULL,
  cook_time INTEGER NOT NULL,
  ingredients text[],
  instruction  text[]
);

CREATE TYPE food as ENUM(
  'breakfast', 
  'lunch', 
  'dinner', 
  'dessert',
  'snack',
  'healthy'
);

ALTER TABLE cookbook_recipes 
  ADD COLUMN meal_type food;

CREATE TYPE diffi as ENUM(
  'beginner',
  'intermediate',
  'advanced',
  'professional'
);

ALTER TABLE cookbook_recipes
  ADD COLUMN difficulty diffi
