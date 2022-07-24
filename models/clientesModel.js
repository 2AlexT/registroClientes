const mongoose = require('mongoose');
const validator=require('validator');

const registroAbogadosSchema = new mongoose.Schema({
    name: {
        type : String,
        required: [true, 'Tiene que escribir su nombre'],
        unique: true,
        trim:true,
        maxlength:[100,'Numero pasa cantidad de valore permitido'],
        minlength:[10,'Nombre tiene que tener mas de 10 caracteres']
    },
    nroRegistro: {
        type: Number,
        required:[true, 'Es obligatorio el Nro'],
        unique:true,
        min:[999999, 'Numero incorrecto'],
        max:[10000000,'Numero incorrecto']
    },
    archivo: {
        type: String
    }
});


const ClientesAbogados = mongoose.model('ClientesAbogados', registroAbogadosSchema);

module.exports = ClientesAbogados;