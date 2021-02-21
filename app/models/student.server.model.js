const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

// Define a new 'StudentSchema'
const StudentSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        // Set an email index
        index: true,
        unique: true,
        // Validate the email format
        match: [/.+\@.+\..+/, 'Email is invalid']
    },

    password: {
        type: String,
        // Validate the 'password' value length
        validate: [
            (password) => password.length >= 6,
            'Password should be at least 6 characters'
        ]
    }
});

StudentSchema.virtual('fullName')
  .get(function() {
    return this.firstName + ' ' + this.lastName;
  })

StudentSchema.pre('save', function (next) {
    var student = this;

    // only hash the password if it has been modified (or is new)
    if (!student.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(student.password, salt, function (err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
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