const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [5, 'Password must be at least 6 characters long'],
        maxlength: [10, 'Password cannot exceed 10 characters'],
    },
    avatar:{
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 10);
})

let schema = mongoose.model('User', userSchema);

module.exports = schema;