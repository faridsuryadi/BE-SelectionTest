const {body,validationResult} = require('express-validator')

module.exports = {
    cekSendEmail : async(req,res,next)=>{
        try {
            await body('email').notEmpty().isEmail().run(req)
            const validation = validationResult(req)
            if(validation.isEmpty()){
                next()
            }else{
                return res.status(400).send({
                    status : false,
                    message: "Failed to send email",
                    error: validation.array()
                })
            }
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    cekUpdateInformation : async(req,res,next)=>{
        try {
            await body('fullName').notEmpty().withMessage("Field can't be empty").run(req)
            await body('password').notEmpty().withMessage("Field can't be empty").isStrongPassword({
                minLength: 8,
                minUppercase:1,
                minNumbers:1,
                minSymbols:1
            }).withMessage("The password is at least 8 characters long and must contain 1 uppercase and lowercase letter and 1 symbol and number").run(req)
            await body("confirmPassword").notEmpty().equals(req.body.password).withMessage("Password not match").run(req)

            const validation = validationResult(req)
            if(validation.isEmpty()){
                next()
            }else{
                return res.status(400).send({
                    status : false,
                    message: "Failed to update information",
                    error: validation.array()
                })
            }
        } catch (error) {
            console.log(error);
        }
    },
    cekLogin : async(req,res,next)=>{
        try {
            
            await body('email').notEmpty().withMessage("Email can't be empty").isEmail().withMessage("Invalid email address").run(req)
            await body('password').notEmpty().withMessage("Password can't be empty").isStrongPassword({
                minLength: 8,
                minUppercase:1,
                minNumbers:1,
                minSymbols:1
            }).withMessage("The password is at least 8 characters long and must contain 1 uppercase and lowercase letter and 1 symbol and number").run(req)

            const validation = validationResult(req)
            if(validation.isEmpty()){
                next()
            }else{
                return res.status(400).send({
                    status : false,
                    message: "Login failed",
                    error: validation.array()
                })
            }
        } catch (error) {
            console.log(error);
        }
    },


}