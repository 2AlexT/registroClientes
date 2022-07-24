const path  =require('path');
const express = require('express');
const { toUSVString } = require('util');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp')
const viewRouter = require('./routes/viewRoutes')

const abogadosRouter = require('./routes/registrarAbogadosRoutes');
const userRouter = require('./routes/usersRoute');

const app = express();
app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));
//1)Global middleware
//Static files
app.use(express.static(path.join(__dirname,'public')));




//Set Seguridad HTTP headers
app.use(helmet());

console.log(process.env.NODE_ENV);
//Development log in
if(process.env.NODE_ENV === 'development'){
app.use(morgan('dev'));
}
//Limit request de la mis API
const limiter = rateLimit({
    max: 100,
    windowMS:60*60*1000,
    message: 'Demasiados requeste del mismo IP Vuelva a intentarlo en una hora' 
});
app.use('/api',limiter);

//Body parser, leer datos del body into req.body
app.use(express.json({limit:'10kb'}));
//Data sanitization agains NoSql query injection
app.use(mongoSanitize());
//data sanatization against XSS
app.use(xss());
//Prevenir parameter pollution
app.use(hpp());


//Prueba de middleware
app.use((req,res,next)=>{
    req.requesTime = new Date().toISOString();
    next();
})




//2) Route hanlders


// app.get(`/api/v1/registrarAbogados`,getAllAbogados);

// app.get(`/api/v1/registrarAbogados/:id`,getAbogado);

// app.post(`/api/v1/registrarAbogados`,createAbogado)


// app.patch('/api/v1/registrarAbogados/:id',patchAbogados);

// app.delete('/api/v1/registrarAbogados/:id', deleteAbogados);

//3 route
app.get('/',(req,res)=>{
    res.status(200).render('base')
})
app.get('/login',(req,res)=>{
    res.status(200).render('login')
})

app.use('/api/v1/registrarAbogados',abogadosRouter);
app.use(`/api/v1/users`, userRouter);

//catching router handlers
app.all('*', (req,res,next)=>{
    next(new AppError(`Cant find ${req.originalUrl} url en el server`,404));
});

app.use(globalErrorHandler);

module.exports = app;

//4 Start server



