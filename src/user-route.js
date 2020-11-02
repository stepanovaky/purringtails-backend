require('dotenv').config();
const express = require('express');
const UserService = require('./user-service');
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors')

const app = express();

app.options('/api/user/google/login', cors())

const userRouter = express.Router();
const jsonParser = express.json();

key =  "-----BEGIN CERTIFICATE-----\nMIIDJjCCAg6gAwIBAgIIF3cBaNBmfgUwDQYJKoZIhvcNAQEFBQAwNjE0MDIGA1UE\nAxMrZmVkZXJhdGVkLXNpZ25vbi5zeXN0ZW0uZ3NlcnZpY2VhY2NvdW50LmNvbTAe\nFw0yMDEwMzEwNDI5NDVaFw0yMDExMTYxNjQ0NDVaMDYxNDAyBgNVBAMTK2ZlZGVy\nYXRlZC1zaWdub24uc3lzdGVtLmdzZXJ2aWNlYWNjb3VudC5jb20wggEiMA0GCSqG\nSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDj8inD/LNXc4HV9LieCecfZxEPLt1lME/x\nMRqomIgse97c/Zno1KBOv11ssJReM76nC3q390yzahU8N+kzwj7XSD1w76Bw8DlB\nPNMpweid53QH2nyPMQS9IMGV6PWofT5KAkyihCtslceNq0XhOIA5MIVP7JHA9txq\nvRBiG9RY1XnbGMS+PjIOeYrjbLzX0tjsfL4aTOTLiJX2aN/qoQWaXFONJ2rG5CjR\njrxgclksZLHetCY3Ni3RdjxKjdoYpfP+/iYweRmXraZAbHlT/zQuYH7ePpaMgleK\nUmaPWlsxToKnqxaMD2lOADEXksPPGmVemNBqzfe+wnmfXGyYbGmjAgMBAAGjODA2\nMAwGA1UdEwEB/wQCMAAwDgYDVR0PAQH/BAQDAgeAMBYGA1UdJQEB/wQMMAoGCCsG\nAQUFBwMCMA0GCSqGSIb3DQEBBQUAA4IBAQC/S0gXu/ExGJsJjZhCcsl75dt97g+i\nxN6txB+PjqCxFNh7UXJzQbHdRXWzLGtYzE1ZObmDtq7YDi022/Hf4xXf/6ls4Szc\nShD7Nad+IXTdmX1lLiY4e+JLhHZ0H0gNhpZUpUAr7KzySgcfufxTH6N1FMtaCDOk\nf13ulQMCkThTTXzG7eQU2EuHnOMZJ/ttQ7O+XqhrlZT+tBdxKxmO6phZggRWWIh4\nzh/9H8a9+RcQc8MKQP1L/WEob42Q383OWUBuoKVveZXyDnIaz5EOqMIIILTAPXBO\nbasHfZtHjuH/Cjx2LWBLrl8tzasKPnYpl7NWWtT6/lH54L92uoyO4l66\n-----END CERTIFICATE-----\n"
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
        // "https://purringtails-backend.herokuapp.com/api/user/google/login",

        userRouter
            .route('/api/user/google/login')
            .get((req, res) => {

                jwt.verify(req.get('Authorization').split(' ')[1], key, { algorithms: ['RS256']}, function(err, decoded) {
                    if (err) {
                        return console.error(err)
                    };
                    UserService.hasUserWithEmail(
                        req.app.get('db'),
                        decoded.email
                    )
                    .then(hasUserWithEmail => {
                        if (hasUserWithEmail != null) {
                            jwtInitializeTime = new Date().getTime()
  oneHour = 3600
  jwtExpTime = jwtInitializeTime + oneHour
  const payload = {
      email: decoded.email,
      name: decoded.given_name,
      given_name: decoded.given_name,
      iat: jwtInitializeTime,
      exp: jwtExpTime
                        }
                        const tokenId = UserService.createJWT(payload)
      return res
              .status(200)
              .json(UserService.serializeUser(hasUserWithEmail.user_id, hasUserWithEmail.user_name, hasUserWithEmail.user_email, tokenId))
  } else {
      const newUser = { user_id: uuidv4(), user_name: decoded.given_name, 
        user_email: decoded.email, 
        user_password:'google' }
              UserService.insertUser(
                  req.app.get('db'),
                  newUser
               ) }
               if (req.get('Authorization') === null) {
                return res.status(400).json({error: 'Unauthorized access'})
              }

                })
                })}
            )
        

    

    module.exports = userRouter;