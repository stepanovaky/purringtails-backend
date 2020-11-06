const { expect } = require('chai');
const assert = require('assert');
const supertest = require('supertest');
const app = require('../src/app')
const UserService = require('../src/user-service')



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
    
    it('should return an array of schedules based on user id', () => {
        const user = {user: "d2c25821-81e7-4f33-a2a4-822051c61863"}
        return supertest(app)
        .get('/api/schedule')
        .set('Authorization', 'bearer '+`${process.env.TestJWT}`)
        .set(user)
        .expect(200)
    })
})


describe('User endpoints', () => {
    it('throws error when trying to register user with email already in the database', () => {
        const newUser = { authToken: "dGVzdEBnbWFpbC5jb206VGVzdGluZzEyMw==", givenName:"dGVzdA==" }
        return supertest(app)
        .post('/api/user')
        .send(newUser)
        .expect(400, '{"error":"User email already taken"}')
        
    })
    it('throws error when authorization is missing', () => {
        return supertest(app)
        .post('/api/user/email/login')
        .expect(400, `{"error":"Missing 'authorization' in request header"}`)
    })
    
        
        })
        
        
        
    

