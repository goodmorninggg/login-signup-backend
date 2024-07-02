const express = require("express");
const route = express.Router()
const controller = require('../controller/controller')
const { checkuserauth } = require("../middlewares/auth-middleware");

route.use('/getverificationlink' , checkuserauth)




route.post('/signup', controller.register)
route.get('/verifyemail/:id/:token', controller.confirmemail)
route.post('/login' , controller.login)
route.post('/getverificationlink/' , controller.getVerificationLink)

module.exports = route