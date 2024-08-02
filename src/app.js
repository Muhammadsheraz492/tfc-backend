import express from 'express'
import connectDB from './config/dbConfig.js'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import balanceRoutes from './routes/balanceRoutes.js'
import descriptionRoutes from './routes/descriptionRoutes.js'
import cors from 'cors'
import morgan from 'morgan'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { sessionTestMiddleware } from './middleware/sessionTestMiddleware.js'
const app =express()
connectDB()
app.use(session({
    secret: process.env.JWT_SECRET,  
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), 
    cookie: { secure: false }  
}));
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use("/api/users",userRoutes)
// app.use('/api/products',[sessionTestMiddleware],productRoutes);
// app.use('/api/balance',[sessionTestMiddleware],balanceRoutes);
// app.use('/api/des',[sessionTestMiddleware],descriptionRoutes);
app.use('/api/products',productRoutes);
app.use('/api/balance',balanceRoutes);
app.use('/api/des',descriptionRoutes);

export default app