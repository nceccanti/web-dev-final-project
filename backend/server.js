const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");
const { google  } = require("googleapis");
const schedule = require("node-schedule");
const axios = require("axios");

const CLIENT_ID = "125774351731-ol5bf0rutel127u6vva0p4mum1fi6r8i.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04Xfqvkh7JkLMCgYIARAAGAQSNwF-L9IrOZhOSTidFSbLiTFYDnX-61OPfusNWR5MGHlgDs4Vmu9F6QUWYwAtuBagfdh4Wlj-hNo";
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

const usersRouter = require('./routes/users');
const { Component } = require('react');
const { callbackPromise } = require('nodemailer/lib/shared');
const { response } = require('express');

app.use('/users', usersRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

schedule.scheduleJob("0 9 * * *", () => {
  notifyAllUsers();
})

notifyAllUsers();

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

function notifyAllUsers() {
  var users = [];
  axios.get("http://localhost:5000/users").then(res => {
    if(res.data.length > 0) {
     for(let i = 0; i < res.data.length; i++) {
      let plantText = "";
      let plantHTML = "";
      for(let j = 0; j < res.data[i].plants.length; j++) {
        plantText += res.data[i].plants[j].plantname + " needs be watered " + res.data[i].plants[j].watersperday + " times per day.\n";
        plantHTML += "<li>" + res.data[i].plants[j].plantname + " needs be watered " + res.data[i].plants[j].watersperday + " times per day.</li>";
      }
      bodyText = "Hello " + res.data[i].username + "!\nThis is your daily reminder water your plants!  Here is your watering details for each plant:\n" + plantText + "\nHave a great day!\nSincerely,\nThe HydroClock Team";
      bodyHTML = "<h1>Hello " + res.data[i].username + "!</h1><h2>This is your daily reminder water your plants!</h2><h3>Here is your watering details for each plant:<h3><ul>" + plantHTML + "</ul><br><p>Have a great day!</p><p>Sincerely,</p><p>The HydroClock Team</p>";
      subject = res.data[i].username + ": plant watering reminder.";
      sendMail(res.data[i].email, subject, bodyText, bodyHTML).then(result => console.log("Email sent to " + res.data[i].email + " successfully.")).catch(error => console.log(error.essage));
     }
    }
  });
}