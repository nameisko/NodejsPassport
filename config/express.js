// Load the module dependencies
const config = require('./config');
const express = require('express');
const morgan = require('morgan');
const compress = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

// Define the Express configuration method
module.exports = function() {
	// Create a new Express application instance
	const app = express();

	app.use(flash());

	// Use the 'NDOE_ENV' variable to activate the 'morgan' logger or 'compress' middleware
	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
	} else if (process.env.NODE_ENV === 'production') {
		app.use(compress());
	}

	// Use the 'body-parser' and 'method-override' middleware functions
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
    app.use(methodOverride());
    //handle the use of PUT or DELETE methods
    //override with POST having ?_method=DELETE or
    // ?_method=PUT
    app.use(methodOverride('_method'));

	// Configure the 'session' middleware
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret
	}));

	// Set the application view engine and 'views' folder
	app.set('views', './app/views');
	app.set('view engine', 'ejs');

	app.use(passport.initialize());
	app.use(passport.session());

	// Configure static file serving
	app.use(express.static('./public'));
    app.use(express.static('./'));
	
	// Load the routing files
	require('../app/routes/student.server.routes.js')(app);
	require('../app/routes/comment.server.routes.js')(app);

	// Return the Express application instance
	return app;
};