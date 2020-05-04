var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.port || 3999;

//Desabilitando un antiguo metodo que genera warning
mongoose.set('useFindAndModify', false);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://cahuana:shinigami123x00@cluster0-rjljq.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {

        console.log("La coneccion a Mongo DB es correcta");
        app.listen(port, () => {
            console.log("El servidor empezo a correr correctamente");
        });
    })
    .catch(err => console.log(err));