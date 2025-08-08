// import React, { createContext, useContext, useEffect, useState } from 'react'

// const AuthContext = createContext()

// export const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState({
//     token: null,
//     isAdmin: false,
//     isAuthenticated: false,
//   })

//   // ✅ Load from localStorage on app load
//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     const isAdmin = localStorage.getItem('isAdmin') === 'true'

//     if (token) {
//       setAuth({ token, isAdmin, isAuthenticated: true })
//     }
//   }, [])

//   // ✅ On login
//   const login = ({ token, isAdmin }) => {
//     localStorage.setItem('token', token)
//     localStorage.setItem('isAdmin', isAdmin.toString()) // Ensure it's saved as string
//     setAuth({ token, isAdmin, isAuthenticated: true })
//   }

//   // ✅ On logout
//   const logout = () => {
//     localStorage.removeItem('token')
//     localStorage.removeItem('isAdmin')
//     setAuth({ token: null, isAdmin: false, isAuthenticated: false })
//   }

//   return (
//     <AuthContext.Provider value={{ ...auth, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => useContext(AuthContext)

// import React, { createContext, useContext, useEffect, useState } from 'react'

// const AuthContext = createContext()

// export const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState({
//     token: null,
//     isAdmin: false,
//     isAuthenticated: false,
//   })
//   const [loading, setLoading] = useState(true) // Add loading

//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     const isAdmin = localStorage.getItem('isAdmin') === 'true'

//     if (token) {
//       setAuth({ token, isAdmin, isAuthenticated: true })
//     }

//     setLoading(false) // ✅ Set loading to false after reading localStorage
//   }, [])

//   const login = ({ token, isAdmin }) => {
//     localStorage.setItem('token', token)
//     localStorage.setItem('isAdmin', isAdmin.toString())
//     setAuth({ token, isAdmin, isAuthenticated: true })
//   }

//   const logout = () => {
//     localStorage.removeItem('token')
//     localStorage.removeItem('isAdmin')
//     setAuth({ token: null, isAdmin: false, isAuthenticated: false })
//   }

//   return (
//     <AuthContext.Provider value={{ ...auth, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }
// export const useAuth = () => useContext(AuthContext)



// import React, { createContext, useContext, useEffect, useState } from 'react'

// const AuthContext = createContext()

// export const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState({
//     token: null,
//     isAdmin: false,
//     isAuthenticated: false,
//     userId: null,
//   })
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     const isAdmin = localStorage.getItem('isAdmin') === 'true'
//     const userId = localStorage.getItem('userId')

//     if (token && userId) {
//       setAuth({ token, isAdmin, isAuthenticated: true, userId })
//     }

//     setLoading(false)
//   }, [])

//   const login = ({ token, isAdmin, userId }) => {
//     localStorage.setItem('token', token)
//     localStorage.setItem('isAdmin', isAdmin.toString())
//     localStorage.setItem('userId', userId)
//     setAuth({ token, isAdmin, isAuthenticated: true, userId })
//   }

//   const logout = () => {
//     localStorage.removeItem('token')
//     localStorage.removeItem('isAdmin')
//     localStorage.removeItem('userId')
//     setAuth({ token: null, isAdmin: false, isAuthenticated: false, userId: null })
//   }

//   return (
//     <AuthContext.Provider value={{ ...auth, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => useContext(AuthContext)




import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/axiosInstances'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    isAdmin: false,
    isAuthenticated: false,
    userId: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const isAdmin = localStorage.getItem('isAdmin') === 'true'
    const userId = localStorage.getItem('userId') // must be set at login
    if (token && userId) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`
      setAuth({ token, isAdmin, isAuthenticated: true, userId })
    }
    setLoading(false)
  }, [])

  const login = ({ token, isAdmin, userId }) => {
    localStorage.setItem('token', token)
    localStorage.setItem('isAdmin', String(isAdmin))
    localStorage.setItem('userId', userId) // <-- must be user._id (string)
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    setAuth({ token, isAdmin, isAuthenticated: true, userId })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('userId')
    delete api.defaults.headers.common.Authorization
    setAuth({ token: null, isAdmin: false, isAuthenticated: false, userId: null })
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
