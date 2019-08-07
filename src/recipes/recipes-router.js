const express = require('express');
const RecipeService = require('./recipes-service');

const recipesRouter = express.Router();
const jsonParser = express.json();

recipesRouter
  .route('/')
  .get((req, res, next) => {
    RecipeService.getAllRecipes(req.app.get('db'))
      .then(recipes => {
        res.json(recipes);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next)=> {
    const { title, author, serving_size, cook_time, difficulty, meal_type, ingredients, instruction } = req.body;
    const newRecipe = {title, author, serving_size, cook_time, difficulty, meal_type, ingredients, instruction };

    for(const [key, value] of Object.entries(newRecipe)){
      if(value === null){
        return res.status(400).json({
          error: {message: `Missing ${key}`}
        });
      }
    }
    RecipeService.insertRecipe(
      req.app.get('db'),
      newRecipe
    )
      .then(recipe => {
        res 
          .status(201)
          .json(recipe);
      })
      .catch(next);
  });

module.exports = recipesRouter;