var MapboxClient = require('mapbox');
var express = require('express');
var bodyParser = require('body-parser');
var MapboxClient = require('mapbox');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());

var client = new MapboxClient(process.env.MapboxAccessToken);
if (!process.env.MapboxDatasetID) throw new Error('MapboxDatasetID environment variable required');

app.get('/features', function (req, res) {
  client.listFeatures(process.env.MapboxDatasetID, {}, function(err, collection) {

    if (err) return res.status(500);
    res.json(collection);

  });
});

app.get('/features/:featureID', function (req, res) {
  client.readFeature(req.param.featureID, process.env.MapboxDatasetID, function(err, collection) {

    if (err) return res.status(500);
    res.json(collection);

  });
});

app.delete('/features/:featureID', function (req, res) {
  client.deleteFeature(req.param.featureID, process.env.MapboxDatasetID, function(err, collection) {

    if (err) return res.status(500);
    res.json(collection);

  });
});

app.put('/features/:featureID', function (req, res) {
  client.insertFeature(req.body, process.env.MapboxDatasetID, function(err, collection) {

    if (err) return res.status(500);
    res.json(collection);

  });
});

app.listen(app.get('port'), function() {

  console.log('Node app is running on port', app.get('port'));

});

module.exports = app;
