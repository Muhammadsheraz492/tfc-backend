import express from 'express'
import { createUser, getallUser, login, verifyUser } from '../controllers/userController.js'
import { sessionTestMiddleware } from '../middleware/sessionTestMiddleware.js'
import { SendEmailPdf } from '../controllers/test.js'
import multer from 'multer'
const router=express.Router()

const upload = multer({ dest: 'uploads/' });
router.post('/send',upload.single('pdf'),SendEmailPdf)
// router.post('/login',login)
// router.get('/verify/:token',verifyUser)
// router.get('/all',getallUser)
// router.put('/forget/:email',)
export default router