ALTER TABLE cookbooks
  DROP COLUMN IF EXISTS user_id;

DROP TABLE IF EXISTS cookbook_users;