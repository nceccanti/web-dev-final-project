const router = require('express').Router();
let User = require('../models/user.model');
const bcrypt = require('bcrypt');

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

router.route('/add').post((req, res) => {
  const username = req.body.username;
  const email = req.body.email
  const plants = req.body.plants

  const newUser = new User({
    username,
    email,
    plants
  });

  newUser.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json('User deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
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

      if(req.body.isSMS == null) {
        user.isSMS = user.isSMS;
      } else {
        user.isSMS = req.body.isSMS;
      }

      user.save()
        .then(() => res.json('User updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/addplant/:id').post((req, res) => {
  let now = new Date();
  User.findOneAndUpdate({
    _id: req.params.id,
  }, {
    $addToSet: {
      plants: [{
        "plantname": req.body.plants[0].plantname,
        "daystowater": req.body.plants[0].daystowater,
        "dateCreated": now,
        "planttype": req.body.plants[0].planttype,
      }]
    }
  })
    .then(user => {
      user.save()
        .then(() => res.json("Plant added!"))
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

router.route('/updateplant/:id').post((req, res) => {
  User.findOneAndUpdate({
    _id: req.params.id,
  }, {
    $pull: {
      plants: {
        "plantname": req.body.plants[0].oldplantname
      }
    }
  })
    .then(user => {
      user.save()
        .catch(err => res.status(400).json("Error :" + err));
    })
    .catch(err => res.status(400).json("Error: " + err));

    let now;
    if(req.body.plants[0].daystowater == req.body.olddaystowater) {
      now = req.body.plants[0].dateCreated;
    } else {
      now = new Date();
    }

    User.findOneAndUpdate({
      _id: req.params.id,
    }, {
      $addToSet: {
        plants: [{
          "plantname": req.body.plants[0].plantname,
          "daystowater": req.body.plants[0].daystowater,
          "dateCreated": now,
          "planttype": req.body.plants[0].planttype,
        }]
      }
    })
      .then(user => {
        user.save()
          .then(() => res.json("Plant edited!"))
          .catch(err => res.status(400).json("Error :" + err));
      })
      .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;