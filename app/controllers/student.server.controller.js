const Student = require('mongoose').model('Student');

exports.render = function(req, res) {
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

exports.renderSignUpPage = (req, res) => {
	res.render('signUp', {
		title: 'Sign Up'
	});
};

exports.renderLogin = (req, res) => {
	var session = req.session;
	if (session.email) {
		res.redirect('/commentForm');
		return;
	}
	res.render('login', {
		title: "Login"
	});
}

exports.createStudent = (req, res, next) => {
	req.session.destroy();
	try {
		const student = new Student(req.body);
		student.save((err) => {
			if (err) {
				return next(err);
			} else {
				//res.json(student);
				res.redirect('/login');
			}
		});
	} catch {
		res.redirect('/signUp');
	}
};

exports.authenticate = (req, res) => {
	var session = req.session;
	var email = req.body.email;
	var password = req.body.password;
	var _id;
	let fullName;

	Student.findOne({ email: email }, (err, student) => {
		if (err) {
			//return getErrorMessage(err); 
		}
		if(!student){
			res.redirect('/login');
			return;
		}
		_id = student._id;
		req.id = student._id;
		fullName = student.fullName;
		student.comparePassword(password, (err, isMatch) => {
			if (err) return;
			if(isMatch){
				session.email = email;
				session.fullName = fullName;
				if(session.pageVisited == 'comments'){
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
			else{
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