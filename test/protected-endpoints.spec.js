const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.skip('Protected Endpoints', function() {
  let db;

  const { 
    testUsers, 
    testCookbooks, 
    testRecipes,
  } = helpers.makeCookbookFixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  beforeEach('insert cookbooks', ()=> 
    helpers.seedCookbooksTables(
      db,
      testUsers,
      testCookbooks,
      testRecipes
    )
  );

  const protectedEndpoints = [
    {
      name: 'GET /api/cookbooks',
      path: '/api/cookbooks',
      method: supertest(app).get
    },
  ];

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, ()=> {
      it('should respond with 401 and \'Missing basic token\'', ()=> {
        return endpoint.method(endpoint.path)
          .expect(401, { error: 'Missing basic token'});
      });
      
      it('should respond with 401 "Unauthoized request" when invalid jwt secret', ()=> {
        const validUser = testUsers[0];
        const invalidSecret = 'bad-secret';
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, { error: 'Unauthorized request'});
      });
  
      it('should respond 401 "Unauthorized request" when invalid sub in payload', ()=> {
        const invalidUser = { user_name: 'user-not', id: 1};
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: 'Unauthorized request'});
      });
    });
  });
});