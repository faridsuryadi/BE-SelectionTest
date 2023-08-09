const db = require('../models')
const user = db.User
const role = db.Role
const { Op } = require("sequelize")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const fs = require('fs')
const handlebars = require('handlebars')
const transporter = require('../middleware/mail')
const { error } = require('console')

module.exports = {
    sendEmail: async (req, res) => {
        try {
          const { email, RoleId } = req.body;
      
          const isEmailExist = await user.findOne({ where: { email } });
          if (isEmailExist) {
            return res.status(400).send({
              status: false,
              message: 'Email has already been used',
            });
          }
      
          const result = await user.create({ email, RoleId });
          const payload = { id: result.id };
          const token = jwt.sign(payload, process.env.KEY_TOKEN, { expiresIn: '1d' });
      
          const data = await fs.readFileSync('./regis.html', 'utf-8');
          const tempCompile = await handlebars.compile(data);
          const tempResult = tempCompile({ email, token });
      
          await transporter.sendMail({
            from: 'kuga@gmail.com',
            to: email,
            subject: 'Personal Information',
            html: tempResult,
          });
      
          res.status(200).send({
            status: true,
            message: 'Email has been sent, please check your email',
            result,
            token,
          });
        } catch (error) {
          console.log(error);
          res.status(400).send(error);
        }
      },
      
    updateInformation: async (req, res) => {
        try {
            const { fullName, password,birthDate, confirmPassword } = req.body

            const data = await user.findOne(
                { where: { id: req.user.id } })

            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)
            const result = await user.update({ fullName, birthDate,password: hashPassword },
                { where: { id: req.user.id } },
  
            )
            res.status(200).send({result})
        } catch (error) {
          console.log(error);
            res.status(400).send(error)
        }
    },
    login : async(req,res) => {
        try {
           const email = req.body.email
           const password = req.body.password
            const ceklogin = await user.findOne({
                where : {
                   email:email
                }
            }
        )
            if (!ceklogin) throw {message: "User not exist"}
            const isValid = await bcrypt.compare(password, ceklogin.password)
            if (!isValid) throw {message : "Wrong Password"}

            const payload = {id: ceklogin.id}
            const token = jwt.sign(payload, process.env.KEY_TOKEN, {expiresIn: '1d'})
        
        res.status(200).send({
                status : true,
                message : 'Login Succes',
                ceklogin,
                token
            }
        )
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    keepLogin : async(req,res) => {
        try {
            const result = await user.findOne({
                where: {
                    id : req.user.id
                }
            })
            res.status(200).send(result)
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    getEmployee: async (req,res) => {
        try {
          const page = +req.query.page || 1;
          const limit = +req.query.limit || 10;
          const search = req.query.search;
          const sort= req.query.sort || "ASC"
          const condition = {isAdmin:false}
          const offset = (page - 1) * limit
          const total = await user.count({where: condition})
          const result = await user.findAll({
            include: [{model: role,
            attributes:["role","salary"]}],
            attributes:{exclude: ["password"]} ,where: condition, limit, offset:offset, order : [["fullName", sort]]})
          res.status(200).send({
            totalpage: Math.ceil(total / limit),
            currentpage: page,
            total_slave: total,
            result,
            status: true,
          });
        } catch (error) {
          console.log(error);
          res.status(400).send(error);
        }
      },

}