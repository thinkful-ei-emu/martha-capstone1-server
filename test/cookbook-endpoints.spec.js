const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Cookbook Endpoints', function () {
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

  describe('GET /api/cookbooks', ()=> {
    context('Given no cookbooks', () => {
      it('responds with 200 and empty list', () => {
        return supertest(app)
          .get('/api/cookbooks')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });
    });

    context('Given there are cookbooks', () => {
      beforeEach('insert cookbooks', () =>
        helpers.seedCookbooksTables(
          db,
          testUsers,
          testCookbooks
        )
      );

      it('responds with 200 and whole list', () => {
        const expectedCookbooks = testCookbooks;
        return supertest(app)
          .get('/api/cookbooks')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedCookbooks);
      });
    });
  });
});