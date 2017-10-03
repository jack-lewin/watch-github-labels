const expect = require('chai').expect
const app = require('../app')
const sinon = require('sinon')
const GitHubApi = require('github')

describe('App', function() {

  describe('connect', function() {

    let formattedTime

    beforeEach(function() {
      formattedTime = new Date()
    })

    afterEach(function() {
      delete process.env.GITHUB_OAUTH;
    })

    describe('formattedTime is defined', function() {

      it('should return an authenticated github object', function() {
        process.env.GITHUB_OAUTH = 'test'
        const github = app.connect(formattedTime)
        expect(github).to.be.an.instanceof(GitHubApi)
        expect(github.authenticated).to.be.true
      })

      it('should return an un-authenticated github object', function() {
        const github = app.connect(formattedTime)
        expect(github).to.be.an.instanceof(GitHubApi)
        expect(github.authenticated).to.be.undefined
      })

    })

    describe('formattedTime is not defined', function() {

      it('should return an authenticated github object', function() {
        process.env.GITHUB_OAUTH = 'test'
        const github = app.connect()
        expect(github).to.be.an.instanceof(GitHubApi)
        expect(github.authenticated).to.be.true
      })

      it('should return an un-authenticated github object', function() {
        const github = app.connect()
        expect(github).to.be.an.instanceof(GitHubApi)
        expect(github.authenticated).to.be.undefined
      })

    })

  })

})
