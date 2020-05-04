var validator = require('validator');
var User = require('../models/user');
var bcrypt = require('bcrypt');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

var controller = {
    probando: function(req, res) {
        return res.status(200).send({
            message: "Metodo probandos"
        });
    },

    testeando: function(req, res) {
        return res.status(200).send({
            message: "Metodo testeandos"
        });
    },

    save: function(req, res) {
        //recoger los parametros de la peticion
        var params = req.body;
        //Validar los datos
        try {
            validate_name = !validator.isEmpty(params.name);
            validate_surname = !validator.isEmpty(params.surname);
            validate_enail = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            validate_password = !validator.isEmpty(params.password);
        } catch (err) {
            return res.status(400).send({
                message: "Faltan datos"
            });
        }

        if (validate_enail && validate_name && validate_password && validate_surname) {
            //Crear objeto de usuario
            var user = new User();
            //Asignar valores al usuario
            user.name = params.name;
            user.surname = params.surname;
            user.email = params.email.toLowerCase();
            user.image = 'gg1auxMpO1N42xDemYgsUfu8.jpg';
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
        try {
            validate_enail = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            validate_password = !validator.isEmpty(params.password);
        } catch (err) {
            return res.status(400).send({
                message: "Faltan datos"
            });
        }

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
                    //Comprobar contrase;a enviada con la que esta en Mongo
                    bcrypt.compare(params.password, userEncontrado.password, (error, ToF) => {
                        if (ToF) {
                            //Generar token
                            //Si lo solicita (getToken)
                            if (params.getToken) {
                                return res.status(200).send({
                                    token: jwt.createToken(userEncontrado)
                                });
                            } else {
                                //Antes de eviar los datos del usuario, eliminamos su password (no de la BD)
                                //aunque ya no es necesario por la configuracion en models/user
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
    },

    //Actualiza un usuario ya identificado, para usar el update envia un token
    //pasa por los middleware para verificar token y actuliza con los datos del req.body enviados por el usuario

    update: function(req, res) {
        // 0. Crear un middleware para verificar el jwt token, ponerselo a la ruta

        //Recoger los datos a actualizar
        var params = req.body;

        //Validar datos
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_enail = !validator.isEmpty(params.email) && validator.isEmail(params.email);

        } catch (err) {
            return res.status(400).send({
                message: "Faltan datos"
            });
        }


        //Eliminar datos innecesarios
        delete params.password;

        //Comprobar si el email es unico
        if (req.user.email != params.email) {
            User.findOne({ email: params.email.toLowerCase() }, (error, user) => {

                if (error) {
                    return res.status(500).send({
                        message: "Error al comprobar duplicidad del correo"
                    });
                }

                if (user && user.email == params.email) {
                    return res.status(400).send({
                        message: 'Correo ya existente, no puede modificarse'
                    });
                } else {
                    var userID = req.user.sub;
                    //Buscar y actualizar documento
                    User.findOneAndUpdate({ _id: userID }, params, { new: true }, (error, userUpdated) => {

                        if (error || !userUpdated) {
                            //Devolver respuesta
                            return res.status(200).send({
                                status: 'success',
                                message: 'Error al actualizar datos'
                            });
                        }

                        //Devolver respuesta
                        return res.status(200).send({
                            status: 'success',
                            user: userUpdated
                        });
                    });
                }


            });

        } else {
            var userID = req.user.sub;
            //Buscar y actualizar documento
            User.findOneAndUpdate({ _id: userID }, params, { new: true }, (error, userUpdated) => {

                if (error || !userUpdated) {
                    //Devolver respuesta
                    return res.status(200).send({
                        status: 'success',
                        message: 'Error al actualizar datos'
                    });
                }

                //Devolver respuesta
                return res.status(200).send({
                    status: 'success',
                    user: userUpdated
                });
            });
        }




    },

    //Sube una imagen, guarda el path(ruta) de la imagen (req.files.file0,path) en la BD
    //y la imagen en una carpeta uploads

    uploadAvatar: function(req, res) {
        //Configurar el modulo multiparty (router/user)

        var file = 'Archivo no enviado';
        //Recoger el fichero de la peticion
        if (!req.files) {
            return res.status(404).send({
                message: file
            });
        }

        //Conseguir el nombre y extension del archivo
        var file_path = req.files.file0.path;

        var path_split = file_path.split('\\');
        var file_name = path_split[2];

        var ex_split = file_name.split('\.');
        var file_ext = ex_split[1];

        //Comprobar extension( solo images), si no es valida borrar fichero

        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {

            fs.unlink(file_path, (err) => {
                return res.status(404).send({
                    message: 'Extension de archivo no valida'
                });
            });


        } else {
            //Sacar el id del usuario identificado
            var userId = req.user.sub;
            //Buscar y actualizar documentos
            User.findByIdAndUpdate({ _id: userId }, { image: file_name }, { new: true }, (error, userUpdate) => {
                //Devolver respuesta
                if (error || !userUpdate) {
                    return res.status(200).send({
                        message: 'Error al guardar al usuario'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    message: 'Avatar guardado correctamente',
                    userUpdate

                });
            });
        }


    },

    //Envias el nombre de la imagen por la url (get) y te devuelve la imagen

    avatar: function(req, res) {
        var fileName = req.params.fileName;
        var avatarPath = './uploads/users/' + fileName;

        fs.exists(avatarPath, (ToF) => {
            if (ToF) {
                return res.sendFile(path.resolve(avatarPath));
            } else {
                return res.status(404).send({
                    message: 'La imagen no existe'
                });
            }
        });
    },

    getUsers: function(req, res) {

        User.find().exec((error, users) => {
            if (error || !users) {
                return res.status(404).send({
                    message: 'No hay usuarios para mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                users
            });
        });
    },

    getUser: function(req, res) {

        var userId = req.params.id;

        User.findById(userId).exec((error, user) => {
            if (error || !user) {
                return res.status(404).send({
                    message: 'Usuario no existe'
                });
            }

            return res.status(200).send({
                status: 'success',
                user
            });
        });
    }



};

module.exports = controller;