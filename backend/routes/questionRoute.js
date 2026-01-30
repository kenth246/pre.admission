const questionController = require('../controllers/questionController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

module.exports = function(app) {
    app.post('/api/questions', auth, adminOnly, questionController.addQuestion);
    app.post('/api/questions/bulk', auth, adminOnly, questionController.bulkUpload);
    app.get('/api/questions/category/:category', auth, adminOnly, questionController.getByCategory);
    app.put('/api/questions/:id', auth, adminOnly, questionController.updateQuestion);
    app.delete('/api/questions/:id', auth, adminOnly, questionController.deleteQuestion);
};