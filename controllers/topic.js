var Topic = require('../models/topic');
var validator = require('validator');


var controller = {

    save: function(req, res) {

        var params = req.body;
        var topic = new Topic();

        try {

            validate_title = !validator.isEmpty(params.title);
            validate_content = !validator.isEmpty(params.content);
            validate_lang = !validator.isEmpty(params.lang);


        } catch (err) {
            return res.status(400).send({
                message: 'Faltan datos'
            });

        }

        if (validate_title && validate_content && validate_lang) {

            topic.title = params.title;
            topic.content = params.content;
            topic.lang = params.lang;
            topic.code = params.code;

            topic.save((error, topicStored) => {
                if (error || !topicStored) {
                    return res.status(200).send({
                        message: 'Error al guardar topic'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    topic: topicStored
                });
            });
        } else {
            return res.status(200).send({
                message: 'Datos incorrectos'
            });

        }

    }

};

module.exports = controller;