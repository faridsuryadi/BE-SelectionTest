const express = require('express')
const PORT = 8000
const app = express()
app.use(express.json())
const db = require('./models')
const {absenRouters,salaryRouters,userRouters} = require('./routers')
require('dotenv').config()
const cors = require('cors')


app.get("/", (req,res)=>{
    res.status(200).send("Hi there, this is Express.js API")
})
app.use(cors())
app.use(express.static('./public'))
app.use('/api/absen', absenRouters)
app.use('/api/users', userRouters)
app.use('/api/salaries',salaryRouters)


app.listen(PORT, ()=>{
    // db.sequelize.sync({alter:true})
    console.log(`app started on PORT ${PORT}`);
})
