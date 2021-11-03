const router = require('express').Router();
let Plant = require('../models/plant.model');

router.route('/').get((req, res) => {
  Plant.find()
    .then(plants => res.json(plants))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const username = req.body.username;
  const plantname = req.body.plantname;
  const watersperday = Number(req.body.watersperday);

  const newPlant = new Plant({
    username,
    plantname,
    watersperday,
  });

  newPlant.save()
  .then(() => res.json('Plant added!'))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Plant.findById(req.params.id)
    .then(plant => res.json(plant))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Plant.findByIdAndDelete(req.params.id)
    .then(() => res.json('Plant deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Plant.findById(req.params.id)
    .then(plant => {
      plant.username = req.body.username;
      plant.plantname = req.body.plantname;
      plant.watersperday = Number(req.body.watersperday);

      plant.save()
        .then(() => res.json('Plant updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;