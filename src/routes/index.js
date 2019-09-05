const root = require('./root')
const events = require('./events')
const home = require('./home')
const login = require('./login')
const logout = require('./logout')
const settings = require('./settings')
const signup = require('./signup')
const users = require('./users')
const username = require('./username')
const search = require('./search')

module.exports = (app) => {
  app.use('/', root)
  app.use('/events', events)
  app.use('/home', home)
  app.use('/login', login)
  app.use('/logout', logout)
  app.use('/settings', settings)
  app.use('/signup', signup)
  app.use('/users', users)
  app.use('/search', search)
  app.use('/', username)
}
