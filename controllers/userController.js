const express= require('express');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = catchAsync(async(req,res,next)=>{
    const users = await User.find();
    res.status(200).json({
        status:'success',
        message:users.length,
        data:{
            users
        }

    });
});
exports.getUser = (req,res)=>{
    res.status(500).json({
        status:'error',
        message:'Routa aun no completada'
    });
};
exports.createUser = (req,res)=>{
    res.status(500).json({
        status:'error',
        message:'Routa aun no completada'
    });
};
exports.updateUser = (req,res)=>{
    res.status(500).json({
        status:'error',
        message:'Routa aun no completada'
    });
};
exports.deleteUser = (req,res)=>{
    res.status(500).json({
        status:'error',
        message:'Routa aun no completada'
    });
};

exports.getMe = (req,res,next)=>{
    req.params.id=req.user.id;
    next();
}