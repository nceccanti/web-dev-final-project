const router = require('express').Router();
let User = require('../models/user.model');

router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
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

      user.save()
        .then(() => res.json('User updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/addplant/:id').post((req, res) => {
  User.findOneAndUpdate({
    _id: req.params.id,
  }, {
    $addToSet: {
      plants: [{
        "plantname": req.body.plants[0].plantname,
        "watersperday": req.body.plants[0].watersperday
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

module.exports = router;