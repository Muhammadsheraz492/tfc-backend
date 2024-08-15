import express from 'express'
import { createUser, getallUser, login, verifyUser } from '../controllers/userController.js'
import { sessionTestMiddleware } from '../middleware/sessionTestMiddleware.js'
import { SendEmailPdf } from '../controllers/test.js'
const router=express.Router()
router.post('/end-pdf',SendEmailPdf)
// router.post('/login',login)
// router.get('/verify/:token',verifyUser)
// router.get('/all',getallUser)
// router.put('/forget/:email',)
export default router