const userControllers = require('../controllers/userControllers')
const { verifyToken } = require('../middleware/auth')
const { cekUpdateInformation, cekSendEmail, cekLogin } = require('../middleware/validator')
const router = require('express').Router()

router.post('/',cekSendEmail,userControllers.sendEmail)
router.post('/employee',verifyToken,cekUpdateInformation,userControllers.updateInformation)
router.post('/login',cekLogin,userControllers.login)
router.get('/',verifyToken,userControllers.keepLogin)
router.get('/employee',userControllers.getEmployee)

module.exports = router