const student = require('../controllers/student.server.controller');
const passport = require('passport');

// Define the routes module' method
module.exports = function (app) {
    // Mount the 'index' controller's 'render' method
    app.get('/', student.render);

    app.get('/signUp', student.renderSignUpPage);
    //app.get('/signUp', comment.deleteAll);

    app.post('/signUp', student.createStudent);

    app.get('/students', student.list)

    app.get('/login', student.renderLogin);

    //app.post('/login', student.openCommentPage);
    app.post('/login', student.authenticate2);

    app.get('/signout', student.signOut);
};
