//requires
var express = require('express');
var bodyParser = require('body-parser');

//Ejecutar express
var app = express();
//Cargar archivos de rutas
var use_routes = require('./Routes/user');

//Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//CORS

//Reescribir rutas
app.use('/api', use_routes);

//Exportar modulo
module.exports = app;