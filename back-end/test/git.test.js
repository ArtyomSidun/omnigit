const chai = require('chai')
const assert = chai.assert
const request = require('superagent')
describe('Git:', () => {
  describe('clone repository', () => {
    it('should return error if params not exists', (done) => {
      request.post('http://localhost:5000/get_current_repo').send({
        providerName: null,
        code: null,
        repoName: null
      }).set('content-type', 'application/json')
        .catch((error) => {
          done(assert.equal(error.status, 422))
        })
    })
    it('should return error if incorrect provider name', (done) => {
      request.post('http://localhost:5000/get_current_repo').send({
        providerName: 'test',
        code: 'test',
        repoName: 'test'
      }).set('content-type', 'application/json')
        .catch((error) => {
          done(assert.equal(error.status, 404))
        })
    })
    it('should return error if incorrect code', (done) => {
      request.post('http://localhost:5000/get_current_repo').send({
        providerName: 'github',
        code: 'test',
        repoName: 'test'
      }).set('content-type', 'application/json')
        .catch((error) => {
          done(assert.equal(error.status, 401))
        })
    })
  })
  describe('push repository', () => {
    it('should return error if params not exists', (done) => {
      request.post('http://localhost:5000/push_repo').send({
        providerName: null,
        code: null,
        repoName: null
      }).set('content-type', 'application/json')
        .catch((error) => {
          done(assert.equal(error.status, 422))
        })
    })
    it('should return error if incorrect provider name', (done) => {
      request.post('http://localhost:5000/push_repo').send({
        providerName: 'test',
        code: 'test',
        repoName: 'test'
      }).set('content-type', 'application/json')
        .catch((error) => {
          done(assert.equal(error.status, 404))
        })
    })
    it('should return error if incorrect code', (done) => {
      request.post('http://localhost:5000/push_repo').send({
        providerName: 'github',
        code: 'test',
        repoName: 'test'
      }).set('content-type', 'application/json')
        .catch((error) => {
          done(assert.equal(error.status, 401))
        })
    })
  })
})
