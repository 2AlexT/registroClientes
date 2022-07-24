const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'porfa poner nombre'],
    },
    email:{
        type:String,
        required:[true,'please poner email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail,'Poner un email']
    },
    password:{
        type:String,
        required: [true,'Contra necesaria'],
        minlength: 8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'Please confirmar el password'],
        validate:{
            validator: function(el){
                return el === this.password;
            },
            message:'Contra no son iguales'
        }
    },
    role:{
        type: String,
        enum:['user', 'admin'],
        default:'user'
    },
    passwordChangedAt: Date,
    users:{
        type: mongoose.Schema.ObjectId,
        ref:'_id'
    }
    });

userSchema.pre('save',async function(next){
    //funciona solo si password es modificada
    if(!this.isModified('password')) return next();
    //hashing contrasena
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm =undefined;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() /1000,10);
        console.log(changedTimeStamp,JWTTimestamp);
        return JWTTimestamp  < changedTimeStamp;
    }
    //Significa que no cambio
    return false;
};

const User = mongoose.model('User',userSchema);
module.exports=User;
