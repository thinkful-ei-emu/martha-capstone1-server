const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Cookbook Endpoints', function () {
  let db;

  const {
    testUsers,
    testCookbooks,
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
          .expect(200, expectedCookbooks);
      });
    });
  });

  describe('POST /api/cookbooks', () => {
    it('should create a cookbook and respond with 201', ()=> {
      const newCookbook = {
        title: 'test cookbook',
        recipes: [1, 2],
      };
      return supertest(app)
        .post('/api/cookbooks')
        .send(newCookbook)
        .expect(201);
    });
  });

  describe('GET /api/cookbooks/:cookbook_id', ()=> {
    context('Given no cookbooks', ()=> {
      beforeEach(()=> helpers.seedUsers(db, testUsers));

      it('responds with 404 when coookbook does not exist', ()=> {
        const cookbookId= 123456;
        return supertest(app)
          .get(`/api/cookbooks/${cookbookId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404, {error:{ message: 'Cookbook does not exist'}});
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
        const cookbookId=1;

        const expectedCookbooks =
          [
            {
              recipes: [1, 2]
            }
          ];
        return supertest(app)
          .get(`/api/cookbooks/${cookbookId}`)
          .expect(200, expectedCookbooks);
      });
    });
  });

  describe('DELETE /api/cookbooks/:cookbook_id', ()=> {
    beforeEach('insert cookbooks', () => {
      return db
        .into('cookbooks')
        .insert(testCookbooks);
    });

    it('responds with 204 and removes the notes', () => {
      const idToRemove = 1;
      const expectedCookbooks = testCookbooks.filter(cookbook => cookbook.id !== idToRemove);
      return supertest(app)
        .delete(`/api/cookbooks/${idToRemove}`)
        .expect(204)
        .then(() =>
          supertest(app)
            .get('/api/cookbooks')
            .expect(expectedCookbooks)
        );
    });
  });

  describe('PATCH /api/cookbooks/:cookbook_id', ()=> {
    beforeEach('insert cookbooks', ()=> {
      return db
        .into('cookbooks')
        .insert(testCookbooks)
      });
    it(`responds with 204 when updating field`, () => {
      const idToUpdate = 2
      const updateCookbook = {
        recipes: [1, 2, 3],
      }
      const expectedCookbook = [{
        ...updateCookbook
      }]

      return supertest(app)
        .patch(`/api/cookbooks/${idToUpdate}`)
        .send({
          ...updateCookbook,
          fieldToIgnore: 'should not be in GET response'
        })
        .expect(204)
        .then(res =>
          supertest(app)
            .get(`/api/cookbooks/${idToUpdate}`)
            .expect(expectedCookbook)
        )
    });
  });
});