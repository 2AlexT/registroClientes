const AppError = require("../utils/appError");

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
    })
}

const handleJWTError = () => new AppError('Invalido token porfa intente logear',401);
const handleJWTErrorExpired = () => new AppError('Invalido token expirado',401);