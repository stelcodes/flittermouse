var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  const { userId } = req.session
  res.render('index', { title: 'Eventz', message: userId ? `your userId is ${userId}` : 'not logged in' })
})

module.exports = router
