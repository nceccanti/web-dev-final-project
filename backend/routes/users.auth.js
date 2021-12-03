const express = require('express');
const jwt = require('jsonwebtoken');
const authorize = require("../middleware/auth")
const bcrypt = require('bcrypt');
const router = express.Router();
const userSchema = require("../models/user.model");
const { body, validationResult } = require('express-validator');
const app = express();


router.route('/login').post([
  body('email').trim().isEmail().withMessage("Email must be a valid email.").normalizeEmail().toLowerCase(),
  body('password').trim().isLength(8).withMessage("Password length needs to be a minimum of 8 characters."),
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

    let getUser;
    userSchema.findOne({
      email: req.body.email,
    }).then(user => {
      if(!user) {
        return res.status(401).json({
          message: "Authorization failed"
        });
      }
      getUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
      .then(response => {
        if(!response) {
          return res.status(401).json({
            message: "Authorization failed"
          });
        }
        let jwtToken = jwt.sign({
          email: getUser.email,
          userId: getUser._id
        }, "longer-secret-is-better", {
          expiresIn: "1h"
        });
        res.status(200).json({
          token: jwtToken,
          expiresIn: 3600,
          msg: getUser
        })
        })
        .catch(err => {
          console.log("Uncaught errorusers.auth.js");
      })
  })

  router.route('/signup').post([
    body('username').trim().escape().isLength(3).withMessage("Username must have a minimum of 3 characters."),
    body('email').trim().isEmail().withMessage("Email must be a valid email.").normalizeEmail().toLowerCase(),
    body('password').trim().isLength(8).withMessage("Password length needs to be a minimum of 8 characters."),
  ],(req, res) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        let msgs = "";
        errors.array().forEach(error => {
          msgs += error.msg + "  ";
        })
        console.log(msgs);
        res.json({message: msgs})
        return;
      }

      let now = new Date();
      let local = new Date(now.getFullYear(), now.getMonth(), now.getDay(), 9, 0, 0, 0)
      let defaultTime = local.getUTCHours();
      bcrypt.hash(req.body.password, 10).then((hash) => {
          const user = new userSchema({
              username: req.body.username,
              email: req.body.email,
              password: hash,
              notifyTime: defaultTime,
              phone: "",
              isEmail: true,
              isSMS: false,
          });
          user.save().then((response) => {
              res.status(201).json({
                  message: 'User created',
                  result: response
              })
              })
              .catch((error) => {
                res.status(500).json({
                    error
                });
          })
      })
  })

  router.route('/all-user').get(authorize, (req, res) => {
      userSchema.find((error, response) => {
          if(error) {
              return next(error)
          }
          res.status(200).json(response)
      })
  })

  module.exports = router;