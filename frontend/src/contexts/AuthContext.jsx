import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export { AuthContext };

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://financeandsplit-1.onrender.com' : 'http://localhost:8000'

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Set up axios interceptor for handling 401 errors
      const interceptor = axios.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            // Token expired or invalid
            logout()
            // Redirect to login using window.location instead of navigate
            window.location.href = '/login'
          }
          return Promise.reject(error)
        }
      )
      
      return () => {
        axios.interceptors.response.eject(interceptor)
      }
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  const login = async (username, password) => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password
      })
      const { access_token } = response.data
      setToken(access_token)
      localStorage.setItem('token', access_token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      }
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email, username, password) => {
    setLoading(true)
    try {
      await axios.post(`${API_BASE_URL}/auth/signup`, {
        email,
        username,
        password
      })
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Signup failed' 
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  const isAuthenticated = () => {
    return !!token
  }

  const checkAuthAndRedirect = () => {
    if (!token) {
      window.location.href = '/login'
      return false
    }
    return true
  }

  const value = {
    token,
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated,
    checkAuthAndRedirect
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
