const absenControllers = require('../controllers/absenControllers')
const { verifyToken } = require('../middleware/auth')
const router = require('express').Router()

router.post('/clockin',verifyToken, absenControllers.clockIn)
router.post('/clockout',verifyToken, absenControllers.clockOut)
router.get('/',verifyToken, absenControllers.getClockInOut)
router.get('/history',verifyToken, absenControllers.clockInOutHistory)
router.get('/admin-history',verifyToken, absenControllers.adminClockInOutHistory)

module.exports = router