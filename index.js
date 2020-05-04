var mongoose = require('mongoose');
var app = require('./app');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const DB_URI = process.env.DB_URI;
const PORT = process.env.PORT;

//Desabilitando un antiguo metodo que genera warning
mongoose.set('useFindAndModify', false);

mongoose.Promise = global.Promise;
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {

        console.log("La coneccion a Mongo DB es correcta");
        app.listen(PORT, () => {
            console.log("El servidor empezo a correr correctamente");
        });
    })
    .catch(err => console.log(err));