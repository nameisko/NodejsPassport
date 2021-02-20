const comment = require('../controllers/comment.server.controller');

// Define the routes module' method
module.exports = function(app) {
	// Mount the 'index' controller's 'render' method
    app.get('/commentForm', comment.renderCommentForm);

    app.post('/commentForm', comment.createComment);

    app.get('/comments', comment.renderComments);

    app.get('/thankyou', comment.renderThankYou);
};
