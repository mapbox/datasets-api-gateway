var MapboxClient = require('mapbox');

var request = require('supertest');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());

var MapboxClient = require('mapbox');
var client = new MapboxClient('sk.eyJ1IjoiZ3JhZmEiLCJhIjoiY2lyeTVtcXhxMDFzYjJva2pwZDg2cDMzbSJ9.4r8RuCe2Bv1tHSHbZwDUlQ');


app.get('/', function (req, res) {
  client.listFeatures('ciql88hm60004fpnhfytkz0v6', {}, function(err, collection) {
	  if (err) return res.status(500);
	  res.json(collection);
	});
});

app.post('/', function (req, res) {
	client.insertFeature(req.body, 'ciql88hm60004fpnhfytkz0v6', function(err, feature) {
	  if (err) return res.status(500);
	  res.json(feature);
	});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;