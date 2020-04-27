var validator = require('validator');
var User = require('../models/user');
var bcrypt = require('bcrypt');
var jwt = require('../services/jwt');

var controller = {
    probando: function(req, res) {
        return res.status(200).send({
            message: "Metodo probando"
        });
    },

    testeando: function(req, res) {
        return res.status(200).send({
            message: "Metodo testeando"
        });
    },

    save: function(req, res) {
        //recoger los parametros de la peticion
        var params = req.body;
        //Validar los datos
        var validate_name = !validator.isEmpty(params.name);
        var validate_surname = !validator.isEmpty(params.surname);
        var validate_enail = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        var validate_password = !validator.isEmpty(params.password);

        if (validate_enail && validate_name && validate_password && validate_surname) {
            //Crear objeto de usuario
            var user = new User();
            //Asignar valores al usuario
            user.name = params.name;
            user.surname = params.surname;
            user.email = params.email.toLowerCase();
            user.image = null;
            user.role = 'ROLE_USER';

            //Comprobar si el usuario existe
            User.findOne({ email: user.email }, (error, userEncontrado) => {
                if (error) {
                    return res.status(200).send({
                        message: "Error al comprobar usuario"
                    });
                }
                //Si no existe cifrar la contrase;a
                if (!userEncontrado) {
                    bcrypt.hash(params.password, 10, (error, hash) => {

                        user.password = hash;

                        //guardar usuario
                        user.save((error, guardado) => {
                            if (error) {
                                return res.status(200).send({
                                    message: "Error al guardar usuario"
                                });
                            }

                            if (!guardado) {
                                return res.status(200).send({
                                    message: "El usuario no se ha guardado"
                                });
                            }
                            //Devolver respuesta
                            return res.status(200).send({
                                message: "Usuario guardado correctamente",
                                user: guardado
                            });

                        }); //close save

                    }); //close bcrypt

                } else {
                    return res.status(200).send({
                        message: "Usuario ya registrado"
                    });
                }
            });

        } else {
            return res.status(200).send({
                message: "Datos invalidos"
            });
        }
    },

    login: function(req, res) {
        //Recoger los parametros de la peticion
        params = req.body;
        //Validar los datos
        var validate_enail = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        var validate_password = !validator.isEmpty(params.password);

        if (validate_password && validate_enail) {
            //Buscar usuarios que coincidan con el email que nos llega
            User.findOne({ email: params.email.toLowerCase() }, (error, userEncontrado) => {
                //Si lo encuentra
                //Comprobar la contrase;a( coincidencia email y password)
                if (error) {
                    return res.status(500).send({
                        message: "Error al encontrar usuario"
                    });
                }

                if (!userEncontrado) {
                    return res.status(404).send({
                        message: "Correo no registrado"
                    });
                } else {
                    //Comprobar conse;a enviada con la que esta en Mongo
                    bcrypt.compare(params.password, userEncontrado.password, (error, ToF) => {
                        if (ToF) {
                            //Generar token
                            if (params.getToken) {
                                return res.status(200).send({
                                    token: jwt.createToken(userEncontrado)
                                });
                            } else {
                                //Antes de eviar los datos del usuario, eliminamos su password (no de la BD)
                                userEncontrado.password = undefined;
                                //enviar datos del usuario(userEncontrado)
                                return res.status(200).send({
                                    message: "Logueado correctamente",
                                    userEncontrado
                                });

                            }

                        } else {
                            return res.status(400).send({
                                message: "Constrase;a incorrecta"
                            });
                        }
                    });
                }


            });
        }







        //Si coinciden, 
        //Generar token y devolverlo


        //tambien devolveremos los datos

    }


};

module.exports = controller;