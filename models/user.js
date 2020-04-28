var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    image: String,
    role: String
});

//Para evitar que nos devuelva la contrase;a a la hora de hacer una peticion
userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model('User', userSchema);
//lowerCase y pluriralizar