var Topic = require('../models/topic');
var validator = require('validator');


var controller = {

    //Guarda un nuevo topics, envias los datos del topic
    //por el body
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
    //Por la url le enviamos la pagina, y este metodo nos devuelve un array de topics
    // de esa pagina, aca los topics se paginan y se nos envia un array de 5 topics
    //segun la pagina que enviemos
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
            //devolver resultado ( topics, total topics, paginas)
            return res.status(200).send({
                status: 'success',
                topics: topics.docs,
                totalTopics: topics.totalDocs,
                totalPages: topics.totalPages
            });
        });
    },
    //Envias el id del usuario por url y te envia todas los topics
    //asociados a ese id de usuario
    getTopicsByUser: function(req, res) {
        userId = req.params.userId;
        Topic.find({
                user: userId
            })
            .sort([
                ['date', 'descending']
            ])
            .exec((error, topics) => {
                if (error) {
                    return res.status(200).send({
                        message: 'Error para traer topics'
                    });
                }
                if (!topics) {
                    return res.status(200).send({
                        message: 'No hay topics en BD'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    topics
                });
            });
    },
    getTopic: function(req, res) {
        var topicId = req.params.topicId;
        Topic.find({ _id: topicId }).populate('user').exec((err, topic) => {
            if (err) {
                return res.status(400).send({
                    message: 'Error al traer topic'
                });
            }
            if (!topic) {
                return res.status(400).send({
                    message: 'Topic no existe'
                });
            }

            return res.status(200).send({
                status: 'success',
                topic
            });

        });
    },

    update: function(req, res) {

        var topicId = req.params.topicId;
        var params = req.body;

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

            var updated = {
                title: params.title,
                content: params.content,
                lang: params.lang,
                code: params.code
            };

            userId = req.user.sub;

            Topic.findOneAndUpdate({
                _id: topicId,
                user: userId
            }, updated, { new: true }, (err, update) => {

                if (err) {
                    return res.status(400).send({
                        message: 'Error al actualizar'
                    });
                }

                if (!update) {
                    return res.status(400).send({
                        message: 'No se ha podido actualizar'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    topic: update
                });
            });

        }

    },

    delete: function(req, res) {

        var topicId = req.params.topicId;

        Topic.findOneAndDelete({ _id: topicId, user: req.user.sub }, (err, topicDeleted) => {
            if (err) {
                return res.status(200).send({
                    message: 'Error al eliminar'
                });
            }

            if (!topicDeleted) {
                return res.status(200).send({
                    message: 'No se pudo borrar al usuario'
                });
            }

            return res.status(200).send({
                status: 'success',
                topicDeleted
            });
        });
    }

};

module.exports = controller;