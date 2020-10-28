const express = require('express');
const UserService = require('./user-service');
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs');
const { json } = require('express');

const userRouter = express.Router();
const jsonParser = express.json();

userRouter
    .route('/api/userbyid')
    .get((req, res, next) => {
        const { user_id } = req.body
        UserService.getUserById(
            req.app.get('db'),
            user_id
        )
        .then(user => {
            res.json(user)
        })
        .catch(next)
    })

userRouter
    .route('/api/userbyemail')
    .get((req, res, next) => {
        const { user_email } = req.body
        UserService.getUserByEmail(
            req.app.get('db'),
            user_email
        )
        .then(user => {
            res.json(user)
        })
        .catch(next)
    })

userRouter
    .route('/api/user')
    .post(jsonParser, async (req, res, next) => {
        const { givenName, authToken } = req.body
        const userName = Buffer
            .from(givenName, 'base64')
            .toString()
        const [ userEmail, userPassword ] = Buffer
            .from(authToken, 'base64')
            .toString()
            .split(':')
        for (const field of [ 'givenName', 'authToken'])
            if (!req.body[field])
                return res.status(400).json({
                    error:`Missing '${field}' in request body`
                })
            const passwordError = UserService.validatePassword(userPassword)
            
               if (passwordError)
                    return res.status(400).json({ error: passwordError })
        
       
        const salt = await bcrypt.genSalt()
        const hashedUserPassword = await bcrypt.hashSync(userPassword, salt)
        UserService.hasUserWithEmail(
            req.app.get('db'),
            userEmail
        )
            .then(hasUserWithEmail => {
                if (hasUserWithEmail)
                    return res.status(400).json({ error: 'User email already taken' })
            })
        const newUser = { user_id: uuidv4(), user_name: userName, user_email: userEmail, user_password: hashedUserPassword }
        UserService.insertUser(
            req.app.get('db'),
            newUser
        )
        .then(res.sendStatus(201))

    })
    

    module.exports = userRouter;