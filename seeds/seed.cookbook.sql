INSERT INTO cookbook_recipes(title, author, serving_size, cook_time, ingredients, instruction, meal_type, difficulty, cookbook_id)
VALUES
('Recipe 1', 'megan', 2, 30, '{"banana", "sugar", "salt"}', '{"boil water", "plate food"}', 'breakfast', 'advanced'),
('Recipe 2', 'bryan', 2, 30, '{"banana", "sugar", "salt"}', '{"boil water", "plate food"}', 'lunch', 'professional');

INSERT INTO cookbooks(title)
VALUES 
('Cookbook 1'),
('Cookbook 2');

INSERT INTO cookbook_users(user_name, full_name, password)
VALUES
  ('dunder', 'Dunder Mifflin', '$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne'),
  ('b.deboop', 'Bodeep Deboop', '$2a$12$VQ5HgWm34QQK2rJyLc0lmu59cy2jcZiV6U1.bE8rBBnC9VxDf/YQO'),
  ('c.bloggs', 'Charlie Bloggs', '$2a$12$2fv9OPgM07xGnhDbyL6xsuAeQjAYpZx/3V2dnu0XNIR27gTeiK2gK'),
  ('s.smith', 'Sam Smith', '$2a$12$/4P5/ylaB7qur/McgrEKwuCy.3JZ6W.cRtqxiJsYCdhr89V4Z3rp.');