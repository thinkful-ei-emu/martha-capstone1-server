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
  }
  
  // ,
  // updateNote(knex, id, newNoteFields){
  //   return knex('notes')
  //     .where({id})
  //     .update(newNoteFields);
  // }
};

module.exports = CookbookService;