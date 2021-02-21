const student = require('../controllers/student.server.controller');
const comment = require('../controllers/comment.server.controller');
// Define the routes module' method
module.exports = function (app) {
    // Mount the 'index' controller's 'render' method
    app.get('/', student.render);

    app.get('/signup', student.renderSignUpPage);
    //app.get('/signUp', comment.deleteAll);

    app.post('/signup', student.createStudent);

    app.get('/students', student.list)

    app.get('/login', student.renderLogin);

    app.post('/login', student.authenticate);

    app.get('/signout', student.signOut);
};
