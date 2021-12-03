const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");
const { google  } = require("googleapis");
const schedule = require("node-schedule");
const axios = require("axios");
const multer = require('multer');
const path = require("path");
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

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const usersRouter = require('./routes/users');
const { Component } = require('react');
const { callbackPromise } = require('nodemailer/lib/shared');
const { response } = require('express');

app.use('/users', usersRouter);

const userAuth = require("./routes/users.auth");
app.use('/api/auth', userAuth);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

function timeDifference(current, added) {
  const currentUTC = Date.UTC(current.getFullYear(), current.getMonth(), current.getDate());
  const addedUTC = Date.UTC(added.getFullYear(), added.getMonth(), added.getDate());
  let day = 1000*60*60*24;
  return (addedUTC - currentUTC)/day;
}

//testing purposes only
function isWaterDay(id, name) {
  let now = new Date();
  const URL = "http://localhost:5005/users/" + id
  axios.get(URL).then(res => {
    for(let i = 0; i < res.data.plants.length; i++) {
      if(res.data.plants[i].plantname == name) {
        return timeDifference(now, new Date(res.data.plants[i].dateCreated));
      }
    }
  })
  return -1;
}

schedule.scheduleJob("* * * * *", () => {
  let now = "" + new Date().getUTCHours() + ":" + new Date().getUTCMinutes();
  console.log(now);
  axios.get("http://localhost:5005/users/").then(res => {
    for(let i = 0; i < res.data.length; i++) {
      if(res.data[i].notifyTime == now && res.data[i].plants.length > 0 && (res.data[i].isEmail || res.data[i].isSMS)) {
        notifyUser(res.data[i]._id);
      }
    }
  })
})

async function sendMail(client, subjectBody, textBody, htmlBody) {
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

async function sendSMS(userNumber, bodyText) {
  client.messages
    .create({
      to: userNumber,
      from: HYDROCLOCK_PHONE,
      body: bodyText
    })
  .then(message => console.log(message.sid));
}

function notifyUser(id) {
  let now = new Date();
  let url = "http://localhost:5005/users/" + id
  axios.get(url).then(res => {
      let plantText = "";
      let plantHTML = "";
      for(let j = 0; j < res.data.plants.length; j++) {
        let diff = timeDifference(now, new Date(res.data.plants[j].dateCreated));
        if(diff % res.data.plants[j].daystowater == 0) {
          plantText += "\n" + res.data.plants[j].plantname + " needs be watered today.\n";
          plantHTML += "<li>" + res.data.plants[j].plantname + " needs be watered today.</li>";
        }
      }
      if(plantText.length == 0) {
        return;
      }
      bodyText = "Hello " + res.data.username + "!\nThis is your daily reminder water your plants!  Here is your watering details for each plant:\n" + plantText + "\nHave a great day!\nSincerely,\nThe HydroClock Team";
      bodyHTML = "<h1>Hello " + res.data.username + "!</h1><h2>This is your daily reminder water your plants!</h2><h3>Here is your watering details for each plant:<h3><ul>" + plantHTML + "</ul><br><p>Have a great day!</p><p>Sincerely,</p><p>The HydroClock Team</p>";
      subject = res.data.username + ": plant watering reminder.";
      if(res.data.isEmail) {
        sendMail(res.data.email, subject, bodyText, bodyHTML).then(result => console.log("Email sent to " + res.data.email + " successfully.")).catch(error => console.log(error.message));
        //console.log(bodyText);
      }
      console.log(res.data.phone.length)
      if(res.data.isSMS && res.data.phone.length != 0) {
        sendSMS(res.data.phone, bodyText).then(result => console.log("Text message sent to " + res.data.phone + " successfully.")).catch(error => console.log(error.message));
        //console.log("send SMS")
      }
  });
}
