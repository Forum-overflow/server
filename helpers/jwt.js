const jwt = require('jsonwebtoken')

module.exports = {
  sign: function (user) {
    return new Promise((resolve, reject) => {
      jwt.sign(user, process.env.SECRET, function (err, token) {
        err ? reject(err) : resolve(token)
      })
    })
  },
  verify: function (token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.SECRET, function (err, decoded) {
        err ? reject(err) : resolve(decoded)
      })
    })
  }
}