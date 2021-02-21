process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// Load the module dependencies
const configMongoose = require('./config/mongoose');
const configExpress = require('./config/express');
const configPassport = require('./config/passport');

const db = configMongoose();
const app = configExpress();
const passport = configPassport();

// Use the Express application instance to listen to the '3000' port
app.listen(3000);
// Use the module.exports property to expose our Express application instance for external usage
module.exports = app; //returns the application object
// Log the server status to the console
console.log('Server running at http://localhost:3000/');