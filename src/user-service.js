const knex = require('knex');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\S]+)/

const UserService = {
    getUserById(knex, user_id) {
        return knex('users')
        .where({ id })
    },
    getUserByEmail(knex, user_email) {
        return knex('users')
        .where({ user_email })
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
    updateUser(knex, id, updateUser) {
        return knex('users')
        .where({ id })
        .update(updateUser)
    },
    deleteUser(knex, id) {
        return knex('users')
        .where({ id })
        .delete()
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
            .then(user => !!user)
    }
}

module.exports = UserService;