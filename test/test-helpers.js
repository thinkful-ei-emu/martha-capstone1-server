const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      full_name: 'Test user 1',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    }
  ];
}

function makeCookbookArray() {
  return [
    {
      id: 1, 
      title: 'Test 1',
    },
    {
      id: 2, 
      title: 'Test 2',
    },
  ]
}

function makeRecipesArray() {
  return [
    {
        id: 1,
        title: "apple",
        author: "Me",
        serving_size: 1,
        cook_time: 1,
        ingredients: [
            "apple"
        ],
        instruction: [
            "bite into apple"
        ],
        meal_type: "breakfast",
        difficulty: "beginner"
    },
    {
        id: 2,
        title: "banana",
        author: "",
        serving_size: 1,
        cook_time: 1,
        ingredients: [
            "banana"
        ],
        instruction: [
            "peel back outer skin",
            "eat"
        ],
        meal_type: "breakfast",
        difficulty: "beginner"
    },
    {
        id: 10,
        title: "test",
        author: "test",
        serving_size: 1,
        cook_time: 1,
        ingredients: [
            "apple",
            "banana"
        ],
        instruction: [
            "cook",
            "eat"
        ],
        meal_type: "dinner",
        difficulty: "professional"
    },
    {
        id: 21,
        title: "BLT Sandwich",
        author: "meeko",
        serving_size: 1,
        cook_time: 30,
        ingredients: [
            "bacon",
            "lettuce",
            "tomato",
            "bread",
            "mayo"
        ],
        instruction: [
            "toast bread",
            "cook bacon in pan over medium heat",
            "slice 1 tomato",
            "rinse lettuce",
            "spread mayo on bread ",
            "assemble sandwich with all ingredients inside toasted bread"
        ],
        meal_type: "lunch",
        difficulty: "beginner"
    }
]
}

function makeCookbookFixtures() {
  const testUsers = makeUsersArray();
  const testCookbooks = makeCookbookArray();
  const testRecipes = makeRecipesArray();
  return { testUsers, testCookbooks, testRecipes };
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      cookbook_users,
      cookbook_recipes,
      cookbooks
      RESTART IDENTITY CASCADE`
  );
}

function seedUsers(db, users){
  const pepperedUsers = users.map(user => ({
    ...user, 
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('cookbook_users').insert(pepperedUsers)
    .then(()=> 
    db.raw(
      `SELECT setval('cookbook_users_id_seq', ?)`,
      [users[users.length -1].id],
    )
  )
}

function seedCookbooksTables(db, users, cookbooks) {
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('cookbooks').insert(cookbooks)
    await trx.raw(
      `SELECT setval('cookbooks_id_seq', ?)`,
      [cookbooks[cookbooks.length -1].id]
    )
  })
}

function seedRecipesTables(db, users, recipes) {
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('cookbook_recipes').insert(recipes)
    await trx.raw(
      `SELECT setval('cookbook_recipes_id_seq', ?)`,
      [recipes[recipes.length -1].id]
    )
  })
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET){
  const token = jwt.sign(
    { user_id: user.id},
    secret, 
    {
      subject: user.user_name,
      algorithm: 'HS256',
    }
  );
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  seedCookbooksTables,
  seedRecipesTables,
  makeCookbookFixtures,
  cleanTables,
  makeAuthHeader,
  seedUsers
};