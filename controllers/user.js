var validator = require('validator');
var User = require('../models/user');
var bcrypt = require('bcrypt');

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
            user.email = params.email;
            user.image = null;
            user.role = 'ROLE_USER';

            //Comprobar si el usuario existe
            User.findOne({ email: user.email }, (error, encontrado) => {
                if (error) {
                    return res.status(200).send({
                        message: "Error al comprobar usuario"
                    });
                }

                //Si no existe cifrar la contrase;a

                if (!encontrado) {

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

    }


};

module.exports = controller;