import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import cookieParser from 'cookie-parser'
import postRoutes from './routes/post.route.js'

dotenv.config()

mongoose.connect(process.env.MONGODB)
        .then(() => {
            console.log('MongoDb is connected')
        })
        .catch((err) => {
            console.log(err)
        })

const app = express()


//allow json as input for backend
app.use(express.json())

//cookie parser
app.use(cookieParser())

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})

app.use('/api/user', userRoutes) 
app.use('/api/auth', authRoutes)
app.use('/api/post', postRoutes)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal server error'
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,  
    })
})