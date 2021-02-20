const Student = require('mongoose').model('Student');
const Comment = require('mongoose').model('Comment');

exports.renderCommentForm = (req, res) => {
    var session = req.session;
    var _id = session.id;
    var email = session.email;
    let fullName = session.fullName;
    session.id = _id;
    if (email) {

        res.render('commentForm', {
            fullName: fullName,
            email: email,
            title: "Evaluation Form"
        })
    }
    else {
        res.redirect('/');
    }
}

exports.renderThankYou = (req, res) => {
    res.render('thankyou', {
        title: "Thank You"
    });
}

exports.createComment = (req, res, next) => {

    var session = req.session;
    let email = session.email;
    let courseCode = req.body.courseCode;

    // Create a new instance of the 'User' Mongoose model
    //cc, cn, prog, sem, comm, date, student
    Student.findOne({ email: email }, (err, student) => {
        if (err) { return getErrorMessage(err); }
        //
        //req.id = student._id;
        req.body.student = student._id;
    }).then(() => {
        const comment = new Comment(req.body);
        // Use the 'User' instance's 'save' method to save a new user document
        comment.save((err) => {
            if (err) {
                // Call the next middleware with an error message
                return next(err);
            } else {
                res.render('thankyou', {
                    email: email,
                    courseCode: courseCode,
                    title: "Thank You"
                })
            }
        });
    })
};

exports.deleteAll = (req, res) => {
    Student.collection.drop();
    Comment.collection.drop();
}

exports.renderComments = (req, res, next) => {
    var email = req.session.email;
    let _id;

    //find the student then its comments using Promise mechanism of Mongoose
    Student.findOne({ email: email }, (err, student) => {
        if (err) return;
        try {
            _id = student._id;
        }
        catch (e) {
            req.session.pageVisited = 'comments';
            res.redirect('/login');
            return;
        }
    }).then(() => {
        Comment.find({ student: _id }, (err, comments) => {
            if (err) {
                res.redirect('/login');
                return;
            }
            //res.json(comments);
            res.render('comments', {
                comments: comments,
                email: email,
                count: comments.length,
                title: "Comments"
            });
        });
    });
};
