const express = require('express');
const UserService = require('./user-service');
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs');

const userRouter = express.Router();
const jsonParser = express.json();

userRouter
    .route('/api/userbyid')
    .get((req, res, next) => {
        const user = req.header('user');
        UserService.getUserById(
            req.app.get('db'),
            user
        )
        .then(user => {
            console.log(user)
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
                    return res.status(400).json({ error: 'Password is incorrect' })
        
       
        const salt = await bcrypt.genSalt()
        const hashedUserPassword = await bcrypt.hashSync(userPassword, salt)
        UserService.hasUserWithEmail(
            req.app.get('db'),
            userEmail
        )
            .then(hasUserWithEmail => {
                if (hasUserWithEmail) {
                    return res.status(400).json({ error: 'User email already taken' })
                } else {
                    const newUser = { user_id: uuidv4(), user_name: userName, user_email: userEmail, user_password: hashedUserPassword }
                            UserService.insertUser(
                                req.app.get('db'),
                                newUser
                             ) }
                    
                
            } )
            
       
        
        .then(user => { return res.sendStatus(201)})
                        {
                            res
                                .status(201)
                                .json(UserService.serializeUser(user.user_id, user.user_name, user.user_email))
                        }
                
        

    })

    userRouter
        .route('/api/user/email/login')
        .post(jsonParser, async (req, res, next) => {
            const Authorization = req.headers['authorization']
            for (const field of [ 'authorization'])
        if (!req.headers[field])
            return res.status(400).json({
                error:`Missing '${field}' in request header`
            })
            const [ userEmail, userPassword ] = Buffer
            .from(Authorization.split(' ')[1], 'base64')
            .toString()
            .split(':')
            const loginUser = { userEmail, userPassword}
            UserService.checkForEmail(
                req.app.get('db'),
                loginUser.userEmail
            )
                .then(user => {
                    if (!user)
                        return res.status(400).json({
                            error: 'Incorrect username or password'
                        })
                    
                        UserService.comparePassword(loginUser.userPassword, user[0].user_password)
                        .then(compareMatch => {
                            if (!compareMatch)
                            return res.status(400).json({
                                error: 'Incorrect user_name or password'
                            })
                    
                    })
                    jwtInitializeTime = new Date().getTime()
                    oneHour = 3600
                    jwtExpTime = jwtInitializeTime + oneHour
                    const payload = {
                        email: user[0].user_email,
                        name: user[0].user_name,
                        given_name: user[0].user_name,
                        iat: jwtInitializeTime,
                        exp: jwtExpTime
                    }
                    const tokenId = UserService.createJWT(payload);
                    res
                        .status(200)
                        .set({authToken: UserService.createJWT(payload)})
                        .json(UserService.serializeUser(user[0].user_id, user[0].user_name, user[0].user_email))
                    
                        
                    }
                )
                
        })
        

    

    module.exports = userRouter;