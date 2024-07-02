const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    fname: {
        type: String,
        require: true,
        trim: true,
    },
    lname: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    isEmailVerified: {
        type: Boolean,
        default : false
    },
    status: {
        type: String,
        default: "inactive",
        enum: ["active", "inactive"],
    }
})
const Userdb = mongoose.model('userdb', userSchema);

module.exports = Userdb;