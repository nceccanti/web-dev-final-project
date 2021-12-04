const nodemailer = require("nodemailer");
const { google  } = require("googleapis");
require("dotenv").config();

const CLIENT_ID = process.env.CLIENT_ID_KEY;
const CLIENT_SECRET = process.env.CLIENT_SECRET_KEY;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = process.env.REFRESH_TOKEN_KEY;
const HYDROCLOCK_EMAIL = "officialhydroclock@gmail.com";

const SID = process.env.SID_KEY;
const AUTH_TOKEN = process.env.AUTH_TOKEN_KEY;
const client = require("twilio")(SID, AUTH_TOKEN)
const HYDROCLOCK_PHONE = "+18507878234";

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

const sendMail = async function(client, subjectBody, textBody, htmlBody) {
    try {
      const accessToken = await oAuth2Client.getAccessToken();
      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: HYDROCLOCK_EMAIL,
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken
        }
      })
  
      const mailOptions = {
        from: HYDROCLOCK_EMAIL,
        to: client,
        subject: subjectBody,
        text: textBody,
        html: htmlBody
      };
  
      const result = transport.sendMail(mailOptions)
      return result;
  
    } catch (error) {
      console.log(error)
      return error
    }
  }
  
  const sendSMS = async function (userNumber, bodyText) {
    client.messages
      .create({
        to: userNumber,
        from: HYDROCLOCK_PHONE,
        body: bodyText
      })
    .then(message => console.log(message.sid));
  }
module.exports = {sendSMS, sendMail} 
