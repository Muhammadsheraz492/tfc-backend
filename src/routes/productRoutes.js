import express from 'express'
import { addProduct, changeStatus, getProduct, getallProduct } from '../controllers/productController.js'
const router=express.Router()
router.get('/:page',getProduct)
router.post('/:userId',addProduct)
router.put('/:productId/:status',changeStatus)
router.get('/user/:userId/',getallProduct)
export default router