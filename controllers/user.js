var controller = {
    probando: function(req, res) {
        return res.status(200).send({
            message: "Metodo probando"
        });
    },

    testeando: function() {
        return res.status(200).send({
            message: "Metodo testeando"
        });
    }



};

module.exports = controller;