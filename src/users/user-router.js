const express = require('express');
const path = require('path');

const usersRouter = express.Router();
const jsonParser = express.json();

const UsersService = require('./user-service');

usersRouter
  .post('/', jsonParser, (req, res, next)=> {
    const { password, user_name, full_name } =req.body;

    for( const field of ['full_name', 'user_name', 'password'])
      if(!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });
    
    //password validation (inside user-service)
    const passError = UsersService.validatePassword(password);
    if(passError)
      return res.status(400).json({error: passError});

    UsersService.hasUserWithUserName(
      req.app.get('db'),
      user_name
    )
      .then(hasUserWithUserName => {
        if(hasUserWithUserName)
          return res.status(400).json({
            error: 'Username already taken'
          });

        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              user_name,
              password: hashedPassword,
              full_name,
              date_created: 'now()'
            };
            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(UsersService.serializeUser(user));
              });
          });
      })
      .catch(next);
  });

module.exports = usersRouter;