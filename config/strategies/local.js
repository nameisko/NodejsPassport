// Load the module dependencies
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Student = require('mongoose').model('Student');
const bcrypt = require('bcrypt');

// Create the Local strategy configuration method
module.exports = () => {
	// Use the Passport's Local strategy
	passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {
		// Use the 'User' model 'findOne' method to find a user with the current username
		Student.findOne({
			email: email
		}, (err, student) => {
			// If an error occurs continue to the next middleware
			if (err) {
				return done(err);
			}

			// If a user was not found, continue to the next middleware with an error message
			if (!student) {
				return done(null, false, {
					message: 'Unknown email'
				});
			}

			if (student) {
				bcrypt.compare(password, student.password, (err, isMatch) => {
					//if error than throw error
					if (err) {
						return done(err);
					}
					//if both match than you can do anything
					if (!isMatch) {
						return done(null, false, { message: "Invalid email or password" });
					}
					else {
						return done(null, student);
					}
				})
			}
			// Otherwise, continue to the next middleware with the user object
			//return done(null, student);
		});
	}));
};