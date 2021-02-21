// Load the module dependencies
const passport = require('passport');
const mongoose = require('mongoose');

// Define the Passport configuration method
module.exports = function () {
	// Load the 'User' model
	const Student = mongoose.model('Student');

	passport.serializeUser(function(user, done) {
		done(null, user._id);
		// if you use Model.id as your idAttribute maybe you'd want
		// done(null, user.id);
	});
	
	passport.deserializeUser(function(id, done) {
	  Student.findById(id, function(err, user) {
		done(err, user);
	  });
	});

	// Load Passport's strategies configuration files
	require('./strategies/local.js')();
};