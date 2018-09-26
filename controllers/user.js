const User = require('../models/User')
const { sign } = require('../helpers/jwt')
const { encrypt, decrypt } = require('../helpers/hash')
const sendEmail = require('../helpers/sendEmail')
var CronJob = require('cron').CronJob;


module.exports = {
  signup: function (req, res) {
    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: encrypt(req.body.password)
    })

    newUser
      .save()
      .then(newUserDb => {
        res.status(200).json({
          message: 'Berhasil Daftar',
          data: newUserDb
        })
      })
      .catch(err => {
        res.status(500).json({
          message: err
        })
      })
  },
  signin: function (req, res) {
    let email = req.body.email
    let password = req.body.password
    let dataUser
    User.findOne({
        email: email
      })
      .then(user => {
        dataUser = user
        let hashPassword
        if(user) {
          hashPassword = user.password
          if (decrypt(password, hashPassword)) {
            let date = new Date()
            new CronJob(`${date.getSeconds()} ${date.getMinutes()+1} ${date.getHours()} ${date.getDate()} ${date.getMonth()} ${date.getDay()}`, function() {
              console.log('SEND EMAIL');
              sendEmail(dataUser.email)
            }, null, true, 'Asia/Jakarta');
            return sign({
              _id: user._id,
              email: user.email
            })
          } else {
            return false
          }
        } else {
          return false
        }
      })
      .then(token => {
        if(!token) {
          res.status(404).json({
            message: 'You have entered an invalid email or password'
          })
        }else{
          res.status(200).json({
            token: token,
            name: dataUser.name,
            email: dataUser.email
          })
        }
      })
      .catch(err => {
        res.status(500).json(err)
      })
  },
  signinOther (req, res) {
    let userLogin
    User.findOne({
      name: req.body.name,
      email: req.body.email
    })
      .then(user => {
        if (user) {
          return user
        } else {
          return User.create({
            name: req.body.name,
            email: req.body.email
          })
        }
      })
      .then(user => {
        userLogin = user
        let date = new Date()
        new CronJob(`${date.getSeconds()} ${date.getMinutes()+1} ${date.getHours()} ${date.getDate()} ${date.getMonth()} ${date.getDay()}`, function() {
          sendEmail(user.email)
        }, null, true, 'Asia/Jakarta');
        return sign({
          _id: user._id,
          email: user.email
        })
      })
      .then(token => {
        res.status(200).json({
          token: token,
          name: userLogin.name,
          email: userLogin.email
        })
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }
}