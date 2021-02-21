const { render } = require('./student.server.controller');

const Student = require('mongoose').model('Student');
const Comment = require('mongoose').model('Comment');

exports.renderCommentForm = (req, res) => {
    res.render('commentForm', {
        fullName: req.user.fullName,
        email: req.user.email
    });
}

exports.renderThankYou = (req, res) => {
    res.render('thankyou', {
        title: "Thank You"
    });
}

exports.createComment = (req, res, next) => {

    if (req.user) {
        let email = req.user.email;
        let courseCode = req.body.courseCode;

        Student.findOne({ email: email }, (err, student) => {
            if (err) { return getErrorMessage(err); }
            req.body.student = student._id;
        }).then(() => {
            const comment = new Comment(req.body);
            comment.save((err) => {
                if (err) {
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
    }
    else {
        redirect('/login');
    }
};

exports.deleteAll = (req, res) => {
    Student.collection.drop();
    Comment.collection.drop();
}

exports.renderComments = (req, res, next) => {

    if (req.user) {
        let email = req.user.email;
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
    }
    else {
        res.redirect('/login');
    }
};
