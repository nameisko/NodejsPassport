const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const StudentSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        index: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Email is invalid']
    },
    password: {
        type: String,
        validate: [
            (password) => password.length >= 6,
            'Password should be at least 6 characters'
        ]
    },
    studentNumber: {
        type: Number,
        min: 9
    },
    major: String
});

StudentSchema.virtual('fullName')
    .get(() => {
        return this.firstName + ' ' + this.lastName;
    })

StudentSchema.pre('save', function (next) {
    var student = this;

    if (!student.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(student.password, salt, function (err, hash) {
            if (err) return next(err);
            student.password = hash;
            next();
        });
    });
});

// Configure the 'UserSchema' to use getters and virtuals when transforming to JSON
StudentSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

StudentSchema.set('toObject', {
    getters: true,
    virtuals: true
});

// Create the 'User' model out of the 'UserSchema'
mongoose.model('Student', StudentSchema);