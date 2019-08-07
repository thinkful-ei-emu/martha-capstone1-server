ALTER TABLE cookbook_recipes 
  DROP COLUMN IF EXISTS cookbook_id;

ALTER TABLE cookbook_recipes
  DROP COLUMN IF EXISTS user_id;

DROP TABLE IF EXISTS cookbook_users;