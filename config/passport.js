// Load the module dependencies
const passport = require('passport');
const mongoose = require('mongoose');

// Define the Passport configuration method
module.exports = function() {
	// Load the 'User' model
	const Student = mongoose.model('Student');
	
	// Use Passport's 'serializeUser' method to serialize the user id
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	// Use Passport's 'deserializeUser' method to load the user document
	passport.deserializeUser((id, done) => {
		Student.findById(id, (err, user) => {
			done(err, user);
		});
	});

	// Load Passport's strategies configuration files
	require('./strategies/local.js')();
};