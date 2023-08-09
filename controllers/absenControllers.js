const db = require('../models')
const user = db.User
const absen = db.Absen
const { Op } = require("sequelize")

module.exports = {
    clockIn: async (req, res) => {
        try {
            const UserId = req.user.id;
            console.log(req.user);
            const currentTime = new Date()
            const timeOffSet = 7 * 60 * 60 * 1000
            const timeInIndonesia = new Date(currentTime.getTime() + timeOffSet)
            const position = await user.findOne({
                where:{
                    id:UserId
                }
            })
            console.log(position);
            const check = await absen.findOne({
                where: {
                    UserId: UserId,
                    clock_in: {
                        [Op.and]: {
                            [Op.gte] : new Date(new Date().setHours(7, 0, 0, 0)),
                            [Op.lte] : new Date(new Date().setHours(30, 59, 59, 999))
                        }
                    }
                }
            });

            console.log(new Date(new Date().setHours(7, 0, 0, 0)));
            console.log(new Date(new Date().setHours(30, 59, 59, 999)) );
            console.log(timeInIndonesia);
    
            if (!check) {
                await absen.create({
                    clock_in: timeInIndonesia,
                    UserId: UserId,
                    date: currentTime,
                    RoleId : position.RoleId
                });
    
                res.status(200).send({
                    message: 'Absen masuk berhasil'
                });
            } else {
                throw {
                    message: 'Sudah absen masuk'
                };
            }
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    },
    clockOut : async (req, res) => {
        try {
            const UserId = req.user.id;
            const currentTime = new Date()
            const timeOffSet = 7 * 60 * 60 * 1000
            const timeInIndonesia = new Date(currentTime.getTime() + timeOffSet)
            const check = await absen.findOne({
                where: {
                    UserId: UserId,
                    clock_out: {
                        [Op.and]: {
                            [Op.gte] : new Date(new Date().setHours(7, 0, 0, 0)),
                            [Op.lte] : new Date(new Date().setHours(30, 59, 59, 999))
                        }
                    }
                }
            });

            console.log(new Date(new Date().setHours(7, 0, 0, 0)));
            console.log(new Date(new Date().setHours(30, 59, 59, 999)) );
            console.log(timeInIndonesia);
    
            if (!check) {
                await absen.update({
                    clock_out: timeInIndonesia,
                },
                {
                    where : {UserId : UserId}
                }
                );
    
                res.status(200).send({
                    message: 'Absen keluar berhasil'
                });
            } else {
                throw {
                    message: 'Sudah absen keluar'
                };
            }
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    },
    getClockInOut : async (req, res) => {
        try {
            const currentDate = new Date().toISOString().split('T')[0];
            const userId = req.user.id; 
            const condition = { date: currentDate, UserId: userId }; 
            console.log(currentDate);
            const result = await absen.findAll({
              attributes: ['clock_in', 'clock_out'],
              where: condition,
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
    clockInOutHistory : async (req, res) => {
        try {
            const currentDate = new Date().toISOString().split('T')[0];
            const userId = req.user.id; 
            const condition = {UserId: userId }; 
            console.log(currentDate);
            const result = await absen.findAll({
              attributes: ['date','clock_in', 'clock_out'],
              where: condition,
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
    adminClockInOutHistory : async (req, res) => {
        try {
            const result = await absen.findAll({
                include: [
                    {
                      model: user,
                      attributes:  ['fullName'] ,
                    },
                  ],
              attributes: ['date','clock_in', 'clock_out'],
            });
            res.status(200).send({
              result,
              status: true,
            });
          } catch (error) {
            console.log(error);
            res.status(400).send(error);
          }
      }
}