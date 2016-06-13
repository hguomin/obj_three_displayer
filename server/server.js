'use strict';

const loopback = require('loopback');
const app = module.exports = loopback();
const bodyParser = require('body-parser');
const compression = require('compression');

// Setup the view engine (jade)
const path = require('path');
app.set('views', path.join(__dirname, '../client/views'));
app.set('view engine', 'jade');

// to support JSON-encoded bodies
app.middleware('parse', bodyParser.json());
// to support URL-encoded bodies
app.middleware('parse', bodyParser.urlencoded({
  extended: true
}));

// compress all requests
app.use(compression())

app.get('/', (req, res, next) => {
  res.render('pages/index', {
    heroku: process.env.HEROKU
  });
});

// -- Mount static files here--
// All static middleware should be registered at the end, as all requests
// passing the static middleware are hitting the file system
app.use(loopback.static(path.resolve(__dirname, '../client')));
app.use(loopback.favicon(path.resolve(__dirname, '../client/favicon/favicon-Cheshire-Cat-by-ichiibutt.ico')));

// Requests that get this far won't be handled
// by any middleware. Convert them into a 404 error
// that will be handled later down the chain.
app.use(loopback.urlNotFound());

// The ultimate error handler.
app.use(loopback.errorHandler());

app.start = function() {
  // start the web server
  return app.listen(process.env.PORT || 3000, () => {
    app.emit('started');
    console.log(`Web server listening at: ${app.get('url')}`);
  });
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}