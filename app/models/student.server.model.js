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
            'Password Should Be Longer'
        ]
    }
});

// Create the 'authenticate' instance method
StudentSchema.methods.authenticate = (password) => {
    return this.password === password;
};

StudentSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

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
/**
StudentSchema.methods.hashPassword = (password) => {
    return crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
}
 */
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