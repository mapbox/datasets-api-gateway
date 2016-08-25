/*
 * Check environment variables and fail early if they're missing.
 */
var requiredEnv = ['MapboxAccessToken', 'MapboxDatasetID'];
if (process.env.JWT_REQUIRED_FOR) {
  requiredEnv.push('JWT_SECRET', 'JWT_AUDIENCE');
}
requiredEnv.forEach(function (envVar) {
  if (!process.env[envVar]) throw new Error(envVar + ' environment variable required');
});


/*
 * Import dependencies
 */
var MapboxClient = require('mapbox');
var express = require('express');
var bodyParser = require('body-parser');
var MapboxClient = require('mapbox');
var jwt = require('express-jwt');

var app = express();
var client = new MapboxClient(process.env.MapboxAccessToken);

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());

/*
 * Configure permissions. By default, completely open but if the JWT_REQUIRED_FOR
 * variable and JWT details are given, read and potentially write can require
 * a token.
 */
var authenticateRead = authenticateWrite = function(err, req, res, next) {
  next();
};

if (process.env.JWT_REQUIRED_FOR) {

  var valid = { read: true, write: true };

  var requiresAuth = process.env.JWT_REQUIRED_FOR.split(',').reduce(function (memo, type) {
    if (!valid[type]) throw new Error('Unexpected authentication requirement ' + type);
    memo[type] = true;
    return memo;
  }, {});

  var authenticateWrite = jwt({
    secret: new Buffer(process.env.JWT_SECRET, 'base64'),
    audience: process.env.JWT_AUDIENCE
  });

  if (requiresAuth.read) {
    authenticateRead = authenticateWrite;
  }
}

/*
 * Configure routes for modifying features
 */

app.get('/features', authenticateRead, function (req, res) {

  client.listFeatures(process.env.MapboxDatasetID, {}, function(err, collection) {

    if (err) return res.status(500);
    res.json(collection);

  });
});

app.get('/features/:featureID', authenticateRead, function (req, res) {
  client.readFeature(req.param.featureID, process.env.MapboxDatasetID, function(err, collection) {

    if (err) return res.status(500);
    res.json(collection);

  });
});

app.delete('/features/:featureID', authenticateWrite, function (req, res) {
  client.deleteFeature(req.param.featureID, process.env.MapboxDatasetID, function(err, collection) {

    if (err) return res.status(500);
    res.json(collection);

  });
});

app.put('/features/:featureID', authenticateWrite, function (req, res) {
  client.insertFeature(req.body, process.env.MapboxDatasetID, function(err, collection) {

    if (err) return res.status(500);
    res.json(collection);

  });
});

app.get('/', function (req, res) {

  res.send('Hello world');

});

app.listen(app.get('port'), function() {

  console.log('Node app is running on port', app.get('port'));

});

module.exports = app;
