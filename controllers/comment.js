var Topic = require('../models/topic');
var validator = require('validator');

var controller = {

    add: function(req, res) {

        var topicId = req.params.topicId;

        Topic.findById(topicId).exec((error, topic) => {

            if (error) {
                return res.status(400).send({
                    message: 'Error a buscar topic'
                });
            }

            if (!topic) {
                return res.status(400).send({
                    message: 'No se encontro topic'
                });
            }

            if (req.body.content && req.body.content.trim() != '') {

                var comment = {
                    content: req.body.content,
                    user: req.user.sub
                };
                topic.comments.push(comment);
                topic.save((error) => {
                    if (error) {
                        return res.status(200).send({
                            message: 'Error al guardar comentario'
                        });
                    }
                    return res.status(200).send({
                        message: 'success',
                        topic
                    });
                });

            } else {
                return res.status(400).send({
                    message: 'Usted no ha comentado nada'
                });
            }

        });


    },

    update: function(req, res) {

        var commentId = req.params.commentId;

        var params = req.body;

        try {
            validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(200).send({
                message: 'No ha escrito nada'
            });
        }

        if (validate_content) {

            Topic.findOneAndUpdate({
                    "comments._id": commentId
                }, {
                    "$set": {
                        "comments.$.content": params.content
                    }
                }, { new: true },
                (error, commentUpdated) => {

                    if (error) {
                        return res.status(400).send({
                            message: 'Error al buscar comentario'
                        });
                    }

                    if (!commentUpdated) {
                        return res.status(400).send({
                            message: 'No se encontro comentario'
                        });
                    }

                    return res.status(200).send({
                        message: 'success',
                        topic: commentUpdated
                    });

                }
            );

        } else {
            return res.status(200).send({
                message: 'Envie content'
            });
        }


    },

    delete: function(req, res) {

        var topicId = req.params.topicId;
        var commentId = req.params.commentId;

        Topic.findById(topicId, (error, topic) => {

            if (error) {
                return res.status(400).send({
                    message: 'Error al buscar topic'
                });
            }

            if (!topic) {
                return res.status(400).send({
                    message: 'No se pudo eliminar'
                });
            }

            //Selecionar el subdocumento (comentario)
            var comment = topic.comments.id(commentId);

            if (comment) {

                comment.remove();

                topic.save((error) => {

                    if (error) {
                        return res.status(400).send({
                            message: 'Error al guardar cambios'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        topic
                    });
                });

            } else {
                return res.status(200).send({
                    message: 'Comentario no existe'
                });
            }



        });


    }
};

module.exports = controller;