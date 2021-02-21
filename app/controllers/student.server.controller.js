const Student = require('mongoose').model('Student');
const passport = require('passport');

const getErrorMessage = (err) => {
	let message = '';

	if (err.code) {
		switch (err.code) {
			case 11001:
			case 11000:
				message = 'User already exist';
				break;
			default:
				message = 'Unknown error';
		}
	}
	else {
		for (const errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}
	return message;
}

exports.render = function (req, res) {
	res.render('index', {
		title: 'Home'
	});
};

exports.signOut = (req, res) => {
	req.logout();
	res.redirect('/');
}

exports.renderSignUpPage = (req, res) => {
	let message = req.flash('signupError');

	res.render('signup', {
		title: 'Sign Up',
		errorMessages: message
	});
};

exports.renderLogin = (req, res) => {
	if (req.user) {
		return res.redirect('/commentForm');
	}

	return res.render('login', {
		title: "Login",
		messages: req.flash('error')
	});
}

exports.createStudent = (req, res, next) => {
	const student = new Student(req.body);
	student.save((err) => {
		if (err) {
			let message = getErrorMessage(err);
			req.flash('signupError', message);
			return res.redirect('/signup');
		}
		req.login(student, (err) => {
			if(err) return next(err);
			return res.redirect('/commentForm');
		})
	});
}

exports.authenticate = function (req, res, next) {
	passport.authenticate('local', {
		successRedirect: '/commentForm',
		failureRedirect: '/login',
		failureFlash: true // allow flash messages
	})(req, res, next);
}

// 'list' controller method to display all students in raw json format
exports.list = (req, res, next) => {
	// Use the 'Student' static 'find' method to retrieve the list of students
	Student.find({}, (err, students) => {
		if (err) {
			// Call the next middleware with an error message
			return next(err);
		} else {
			// Use the 'response' object to send a JSON response
			//res.json(students);
			res.render('students', {
				students: students,
				title: "Student List"
			})
		}
	});
};