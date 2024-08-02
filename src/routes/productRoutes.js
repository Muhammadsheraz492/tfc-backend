import express from 'express'
import { addProduct, changeStatus, getProduct, getallProduct } from '../controllers/productController.js'
const router=express.Router()
router.get('/',getProduct)
router.post('/',addProduct)
router.put('/:productId/:status',changeStatus)
router.get('/:userId/',getallProduct)
export default router