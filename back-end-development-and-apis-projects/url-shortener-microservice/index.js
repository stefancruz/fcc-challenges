require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const Database = require("@replit/database");
const fileupload = require("express-fileupload");
const bodyParser = require('body-parser');
const dns = require('dns');
const url = require('url');

// Basic Configuration
const port = process.env.PORT || 3000;

const db = new Database();

app.use(cors());
app.use(fileupload());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {

  let newUrlValue = req.body.url;

  if (!newUrlValue) {
    return res.json({ error: 'invalid url' });
  }

  var q = url.parse(newUrlValue, true);

  dns.lookup(q.host, (err, address, family) => {

    if (err || !address) {
      return res.json({ error: 'invalid url' });
    }

    db.list().then(keys => {

      let id = keys.length ? keys.length : 1;

      db.set(id, newUrlValue).then(keys => {
        return res.json({ original_url: newUrlValue, short_url: id });
      })


    });

  })

});

app.get('/api/shorturl/:id', function(req, res) {

  db.get(req.params.id).then(value => {

    if (!value) {
      return res.status(404).send("Not found");
    }

    res.redirect(value);
  })

});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
