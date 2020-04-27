const clave = 'clave-secreta';
var jwt = require('jwt-simple');
var moment = require('moment');

//Obs: Si entra en un return, se quedara ahi y no entrara al next() y no entrara al metodo

exports.authenticated = function(req, res, next) {
    //Comprobar si enviar el token
    if (!req.headers.authorization) {
        return res.status(403).send({
            message: 'La peticion no ha enviado cabecera de autorizacion'
        });
    }

    //Limpiar token y quitar comillas
    var token = req.headers.authorization.replace(/['"]+/g, '');

    //como es sensible a errores, lo ponemos en try cath

    try {
        //Decodificar token
        payload = jwt.decode(token, clave);

        //ver si ha expirado
        if (payload.exp <= moment().unix()) {
            return res.status(404).send({
                message: 'El token ha expirado'
            });
        }

    } catch (err) {
        return res.status(404).send({
            message: 'El token no es valido'
        });
    }

    //Adjuntar usuario identificado a request
    req.user = payload;

    next();
};