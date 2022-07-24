//En caso de cargar con el archivo JSON los datos
const fs=require('fs');
const mongoose= require('mongoose');
const dotenv= require('dotenv');
const ClientesAbogados = require('./../../models/clientesModel')

dotenv.config({path:'./config.env'});


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
    .connect(DB,{
    useNewUrlParser:true,
    useCreateIndex: true,
    useFindAndModify:false
}).then(() =>{
    console.log('DB connection succesful');
})

//Leer archivo JSON
const clientes =JSON.parse( fs.readFileSync(`${__dirname}tours-simple.json`, 'utf-8'));

//importa datos a la base de datos
const importData = async()=>{
    try{
        await ClientesAbogados.create(clientes);
        console.log('Data succesfuly loaded!');
        process.exit();
    }catch(err){
        console.log(err)
    }
}

// Borrar los datos de la collection
const deleteData = async()=>{
    try{
        await ClientesAbogados.deleteMany();
        console.log('Data succesfuly deleted!');
        process.exit();
    }catch(err){
        console.log(err)
    } 
}

if (process.argv[2] === '--import'){
    importData();
}else if(process.argv[2]=== '--delete'){
    deleteData();
};