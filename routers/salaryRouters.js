const salaryControllers = require('../controllers/salaryControllers')
const { verifyToken } = require('../middleware/auth')
const router = require('express').Router()

router.get("/",salaryControllers.getRole)
router.get("/salary",verifyToken,salaryControllers.dailySalary)
router.get("/admin-salary",verifyToken,salaryControllers.adminDailySalary)
module.exports = router