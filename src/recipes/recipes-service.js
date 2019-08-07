const RecipesService= {
  getAllRecipes(knex) {
    return knex
      .select('*')
      .from('cookbook_recipes');
  },
  insertRecipe(knex, newRecipe){
    return knex
      .insert(newRecipe)
      .into('cookbook_recipes')
      .returning('*')
      .then(rows=> {
        return rows[0];
      });
  },
  getById(knex, id){
    return knex
      .from('cookbook_recipes')
      .select('*')
      .where('id', id)
      .first();
  },
  updateRecipe(knex, id, newRecipeFields){
    return knex('cookbook_recipes')
      .where({id})
      .update(newRecipeFields);
  }
};

module.exports = RecipesService;