const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config({ path: 'sample.env' });
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(cors())
app.use(express.static('public'))


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let UserModel = require('./models/User');
let ActivityModel = require('./models/Activity');


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req, res) => {

  if (!req.body.username) {
    return res.status(400);
  }

  let user = new UserModel({
    username: req.body.username
  });

  user
    .save()
    .then(({ username, _id }) => {
      res.send({ username, _id })
    })
    .catch((err) => {
      res.status(400).send(err)
    });
});


app.post('/api/users/:_id/exercises', async (req, res) => {

  const _id = req.params._id;

  if (!_id) {
    return res.status(400);
  }

  const { username } = await UserModel.where({ _id }).findOne();
  const date = req.body.date ? new Date(req.body.date) : new Date();

  let activity = new ActivityModel({
    description: req.body.description,
    duration: parseInt(req.body.duration),
    date,
    UserId: _id
  });

  activity
    .save()
    .then(({ description, duration, date }) => {
      res.send({ username, description, duration, date: date.toDateString(), _id })
    })
    .catch((err) => {
      res.status(400).send(err)
    });

});


app.get('/api/users', async (req, res) => {

  var log = await UserModel
    .find()
    .select({ __v: 0 })
    .lean()
    .exec();

  res.status(200).json(log);

})

app.get('/api/users/:_id/logs', async (req, res) => {

  var _id = req.params._id;

  if (!_id) {
    return res.status(400);
  }

  const { from, to, limit } = req.query;

  const query = {
    $and: [
      { 'UserId': new mongoose.Types.ObjectId(_id) }
    ]
  };

  if (from) {
    query.$and.push({ date: { $gte: from } })
  }

  if (to) {
    query.$and.push({ date: { $lte: to } })
  }

  const log = await ActivityModel.find(query, { _id: 0, UserId: 0, __v: 0 })
    .limit(limit)
    .exec();

  const { username } = await UserModel.where({ _id }).findOne();

  res.status(200).json({
    username,
    count: log.length,
    _id,
    log
  });


});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
