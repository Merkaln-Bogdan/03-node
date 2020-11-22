const sgMail = require('@sendgrid/mail')
const { response } = require('express')
const path = require('path')
require('dotenv').config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

async function sendGridMail(email,verificationToken) {
  
  await sgMail 
  .send(
   {
    to: email, 
    from: 'piccasoul19@ukr.net', 
    subject: 'Verify email',
    text: 'to confirm your mail, go to the link below',
    html: `<strong>To confirm your email <a href="http://localhost:3000/api/user/auth/verify/${verificationToken}">click here</a></strong>`
   }
  )
  .then(response => {
    console.log('Email sent', response)
  })
  .catch((error) => {
    console.error(error)
  })
}
  
  module.exports = sendGridMail