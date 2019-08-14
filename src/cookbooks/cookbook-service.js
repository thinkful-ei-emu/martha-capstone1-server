const CookbookService= {
  getAllCookbooks(knex) {
    return knex
      .select('*')
      .from('cookbooks');
  },
  insertCookbook(knex, newCookbook){
    return knex
      .insert(newCookbook)
      .into('cookbooks')
      .returning('*')
      .then(rows=> {
        return rows[0];
      });
  },
  getById(knex, id){
    return knex
      .from('cookbooks')
      .select('*')
      .where('id', id)
      .first();
  },
  deleteCookbook(knex, id){
    return knex('cookbooks')
      .where({id})
      .delete();
  },
  updateCookbook(knex, id, newCookbookFields){
    return knex('cookbooks')
      .where({id})
      .update(newCookbookFields);
  },
  getCookbookRecipes(knex, id){
    return knex
      .from('cookbooks')
      .select(knex.raw('recipes'))
      .where('id', id);
  }
};

module.exports = CookbookService;