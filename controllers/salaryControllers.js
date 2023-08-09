const db = require('../models')
const role = db.Role
const user = db.User
const absen = db.Absen
module.exports = {
    getRole: async (req, res) => {
        try {
            const result = await role.findAll({
            });
            res.status(200).send({
                result,
                status: true,
            });
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    },
    dailySalary: async (req,res) => {
        try {
            const userId = req.user.id; 
            const condition = {UserId: userId }; 
            const result = await absen.findAll({
                include: [{model: role,
                    attributes:["role","salary"]}],
              attributes: ['date','clock_in', 'clock_out',"dailySalary"],
              where: condition,
            });        
            console.log(result);
            const processedResults = result.map(item => {
                const clockIn = item.clock_in;
                const clockOut = item.clock_out;
    
                if (clockIn === null && clockOut === null) {
                    item.dailySalary = 0;
                } else if (clockIn !== null && clockOut === null) {
                    item.dailySalary = item.Role.salary / 2;
                } if (clockIn !== null && clockOut !== null) {
                    item.dailySalary = item.Role.salary;
                } 
    
                return item;
            });
            res.status(200).send(processedResults)
        } 
            catch (error) {
            
            console.log(error);
            res.status(400).send(error);
        }
    },
    adminDailySalary: async (req,res) => {
        try {
            const userId = req.user.id;  
            const result = await absen.findAll({
                include: [
                    {
                      model: role,
                      attributes: ["role", "salary"],
                    },
                    {
                      model: user,
                      attributes: ["fullName"],
                    },
                  ],
                    attributes: ['date','clock_in', 'clock_out',"dailySalary"],
            });        
            const processedResults = result.map(item => {
                const clockIn = item.clock_in;
                const clockOut = item.clock_out;
    
                if (clockIn === null && clockOut === null) {
                    item.dailySalary = 0;
                } else if (clockIn !== null && clockOut === null) {
                    item.dailySalary = item.Role.salary / 2;
                } if (clockIn !== null && clockOut !== null) {
                    item.dailySalary = item.Role.salary;
                } 
    
                return item;
            });
            res.status(200).send(processedResults)
        } 
            catch (error) {
            
            console.log(error);
            res.status(400).send(error);
        }
    }
}