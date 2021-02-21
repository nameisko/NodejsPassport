const Student = require('mongoose').model('Student');
const Comment = require('mongoose').model('Comment');
const passport = require('passport');

exports.renderCommentForm = (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }

    return res.render('commentForm', {
        title: "Evaluation Form",
        fullName: req.user.firstName + " " + req.user.lastName,
        email: req.user.email
    });
}

exports.renderThankYou = (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }

    return res.render('thankyou', {
        title: "Thank You"
    });
}

exports.createComment = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/login');
    }

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
                return res.render('thankyou', {
                    email: email,
                    courseCode: courseCode,
                    title: "Thank You"
                })
            }
        });
    })

};

exports.renderComments = (req, res, next) => {

    if (!req.user) {
        return res.redirect('/login');
    }
    let email = req.user.email;
    let _id;

    Student.findOne({ email: email }, (err, student) => {
        if (err) return next(err);

    }).then(() => {
        Comment.find({ student: _id }, (err, comments) => {
            if (err) return next(err);
            //res.json(comments);
            return res.render('comments', {
                comments: comments,
                email: email,
                count: comments.length,
                title: "Comments"
            });
        });
    });
};

exports.deleteAll = (req, res) => {
    Student.collection.drop();
    Comment.collection.drop();
}