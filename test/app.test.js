const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../src/app')

describe('Express App', () => {
    it('should return a message from GET /health', () => {
        return supertest(app)
            .get('/health')
            .expect(200, '{"message":"this is working"}')
    })
})