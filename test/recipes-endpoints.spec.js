const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Recipes Endpoints', function() {
  let db; 

  const { 
    testUsers, 
    testRecipes
  } = helpers.makeCookbookFixtures();

  before('make knex instance', () => {
    db=knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));  

  describe('GET /api/recipes',  () => {
    context('Given no recipes', () => {
      it('responds with 200 and an empty list', ()=> {
        return supertest(app)
          .get('/api/recipes')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });
    });

    context('Given there are recipes', ()=> {
      beforeEach('insert recipes', () => 
        helpers.seedRecipesTables(
          db,
          testUsers,
          testRecipes
        )
      );

      it.skip('responds with 200 and whole list', ()=> {
        const expectedRecipes = testRecipes;
        return supertest(app)
          .get('/api/recipes')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedRecipes);
      });
    });
  });
});