ALTER TABLE cookbook_recipes DROP COLUMN IF EXISTS meal_type;

ALTER TABLE cookbook_recipes DROP COLUMN IF EXISTS difficulty;

ALTER TABLE cookbook_recipes DROP COLUMN IF EXISTS cookbook_id;

DROP TABLE IF EXISTS cookbook_recipes;