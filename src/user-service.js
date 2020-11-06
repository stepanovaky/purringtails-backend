const { response } = require('express');
const knex = require('knex');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const xss = require('xss');




const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\S]+)/

const UserService = {
    getUserById(knex, user_id) {
        return knex('users')
        .where({ user_id })
    },
    insertUser(knex, newUser) {
        return knex
        .insert(newUser)
        .into('users')
        .returning('user_id', 'user_name', 'user_email')
        .then(rows => {
            return rows[0]
        })
    },
    validatePassword(password) {
        if (password.length < 8) {
            return 'Password must be longer than 8 characters'
        }
        if (password.length > 72 ) {
            return 'Password must be less than 72 characters'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty space'
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain 1 upper case, lower case and number'
        }
    },
    hasUserWithEmail(db, user_email) {
        return db('users')
            .where({ user_email })
            .first()
            .then(user => user)
            
    },
    comparePassword(user_password, userComparePassword) {
        return bcrypt.compare(user_password, userComparePassword)
    },
     checkForEmail(db, user_email) {
         console.log(user_email)
        return db ('users')
        .where({user_email})
        .first()
    },
     createJWT(payload) {
        return jwt.sign(payload, process.env.KEY)

    }, serializeUser (userId, userName, userEmail, tokenId) {
        return {
            id: userId,
            name: xss(userName),
            email: xss(userEmail),
            authToken: tokenId
        }
    }
}

module.exports = UserService;