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
            topic.user = req.user.sub;

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
            return res.status(400).send({
                message: 'Datos incorrectos'
            });

        }

    },

    getTopics: function(req, res) {
        //Cargar la libreria de paginacion en la clase( modelo)

        //Recoger la pagina actual
        if (req.params.page == null || req.params.page == 0 || req.params.page == '0' || req.params.page == undefined || !req.params.page) {
            page = 1;
        } else {
            page = parseInt(req.params.page);
        }
        //Indicar las opciones de paginacion
        var options = {
            sort: { date: -1 },
            populate: 'user',
            limit: 5,
            page: page
        };

        Topic.paginate({}, options, (error, topics) => {
            if (error) {
                return res.status(400).send({
                    message: 'Error al paginar topics'
                });
            }

            if (!topics) {
                return res.status(400).send({
                    message: 'No se pudo paginar'
                });
            }

            return res.status(200).send({
                status: 'success',
                topics: topics.docs,
                totalTopics: topics.totalDocs,
                totalPages: topics.totalPages,
                page: page
            });
        });


    }



};

module.exports = controller;