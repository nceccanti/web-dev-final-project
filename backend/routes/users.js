const router = require('express').Router();
let User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require("path");
const express = require('express');
const notify = require('../notify');



router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route("/:id").get((req, res) => {
  User.findById(req.params.id)
    .then(users => res.json(users))
    .catch(err => res.status(400).json("Error " + err));
});

// router.route('/add').post([
// ],(req, res) => {
//   const username = req.body.username;
//   const email = req.body.email
//   const plants = req.body.plants

//   const newUser = new User({
//     username,
//     email,
//     plants
//   });

//   newUser.save()
//     .then(() => res.json('User added!'))
//     .catch(err => res.status(400).json('Error: ' + err));
// });

router.route('/:id').delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json('User deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post([
  body('email').trim().isEmail().withMessage("Email must be a valid email.").normalizeEmail().toLowerCase(),
  body('username').trim().escape().isLength(3).withMessage("Username must have a minimum of 3 characters."),
  body('phone').trim().escape().custom((value, {req}) => {
    let val = /^[\+]?[0-9]{11,14}$/;
    if(value.length == 0) {
      return true;
    }
    if(!val.test(value)) {
      throw new Error("Phone number must include country code with +, no parentheses, no hypthens Ex: +11234567890")
    }
    return true;
  }),
  body('notifyTime').trim().escape(),
],(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    let msgs = "";
    errors.array().forEach(error => {
      msgs += error.msg + "  ";
    })
    res.json({message: msgs});
    return;
  }
  User.findById(req.params.id)
    .then(user => {
      if(req.body.username == null) {
        user.username = user.username;
      } else {
        user.username = req.body.username;
      }
      
      if(req.body.email == null) {
        user.email = user.email;
      } else {
        user.email = req.body.email;
      }
      
      if(req.body.plants == null) {
        user.plants = user.plants;
      } else {
        user.plants = req.body.plants
      }

      if(req.body.notifyTime == null) {
        user.notifyTime = user.notifyTime;
      } else {
        user.notifyTime = req.body.notifyTime;
      }

      if(req.body.phone == null) {
        user.phone = user.phone;
      } else {
        user.phone = req.body.phone;
      }

      if(req.body.isEmail == null) {
        user.isEmail = user.isEmail;
      } else {
        user.isEmail = req.body.isEmail;
      }

      user.save()
        .then(() => res.status(201).json({message: "Account updated"}))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/addplant/:id').post([
  body('plantname').trim().escape().isLength(2).withMessage("Plantname must have a minimum of 1 character."),
  body('daystowater').trim().escape().custom((value, {req}) => {
    let num = parseInt(value);
    if(Number.isNaN(num) || num < 1) {
      throw new Error("Invalid watering days")
    }
    return true;
  })
],(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    let msgs = "";
    errors.array().forEach(error => {
      msgs += error.msg + "  ";
    })
    res.json({message: msgs});
    return;
  }

  let now = new Date();
  User.findOneAndUpdate({
    _id: req.params.id,
  }, {
    $addToSet: {
      plants: [{
        "plantname": req.body.plantname,
        "daystowater": req.body.daystowater,
        "dateCreated": now,
        "planttype": req.body.planttype,
      }]
    }
  })
    .then(user => {
      user.save()
        .then(() => res.status(201).json({message: "Plant Added!"}))
        .catch(err => res.status(400).json("Error :" + err));
    })
    .catch(err => res.status(400).json("Error: " + err));
});

router.route('/removeplant/:id').post((req, res) => {
  User.findOneAndUpdate({
    _id: req.params.id,
  }, {
    $pull: {
      plants: {
        "plantname": req.body.plants[0].plantname
      }
    }
  })
    .then(user => {
      user.save()
        .then(() => res.json("Plant removed!"))
        .catch(err => res.status(400).json("Error :" + err));
    })
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/notify/:id").post((req, res) => {
  User.findById(req.params.id).then(res => {
    let subject = "HydroClock Notication Test"
    let bodyText = "Hello " + res.username + "!\n\n Your notifications are working correctly!\n\n Have a great day!\nSincerely,\nThe HydroClock Team" 
    let bodyHTML = "<h1>Hello " + res.username + "!<h1><br><p>Your notifications are working correctly!</p><br><p>Have a great day!</p><p>Sincerely,</p><p>The HydroClock Team</p>"
    if(res.isEmail && res.email.length > 0) {
      notify.sendMail(res.email, subject, bodyText, bodyHTML).then(result => console.log("Email sent to " + res.email + " successfully.")).catch(error => console.log(error.message));
    }
    if(res.isSMS  && res.phone.length > 0) {
      notify.sendSMS(res.phone, bodyText).then(result => console.log("Text message sent to " + res.phone + " successfully.")).catch(error => console.log(error.message));
    }
  }).catch(err => res.status(400).json("Error: " + err));
  if(res.status != 400) {
    res.json({message: "Notification sent!"})
  }
})

router.route('/updateplant/:id').post([
  body('plantname').trim().escape().isLength(2).withMessage("Plantname must have a minimum of 1 character."),
  body('daystowater').trim().escape().custom((value, {req}) => {
    let num = parseInt(value);
    if(Number.isNaN(num) || num < 1) {
      throw new Error("Invalid watering days")
    }
    return true;
  }),
],(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    let msgs = "";
    errors.array().forEach(error => {
      msgs += error.msg + "  ";
    })
    res.json({message: msgs});
    return;
  }
  User.findOneAndUpdate({
    _id: req.params.id,
  }, {
    $pull: {
      plants: {
        "plantname": req.body.oldplantname
      }
    }
  })
    .then(user => {
      user.save()
        .catch(err => res.status(400).json("Error :" + err));
    })
    .catch(err => res.status(400).json("Error: " + err));

    let now;
    if(req.body.daystowater == req.body.olddaystowater) {
      now = req.body.dateCreated;
    } else {
      now = new Date();
    }

    User.findOneAndUpdate({
      _id: req.params.id,
    }, {
      $addToSet: {
        plants: [{
          "plantname": req.body.plantname,
          "daystowater": req.body.daystowater,
          "dateCreated": now,
          "planttype": req.body.planttype,
        }]
      }
    })
      .then(user => {
        user.save()
          .then(() => res.status(201).json("Plant edited!"))
          .catch(err => res.status(400).json("Error :" + err));
      })
      .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;