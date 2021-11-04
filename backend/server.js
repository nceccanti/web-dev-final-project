const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");
const { google  } = require("googleapis");
const schedule = require("node-schedule");

const CLIENT_ID = "446684941777-igvr17otdg241hlcs2iudfkjh235nstk.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04NpjFdEAYbBNCgYIARAAGAQSNwF-L9IrdEcUEQueV3N33mS00YFzVw1zMTuZSBZoqFV8KqTL8iva5c3qxwFR_QcXzwaP_TohdFA";
const HYDROCLOCK_EMAIL = "officialhydroclock@gmail.com";

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const exercisesRouter = require('./routes/plants');
const usersRouter = require('./routes/users');
const { notify } = require('./routes/plants');
const { Component } = require('react');
const { callbackPromise } = require('nodemailer/lib/shared');

app.use('/plants', exercisesRouter);
app.use('/users', usersRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

schedule.scheduleJob("0 8 * * *", () => {
  console.log("yuh");
})

async function sendMail(client) {
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
      to: "client",
      subject: "This is a test email using HydroClock web api",
      text: "Hello this a hydroclock email!",
      html: "<h1>Hello this a hydroclock email!</h1>"
    };

    const result = transport.sendMail(mailOptions)
    return result;

  } catch (error) {
    console.log(error)
    return error
  }
}

// sendMail().then(result => console.log("Email sent with API", result))
// .catch(error => console.log(error.message));

function getEmails() {
  let x = new XMLHttpRequest();
  x.onreadystatechange = function() {
    if(x.readyState == 4 && x.status == 200) {
      callbackPromise(x.responseText);
    }
  }
  x.open("GET", "http://localhost:5000/users", false);
  x.responseType("json");
  x.send();
}

function notifyUsers () {
  for(let i = 0; i < this.body.length; i++) {
    let e = this.body.email;
    //create body of text for each plant
      //for each plant give info on how many times to water it
    //sendMail(user, textbody)
  }
}