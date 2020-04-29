//requires
var express = require('express');
var bodyParser = require('body-parser');

//Ejecutar express
var app = express();
//Cargar archivos de rutas
var user_routes = require('./Routes/user');
var topic_routes = require('./Routes/topic');
var comment_routes = require('./Routes/comment');

//Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//CORS

//Reescribir rutas
app.use('/api', user_routes);
app.use('/api', topic_routes);
app.use('/api', comment_routes);

//Exportar modulo
module.exports = app;