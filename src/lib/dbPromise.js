const sqlite = require('sqlite')
const path = require('path')
const crypto = require('crypto')
const sql = require('sqlstring')
const fs = require('fs').promises
// sqlstring is WAY better then sqlite3 or sql-template-strings because it accepts an object param
// with properties that don't need to be referenced in the sql string. this way, you don't have to write
// out all the column names at all. So much simpler! Updates don't have to be multiple statements now.

const dbPromise = async (errHandler) => {
  const dbPath = path.resolve(__dirname, '../../build/eventz.db')
  const dbSetupPath = path.resolve(__dirname, '../../create_database.sql')
  const db = await sqlite.open(dbPath, { promise: Promise, verbose: true })
  await db.run('PRAGMA foreign_keys = ON')
  db.insertSql = item => {
    const columns = Object.keys(item).sort().map(column => sql.escapeId(column)).join(', ')
    const values = Object.keys(item).sort().map(column => sql.escape(item[column])).join(', ')
    return [columns, values]
  }
  db.refresh = async function () {
    try {
      const sqlFile = await fs.readFile(dbSetupPath, 'utf8')
      const uncommentedSql = sqlFile.split('\n').filter(line => !line.includes('--')).join('')
      return this.exec(uncommentedSql)
    } catch (err) {
      errHandler(err)
    }
  }
  db.populate = async function () {
    try {
      await this.insertUser({ id: 1, username: 'stel', email: 'stel@gmail.com', password: 'akbhfsuhd' })
      await this.insertUser({ id: 2, username: 'alice', email: 'alice@gmail.com', password: 'h7d5kf4s' })
      await this.insertUser({ id: 3, username: 'ash', email: 'ash@gmail.com', password: 'shjkshkh3' })
      await this.insertEvent({ id: 1, userId: 1, name: 'stels big party' })
      await this.insertUserRelationship({ id: 1, initialUserId: 1, targetUserId: 2, relationship: 'listen' })
    } catch (err) {
      errHandler(err)
    }
  }
  db.insertUser = async function (user) {
    try {
      user.inviteKey = crypto.randomBytes(6).toString('hex')
      const [columns, values] = this.insertSql(user)
      const statement = `INSERT INTO user ( ${columns} ) VALUES ( ${values} )`
      const results = await this.run(statement)
      await this.insertUserPrivacy({ userId: results.lastID })
    } catch (err) {
      errHandler(err)
    }
  }
  db.insertUserPrivacy = async function (userPrivacy) {
    try {
      const [columns, values] = this.insertSql(userPrivacy)
      const statement = `INSERT INTO userPrivacy ( ${columns} ) VALUES ( ${values} )`
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.insertUserRelationship = async function (userRelationship) {
    try {
      const [columns, values] = this.insertSql(userRelationship)
      const statement = `INSERT INTO userRelationship ( ${columns} ) VALUES ( ${values} )`
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.insertEvent = async function (event) {
    try {
      event.urlKey = crypto.randomBytes(6).toString('hex')
      const [columns, values] = this.insertSql(event)
      const statement = `INSERT INTO event ( ${columns} ) VALUES ( ${values} )`
      const results = await this.run(statement)
      await this.insertEventPrivacy({ eventId: results.lastID })
    } catch (err) {
      errHandler(err)
    }
  }
  db.insertEventPrivacy = async function (eventPrivacy) {
    try {
      const [columns, values] = this.insertSql(eventPrivacy)
      const statement = `INSERT INTO eventPrivacy ( ${columns} ) VALUES ( ${values} )`
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.insertEventImage = async function (eventImage) {
    try {
      const [columns, values] = this.insertSql(eventImage)
      const statement = `INSERT INTO eventImage ( ${columns} ) VALUES ( ${values} )`
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.insertAttendance = async function (attendance) {
    try {
      const [columns, values] = this.insertSql(attendance)
      const statement = `INSERT INTO attendance ( ${columns} ) VALUES ( ${values} )`
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.insertEventQuestion = async function (eventQuestion) {
    try {
      const [columns, values] = this.insertSql(eventQuestion)
      const statement = `INSERT INTO eventQuestion ( ${columns} ) VALUES ( ${values} )`
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.insertEventTag = async function (eventTag) {
    try {
      const [columns, values] = this.insertSql(eventTag)
      const statement = `INSERT INTO eventTag ( ${columns} ) VALUES ( ${values} )`
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.deleteUserPrivacy = async function (id) {
    // only one field accepted
    try {
      const statement = sql.format('DELETE FROM userPrivacy WHERE id = ?', id)
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.deleteEventPrivacy = async function (id) {
    // only one field accepted
    try {
      const statement = sql.format('DELETE FROM eventPrivacy WHERE id = ?', id)
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.deleteUserRelationship = async function (id) {
    // only one field accepted
    try {
      const statement = sql.format('DELETE FROM userRelationship WHERE id = ?', id)
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.deleteEventImage = async function (id) {
    // only one field accepted
    try {
      const statement = sql.format('DELETE FROM eventImage WHERE id = ?', id)
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.deleteAttendance = async function (id) {
    // only one field accepted
    try {
      const statement = sql.format('DELETE FROM attendance WHERE id = ?', id)
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.deleteEventQuestion = async function (id) {
    // only one field accepted
    try {
      const statement = sql.format('DELETE FROM eventQuestion WHERE id = ?', id)
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.deleteEventTag = async function (id) {
    // only one field accepted
    try {
      const statement = sql.format('DELETE FROM eventTag WHERE id = ?', id)
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.deleteUser = async function (id) {
    // only one field accepted
    try {
      let statement = sql.format('SELECT id FROM userRelationship WHERE targetUserId = ? OR initialUserId = ?', [id, id])
      let results = await this.all(statement)
      let updates = results.map(row => this.deleteUserRelationship(row.id))
      await Promise.all(updates)
      statement = sql.format('SELECT id FROM userPrivacy WHERE userId = ?', id)
      results = await this.get(statement)
      await this.deleteUserPrivacy(results.id)
      statement = sql.format('SELECT id FROM event WHERE userId = ?', id)
      results = await this.all(statement)
      updates = results.map(row => this.deleteEvent(row.id))
      await Promise.all(updates)
      statement = sql.format('DELETE FROM user WHERE id = ?', id)
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.deleteEvent = async function (id) {
    // only one field accepted
    try {
      let statement = sql.format('SELECT id FROM attendance WHERE eventId = ?', id)
      let results = await this.all(statement)
      let updates = results.map(row => this.deleteAttendance(row.id))
      await Promise.all(updates)
      statement = sql.format('SELECT id FROM eventImage WHERE eventId = ?', id)
      results = await this.all(statement)
      updates = results.map(row => this.deleteEventImage(row.id))
      await Promise.all(updates)
      statement = sql.format('SELECT id FROM eventTag WHERE eventId = ?', id)
      results = await this.all(statement)
      updates = results.map(row => this.deleteEventTag(row.id))
      await Promise.all(updates)
      statement = sql.format('SELECT id FROM eventPrivacy WHERE eventId = ?', id)
      results = await this.get(statement)
      await this.deleteEventPrivacy(results.id)
      statement = sql.format('DELETE FROM event WHERE id = ?', id)
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }

  db.updateUser = async function (user) {
    // must have id
    try {
      const userId = user.id
      delete user.id
      const statement = sql.format('UPDATE user SET ? WHERE id = ?', [user, userId])
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.updateEvent = async function (event) {
    // must have id
    try {
      const eventId = event.id
      delete event.id
      const statement = sql.format('UPDATE event SET ? WHERE id = ?', [event, eventId])
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.updateEventPrivacy = async function (eventPrivacy) {
    // must have id
    try {
      const eventPrivacyId = eventPrivacy.id
      delete eventPrivacy.id
      const statement = sql.format('UPDATE eventPrivacy SET ? WHERE id = ?', [eventPrivacy, eventPrivacyId])
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.updateUserPrivacy = async function (userPrivacy) {
    // must have id
    try {
      const userPrivacyId = userPrivacy.id
      delete userPrivacy.id
      const statement = sql.format('UPDATE userPrivacy SET ? WHERE id = ?', [userPrivacy, userPrivacyId])
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.updateUserRelationship = async function (userRelationship) {
    // must have id
    try {
      const userRelationshipId = userRelationship.id
      delete userRelationship.id
      const statement = sql.format('UPDATE userRelationship SET ? WHERE id = ?', [userRelationship, userRelationshipId])
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.updateEventImage = async function (eventImage) {
    // must have id
    try {
      const eventImageId = eventImage.id
      delete eventImage.id
      const statement = sql.format('UPDATE eventImage SET ? WHERE id = ?', [eventImage, eventImageId])
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.updateAttendance = async function (attendance) {
    // must have id
    try {
      const attendanceId = attendance.id
      delete attendance.id
      const statement = sql.format('UPDATE attendance SET ? WHERE id = ?', [attendance, attendanceId])
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.updateEventQuestion = async function (eventQuestion) {
    // must have id
    try {
      const eventQuestionId = eventQuestion.id
      delete eventQuestion.id
      const statement = sql.format('UPDATE eventQuestion SET ? WHERE id = ?', [eventQuestion, eventQuestionId])
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.updateEventTag = async function (eventTag) {
    // must have id
    try {
      const eventTagId = eventTag.id
      delete eventTag.id
      const statement = sql.format('UPDATE eventTag SET ? WHERE id = ?', [eventTag, eventTagId])
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.selectUser = async function (id) {
    // only one field accepted
    try {
      const statement = sql.format('SELECT * FROM user WHERE id = ?', id)
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.selectEvent = async function (id) {
    // only one field accepted
    try {
      const statement = sql.format('SELECT * FROM event WHERE id = ?', id)
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.selectEventByUserId = async function (id) {
    // only one field accepted
    try {
      const statement = sql.format('SELECT * FROM event WHERE userId = ?', id)
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.selectUserPrivacyByUserId = async function (id) {
    // only one field accepted
    try {
      const statement = sql.format('SELECT * FROM userPrivacy WHERE userId = ?', id)
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.selectEventPrivacyByEventId = async function (id) {
    // only one field accepted
    try {
      const statement = sql.format('SELECT * FROM eventPrivacy WHERE eventId = ?', id)
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.selectUserRelationshipByInitialUserId = async function (id) {
    // only one field accepted
    try {
      const statement = sql.format('SELECT * FROM userRelationship WHERE initialUserId = ?', id)
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.selectUserRelationshipByTargetUserId = async function (id) {
    // only one field accepted
    try {
      const statement = sql.format('SELECT * FROM userRelationship WHERE targetUserId = ?', id)
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.selectEventImageByEventId = async function (id) {
    // only one field accepted
    try {
      const statement = sql.format('SELECT * FROM eventImage WHERE eventId = ?', id)
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.selectAttendanceByUserId = async function (id) {
    // only one field accepted
    try {
      const statement = sql.format('SELECT * FROM attendance WHERE userId = ?', id)
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.selectAttendanceByEventId = async function (id) {
    // only one field accepted
    try {
      const statement = sql.format('SELECT * FROM attendance WHERE eventId = ?', id)
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.selectEventQuestionByEventId = async function (id) {
    // only one field accepted
    try {
      const statement = sql.format('SELECT * FROM eventQuestion WHERE eventId = ?', id)
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }
  db.selectEventTagByEventId = async function (id) {
    // only one field accepted
    try {
      const statement = sql.format('SELECT * FROM eventTag WHERE eventId = ?', id)
      await this.run(statement)
    } catch (err) {
      errHandler(err)
    }
  }

  return db
}

module.exports = dbPromise