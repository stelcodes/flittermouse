const Router = require('express-promise-router')
const db = require('../db')
const router = new Router()

const redirectHome = (req, res, next) => {
  if (req.session.userId) res.redirect('/home')
  else next()
}

router.get('/', redirectHome, function (req, res, next) {
  try {
    const { sessionUser } = res.locals
    res.render('index', sessionUser)
  } catch (err) {
    console.log(err.stack)
    next(err)
  }
})

router.get('/:username', async function (req, res, next) {
  try {
    const { sessionUser } = res.locals
    const targetUsername = req.params.username
    
  } catch (err) {
    console.error(err.stack)
    next(err)
  }

  // if (['home', 'events', 'settings', 'blog', 'about'].includes(targetUsername)) {
  //   next()
  // } else if (sessionUser && sessionUser.username === targetUsername) {
  //   res.redirect('/home')
  // } else {
  //   // next function can handle errors
  //   const db = await dbPromise()
  //   const targetUser = await db.selectUserByUsername(targetUsername)
  //   if (targetUser) {
  //     const hostingEvents = await db.selectEventsByUserId(targetUser.id)
  //     const attendance = await db.selectAttendanceByUserId(targetUser.id)
  //     const attendingEvents = await Promise.all(attendance.map(attendance => db.selectEventById(attendance.eventId)))
  //     res.render('user', { sessionUser, targetUser, hostingEvents, attendingEvents })
  //   } else next()
  // }
})

module.exports = router