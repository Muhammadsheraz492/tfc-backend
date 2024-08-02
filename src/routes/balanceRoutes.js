import express from 'express'
import { addBalance, getBalance } from '../controllers/balanceController.js'
const router=express.Router()
router.post('/:userId/:balance',addBalance)
router.get('/:userId',getBalance)
export default router
