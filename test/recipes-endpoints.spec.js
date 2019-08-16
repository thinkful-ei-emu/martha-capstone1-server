const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.skip('Recipes Endpoints', function() {
  let db; 

  const { testRecipes } = helpers.makeCookbookFixtures();

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
    context('Given there are recipes', ()=> {
      beforeEach('insert recipes', () => {
        return db 
          .into('cookbook_recipes')
          .insert(testRecipes);
      });

      it('responds with 200 and whole list', ()=> {
        return supertest(app)
          .get('/api/recipes')
          .expect(200, testRecipes);
      });
    });
  });

  describe('POST /api/recipes', () => {
    beforeEach('insert recipes', () => {
      return db 
        .into('cookbook_recipes')
        .insert(testRecipes);
    });
    it('should create a recipe and respond with 201', ()=> {
      const newRecipe = {
        title: 'test',
        author: 'test',
        serving_size: 1,
        cook_time: 1,
        ingredients: ['test'],
        instruction: ['test'],
        meal_type: 'breakfast',
        difficulty: 'beginner'
      };
      return supertest(app)
        .post('/api/recipes')
        .send(newRecipe)
        .expect(201);
    });
  });

  describe('GET /api/recipes/:recipe_id',  () => {
    context('Given there are recipes', ()=> {
      beforeEach('insert recipes', () => {
        return db 
          .into('cookbook_recipes')
          .insert(testRecipes);
      });

      it('responds with 200 and the specified recipe', () => {
        const recipeId = 1;
        const expectedRecipe = testRecipes[recipeId - 1];
        return supertest(app)
          .get(`/api/notes/${recipeId}`)
          .expect(200, expectedRecipe);
      });
    });
  });
});