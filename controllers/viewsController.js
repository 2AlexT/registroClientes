const Users = require('./../models/userModel')
const cathcAsync = require('../utils/catchAsync');

exports.getOverview=cathcAsync(async(req,res,next)=>{
    //1)datos user
    const User = await Users.find();
    res.status(200).render('base',{
        User: 'Dilan'
    })
    next();
});

exports.getLoginForm = (req,res)=>{
    res.status(200).render('login',{
        title:'Log into account'
    })
}