var express = require('express');
var TopicController = require('../controllers/topic');
var router = express.Router();
var md_auth = require('../middlewares/authenticated');

//Rutas topic
router.post('/topic', md_auth.authenticated, TopicController.save);
router.get('/topics/:page?', TopicController.getTopics);
router.get('/user-topics/:userId', TopicController.getTopicsByUser);
router.get('/topic/:topicId', TopicController.getTopic);
router.put('/topic/:topicId', md_auth.authenticated, TopicController.update);

module.exports = router;