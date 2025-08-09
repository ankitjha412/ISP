import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.js'
import uploadRoutes from './routes/upload.js'
import adminRoutes from './routes/admin.js'
import cors from 'cors'

dotenv.config()
const app = express()

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://isp-q3ei.vercel.app",
      
    ],
    credentials: true,
  })
);
// ✅ Only this for large JSON bodies
app.use(express.json({ limit: '1000mb' }))
app.use(express.urlencoded({ extended: true, limit: '1000mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/admin', adminRoutes)

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(5000, () => console.log('Server running on 5000'))
}).catch(err => console.error(err))


