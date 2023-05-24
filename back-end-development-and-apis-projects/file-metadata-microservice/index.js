const express = require('express');
const fileupload = require("express-fileupload");
const cors = require('cors');
const bodyParser = require('body-parser');


require('dotenv').config()

var app = express();

app.use(cors());
app.use(fileupload());

app.use('/public', express.static(process.cwd() + '/public'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', function(req, res) {
  const { name ,size, mimetype } = req.files.upfile;
  res.status(200).json({ name, type: mimetype, size });
});


const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Your app is listening on port ' + port)
});
