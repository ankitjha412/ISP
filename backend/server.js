// import express from 'express'
// import mongoose from 'mongoose'
// import dotenv from 'dotenv'

// import authRoutes from './routes/auth.js'
// import uploadRoutes from './routes/upload.js'
// import adminRoutes from './routes/admin.js'
// import cors from 'cors'

// dotenv.config()
// const app = express()

// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://isp-ytqe-git-main-ankitjha412s-projects.vercel.app",
//     ],
//     credentials: true,
//   })
// );
// // ✅ Only this for large JSON bodies
// app.use(express.json({ limit: '1000mb' }))
// app.use(express.urlencoded({ extended: true, limit: '1000mb' }))

// app.use('/api/auth', authRoutes)
// app.use('/api/upload', uploadRoutes)
// app.use('/api/admin', adminRoutes)

// mongoose.connect(process.env.MONGO_URI).then(() => {
//   app.listen(5000, () => console.log('Server running on 5000'))
// }).catch(err => console.error(err))


import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

import authRoutes from './routes/auth.js'
import uploadRoutes from './routes/upload.js'
import adminRoutes from './routes/admin.js'

dotenv.config()
const app = express()

// --- CORS (top, before routes) ---
const defaultAllowed = [
  'http://localhost:5173',
]

// Allow comma-separated origins from ENV (Render dashboard)
const envAllowed =
  (process.env.CLIENT_ORIGINS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

const allowed = new Set([...defaultAllowed, ...envAllowed])

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true) // Postman/cURL
    if (allowed.has(origin)) return cb(null, true)
    return cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
// Ensure preflight handled for all routes
app.options('*', cors(corsOptions))

// --- Parsers ---
app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({ extended: true, limit: '25mb' }))

// --- Routes ---
app.use('/api/auth', authRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/admin', adminRoutes)

// --- Start (Render needs PORT + 0.0.0.0) ---
const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => console.log(`Server on ${PORT}`))

// --- DB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Mongo connected'))
  .catch(err => console.error('Mongo error', err))
