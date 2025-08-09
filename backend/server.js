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
//       "https://isp-q3ei.vercel.app",
//       "https://isp-q3ei-ankitjha412s-projects.vercel.app"
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


import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/upload.js';
import adminRoutes from './routes/admin.js';

dotenv.config();
const app = express();

/* Trust proxy (needed for secure cookies behind HTTPS/CDN) */
app.set('trust proxy', 1);

/* CORS: allow local + your domains + any vercel.app preview */
const allowlist = new Set([
  'http://localhost:5173',
  'https://isp-q3ei.vercel.app',
  'https://isp-q3ei-ankitjha412s-projects.vercel.app',
]);

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true); // server-to-server or same-origin
    try {
      const u = new URL(origin);
      if (allowlist.has(origin) || u.hostname.endsWith('.vercel.app')) {
        return cb(null, true);
      }
      return cb(new Error('Not allowed by CORS'));
    } catch {
      return cb(new Error('Invalid Origin'));
    }
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['set-cookie'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle preflight

/* Body parsers */
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ extended: true, limit: '1000mb' }));

/* Health check (useful on Render) */
app.get('/health', (_req, res) => res.status(200).send('OK'));

/* Routes */
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

/* DB + server */
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => console.error(err));
