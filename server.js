const mongoose= require('mongoose');
const dotenv= require('dotenv');

process.on('uncaughtException',err=>{
    console.log('Unhandle Rejection~!');
    console.log(err);
   process.exit(1);
});


dotenv.config({path:'./config.env'});
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);



mongoose
    .connect(DB,{
    useNewUrlParser:true,
    useCreateIndex: true,
    useFindAndModify:false
}).then(() =>{
    console.log('DB connection succesful');
}).catch(err=>console.log('ERROR'));



//console.log(process.env);

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>{
    console.log(`App running on port ${port}`);
});

//unhandle rejections
process.on('unhandledRejection',err=>{
    console.log('Unhandle Rejection~!');
    console.log(err);
    server.close(()=>{
    process.exit(1);
    });
});
//unhandle rejectiosn async
