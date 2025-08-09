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

/** ---- CORS (dynamic allowlist + preflight) ---- */
const explicitAllow = new Set([
  'http://localhost:5173',
  'https://isp-q3ei.vercel.app',
  'https://isp-q3ei-ankitjha412s-projects.vercel.app',
]);

function isAllowedOrigin(origin) {
  if (!origin) return true; // allow server-to-server / curl / same-origin
  try {
    const u = new URL(origin);
    if (explicitAllow.has(origin)) return true;
    // allow any https vercel preview of your project
    if (u.protocol === 'https:' && u.hostname.endsWith('.vercel.app')) return true;
    return false;
  } catch {
    return false;
  }
}

const corsOptions = {
  origin(origin, cb) {
    if (isAllowedOrigin(origin)) cb(null, true);
    else cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  exposedHeaders: ['set-cookie'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // <-- handle preflight

// If you set cookies (login sessions) behind a proxy/CDN:
app.set('trust proxy', 1);

// Large JSON bodies
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ extended: true, limit: '1000mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log('Server running on 5000'));
  })
  .catch(err => console.error(err));
