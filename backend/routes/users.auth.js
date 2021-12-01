const express = require('express');
const jwt = require('jsonwebtoken');
const authorize = require("../middleware/auth")
const bcrypt = require('bcrypt');
const router = express.Router();
const userSchema = require("../models/user.model");

router.route('/login').post((req, res) => {
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
          console.log("Uncaught error at line 40 in users.auth.js");
            // return res.status(401).json({
            //   message: "Authorization failed",
            // })
      })
  })

  router.route('/signup').post((req, res) => {
      let now = new Date();
      let local = new Date(now.getFullYear(), now.getMonth(), now.getDay(), 9, 0, 0, 0)
      let defaultTime = local.getUTCHours();
      console.log(defaultTime)
      bcrypt.hash(req.body.password, 10).then((hash) => {
          const user = new userSchema({
              username: req.body.username,
              email: req.body.email,
              password: hash,
              notifyTime: defaultTime,
              phone: req.body.phone,
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