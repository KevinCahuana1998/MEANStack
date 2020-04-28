var express = require('express');
var TopicController = require('../controllers/topic');
var router = express.Router();

//Rutas topic
router.post('/topic', TopicController.save);

module.exports = router;