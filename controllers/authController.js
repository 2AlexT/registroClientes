const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { decode } = require('punycode');
const signToken = id=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken= (user,statusCode,res)=>{
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now()+ process.env.JWT_COOKIE_EXPIRES_IN *24*60*60*1000),
        httpOnly:true
    };
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt',token,cookieOptions);
    //remover el password del output
    user.password = undefined;
    res.status(statusCode).json({
        status:'success',
        token,
        data:{
            user
        }
    })
}

exports.signup = catchAsync(async(req,res,next)=>{
    //Para que no todso los usuarios sean admin ya que no se podra poner roles manualmente
    const newUser = await User.create({
        name: req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm
    });
    createSendToken(newUser,201,res);
});

exports.login = catchAsync(async(req,res,next)=>{
    const   {email, password} = req.body;

    //1)chequeando si existen 
    if(!email || !password){
       return next(new AppError('Porfa poner email y password',400));
    }
    //2)chequeando si el usuario existe y la constra es correcta
    const user  = await User.findOne({ email }).select('+password');

    if(!user || !(await user.correctPassword(password,user.password))){
        return next(new AppError('Incorrect Email or password',401));
    }

    //3) si todo esta correcto enviar el token
    const token = signToken(user._id);
    res.status(200).json({
        status:'succes',
        token
    })
});

//Para verifivar el token del usuario
//Siempre poner Bearer antes del token para usarlo
exports.protect = catchAsync(async(req,res,next)=>{
    //1 Chequear si el token esta presente en el header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return next(new AppError('No estas logeado',401)); 
    }
    //2 Verificar token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    //console.log(decoded)
    //3 Cuequear si el usuario existe;
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError('usuario con token no existe',401))
    }
    //4 chequear si cambio la contrasena
    if(currentUser.changedPasswordAfter(decode.iat)){
        return next(new AppError('Usuario recientemente cambio la contrasena, log again',401))
    };

    //Dar acceso a ruta protegida
    req.user= currentUser;
    next();
});

exports.restricTo = (...roles)=>{
    return (req,res,next)=>{
        //array role
        if(!roles.includes(req.user.role)){
            return next(new AppError('no tienes permision para realizar la accion',403))
        }
        next();
    }
}

