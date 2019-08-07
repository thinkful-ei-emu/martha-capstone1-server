CREATE TABLE cookbook_recipes (
  id SERIAL PRIMARY KEY, 
  title TEXT NOT NULL, 
  author TEXT NOT NULL, 
  serving_size INTEGER NOT NULL,
  cook_time INTEGER NOT NULL,
  ingredients text[],
  instruction  text[]
);

CREATE TYPE meal_type as ENUM(
  'breakfast', 
  'lunch', 
  'dinner', 
  'dessert',
  'snack',
  'healthy'
);

ALTER TABLE cookbook_recipes 
  ADD COLUMN meal_type meal_type;

CREATE TYPE difficulty as ENUM(
  'beginner',
  'intermediate',
  'advanced',
  'professional'
);

ALTER TABLE cookbook_recipes
  ADD COLUMN difficulty difficulty
