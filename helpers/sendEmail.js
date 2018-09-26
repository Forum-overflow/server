const nodemailer = require('nodemailer')
const kue = require('kue')
const queue = kue.createQueue()
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
})

let send = function (email) {
  const sendEmail = {
    subject: 'You just signed',
    title: 'You just signed',
    to: `${email}`,
    from: process.env.EMAIL,
    text: `You just signed in to ${email}!`,
    html: `
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Document</title>
      <link href="https://fonts.googleapis.com/css?family=Crete+Round" rel="stylesheet"> 
    </head>
    <body>
      <center>
        <div class="card">
          <div class="content">
            <h1>Security Alert</h1>
            <h4>You just signed in to ${email}</h4>
            <br>
            <p>Your Account was just signed in. You're getting this email to make sure it was you.</p>
          </div>
        </div>
      </center>
    </body>
    </html>
    `
  }
  queue.create('email', sendEmail).removeOnComplete( true ).save(function (err) {
    if (!err) {
      transporter.sendMail(sendEmail, (err, info) => {
        if (err) {
          console.log(err)
        } else {
          console.log(info)
        }
      })
    } else {
      console.log(err)
    }
  })
}


module.exports = send