import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// 🔐 Utility to generate JWT token
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })

// ✅ Register a new user
export const registerUser = async (req, res) => {
  const { email, password, isAdmin } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false, // ✅ admin role from client
    })

    const token = generateToken(newUser._id)

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      },
    })
  } catch (err) {
    console.error('❌ Register Error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// ✅ Login existing user
export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const token = generateToken(user._id)

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    })
  } catch (err) {
    console.error('❌ Login Error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}
