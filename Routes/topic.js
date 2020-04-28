var express = require('express');
var TopicController = require('../controllers/topic');
var router = express.Router();
var md_auth = require('../middlewares/authenticated');

//Rutas topic
router.post('/topic', md_auth.authenticated, TopicController.save);
router.get('/topics/:page?', TopicController.getTopics);

module.exports = router;