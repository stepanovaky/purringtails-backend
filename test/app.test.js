const { expect } = require('chai');
const { auth } = require('google-auth-library');
const supertest = require('supertest');
const app = require('../src/app')

describe('Schedule endpoints', () => {
    it('should return a message from GET /health', () => {
        return supertest(app)
            .get('/health')
            .expect(200, '{"message":"this is working"}')
    })
    it('should return status 200 and a list of all schedules', () => {
        return supertest(app)
        .get('/api/schedule/all')
        .set('Authorization', 'bearer '+`${process.env.TestJWT}`)
        .expect(200)
        .expect('Content-Type', /json/)
    })
    it('should post a new schedule', () => {
        return supertest(app)
        .post('/api/schedule')
        .set('Authorization', 'bearer '+`${process.env.TestJWT}`)
    })
    it('should return an array of schedules based on user id', () => {
        return supertest(app)
        .get('/api/schedule')
        .set('Authorization', 'bearer '+`${process.env.TestJWT}`)
    })
    it('should delete given schedule based on schedule id', () => {
        return supertest(app)
        .delete('/api/schedule')
        .set('Authorization', 'bearer '+`${process.env.TestJWT}`)
    })
})

describe('User endpoints', () => {
    it('throws error when trying to register user with email already in the database', () => {
        const newUser = { authToken: "dGVzdEBnbWFpbC5jb206VGVzdGluZzEyMw==", givenName:"dGVzdA==" }
        return supertest(app)
        .post('/api/user')
        .set(newUser)
        .expect(400, 'message')
        .end();

       
        
    })
    it('returns JWT token when user logs in', () => {
        return supertest(app)
        .post('/api/user/email/login')
        .set('authToken', "dGVzdEBnbWFpbC5jb206VGVzdGluZzEyMw==")
        .expect(200)
    })

})