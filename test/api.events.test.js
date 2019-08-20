const assert = require('assert')
const request = require('supertest')
const app = require('../src/app')
const exec = require('child_process').exec

describe('/events endpoints', () => {
  before((done) => {
    exec('make db', (err, stdout, stderr) => {
      if (err) done(err)
      done()
    })
  })
  describe('POST events/add', () => {
    it('should accept good requests', () => {
      const goodAddRequests = [
        { name: 'Stels Big Birthday Bash', userKey: 'validUserKey' }
      ]
      const tests =
        goodAddRequests.map((reqBody) => {
          return request(app)
            .post('/events/add')
            .send(reqBody)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
              assert(res.body.success, JSON.stringify(res.body))
              assert(res.body.eventKey, JSON.stringify(res.body))
            })
            .catch((err) => {
              throw err
            })
        })
      return Promise.all(tests)
    })
  })

  describe('DELETE events/delete', () => {
    it('should accept good requests', () => {
      const goodDeleteRequests = [
        { eventKey: 'validEventKey2' }
      ]
      const tests =
        goodDeleteRequests.map((reqBody) => {
          return request(app)
            .delete('/events/delete')
            .send(reqBody)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => { assert(res.body.success, JSON.stringify(res.body)) })
            .catch(err => {
              throw err
            })
        })
      return Promise.all(tests)
    })
  })

  describe('PUT events/update', () => {
    it('should accept good requests', () => {
      const goodUpdateRequests = [
        { eventKey: 'validEventKey', name: 'Updated name event' },
        { eventKey: 'validEventKey', dateOf: '44244525' }
      ]
      const tests =
        goodUpdateRequests.map((reqBody) => {
          return request(app)
            .put('/events/update')
            .send(reqBody)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => { assert(res.body.success, JSON.stringify(res.body)) })
            .catch(err => {
              throw err
            })
        })
      return Promise.all(tests)
    })
  })

  describe('PUT events/privacy/update', () => {
    it('should accept good requests', () => {
      const goodPrivacyUpdateRequests = [
        { eventKey: 'validEventKey', visibility: 'trusted' },
        { eventKey: 'validEventKey', visibility: 'private' }
      ]
      const tests =
        goodPrivacyUpdateRequests.map((reqBody) => {
          return request(app)
            .put('/events/privacy/update')
            .send(reqBody)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => { assert(res.body.success, JSON.stringify(res.body)) })
            .catch(err => {
              throw err
            })
        })
      return Promise.all(tests)
    })
  })
})