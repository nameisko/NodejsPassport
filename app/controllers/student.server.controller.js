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
	// If the session's 'lastVisit' property is set, print it out in the console 
	if (req.session.lastVisit) {
		console.log(req.session.lastVisit);
	}

	// Set the session's 'lastVisit' property
	req.session.lastVisit = new Date();

	// Use the 'response' object to render the 'index' view with a 'title' property
	res.render('index', {
		title: 'Home'
	});
};

exports.signOut = (req, res) => {
	req.logout();
	res.redirect('/');
}

exports.renderSignUpPage = (req, res) => {
	let message = req.flash('error');

	res.render('signUp', {
		title: 'Sign Up',
		errorMessages: message
	});
};

exports.renderLogin = (req, res) => {
	if(!req.user){
		res.render('login', {
			title: "Login",
			messages: req.flash('error') || req.flash('info')
		});
	}
	else{
		res.render('commentForm', {
			fullName: req.user.fullName,
			email: req.user.email
		})
	}
}

exports.createStudent = (req, res, next) => {

	if (!req.student) {
		const student = new Student(req.body);

		student.save((err) => {
			if (err) {
				const message = getErrorMessage(err);
				req.flash('error', message);
				return res.redirect('/signUp');
			}
			res.redirect('/login');
		})
	}
	else{
		res.redirect('/');
	}
}

// exports.createStudent = (req, res, next) => {
// 	req.session.destroy();
// 	try {
// 		const student = new Student(req.body);
// 		student.save((err) => {
// 			if (err) {
// 				return next(err);
// 			} else {
// 				//res.json(student);
// 				res.redirect('/login');
// 			}
// 		});
// 	} catch {
// 		res.redirect('/signUp');
// 	}
// };

exports.authenticate2 = function(req, res, next) {
	passport.authenticate('local', {
		successRedirect: '/commentForm',
		failureRedirect: '/login',
		failureFlash: true // allow flash messages
	})(req, res, next);
};

exports.authenticate = (req, res) => {
	var email = req.body.email;
	var password = req.body.password;
	let fullName;

	Student.findOne({ email: email }, (err, student) => {
		if (err) {
			return done(err);
		}
		if (!student) {
			return res.redirect('/login');
			
		}
		req.id = student._id;
		fullName = student.fullName;
		student.comparePassword(password, (err, isMatch) => {
			if (err) return;
			if (isMatch) {
				session.email = email;
				session.fullName = fullName;
				if (session.pageVisited == 'comments') {
					session.pageVisited = '';
					res.redirect('/comments');
					return;
				}
				res.render('commentForm', {
					email: email,
					fullName: fullName,
					title: "Evaluation Form"
				})
			}
			else {
				res.redirect('/login');
			}
		});
	});
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