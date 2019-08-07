const express = require('express');
const CookbookService = require('./cookbook-service');

const cookbookRouter = express.Router();
const jsonParser = express.json();

cookbookRouter
  .route('/')
  .get((req, res, next) => {
    CookbookService.getAllCookbooks(req.app.get('db'))
      .then(cookbooks => {
        res.json(cookbooks);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const {title}= req.body;
    const newCookbook = {title};

    if(title === null){
      return res.status(400).json({
        error: {message: 'Missing title'}
      });
    }
    CookbookService.insertCookbook(
      req.app.get('db'),
      newCookbook
    )
      .then(cookbook => {
        res
          .status(201)
          .json(cookbook);
      })
      .catch(next);
  });

cookbookRouter
  .route('/:cookbook_id')
  .all((req, res, next) => {
    CookbookService.getById(
      req.app.get('db'),
      req.params.cookbook_id
    )
      .then(cookbook => {
        if(!cookbook){
          return res.status(404).json({
            error: {message: 'Cookbook does not exist'}
          });
        }
        res.cookbook = cookbook;
        next();
      })
      .catch(next);
  })
  .delete((req,res, next) => {
    CookbookService.deleteCookbook(
      req.app.get('db'),
      req.params.cookbook_id
    )
      .then(()=> {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = cookbookRouter;