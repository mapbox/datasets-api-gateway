# datasets-api-gateway

An example server application for handling requests to the Mapbox Datasets API.

## Running

Required environment variables:

* `MapboxAccessToken`: an access token with datasets:read and datasets:write
  scopes.
* `MapboxDatasetID`: the ID of the wrapped dataset.

Optional variables for access control:

* `JWT_REQUIRED_FOR`: can be `read`, `read,write`, or nothing
* `JWT_SECRET`: see [express-jwt](https://github.com/auth0/express-jwt) for documentation.
* `JWT_AUDIENCE`: see [express-jwt](https://github.com/auth0/express-jwt) for documentation.
