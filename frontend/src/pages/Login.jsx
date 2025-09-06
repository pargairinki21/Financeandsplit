import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const { login, signup, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (showForgotPassword) {
      // Handle forgot password
      if (!formData.email) {
        setError('Please enter your email address')
        return
      }
      // Simulate forgot password request
      setMessage('Password reset instructions have been sent to your email.')
      setTimeout(() => {
        setShowForgotPassword(false)
        setFormData({ email: '', username: '', password: '' })
        setMessage('')
      }, 3000)
      return
    }

    if (isLogin) {
      const result = await login(formData.username, formData.password)
      if (result.success) {
        navigate('/')
      } else {
        setError(result.error)
      }
    } else {
      const result = await signup(formData.email, formData.username, formData.password)
      if (result.success) {
        setIsLogin(true)
        setError('')
        setMessage('Account created successfully! Please sign in.')
        setFormData({ email: '', username: '', password: '' })
      } else {
        setError(result.error)
      }
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-200 to-dark-300 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="glass rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-gradient-purple rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Finance Tracker
            </h2>
            <p className="text-slate-400">
              {showForgotPassword ? 'Enter your email to reset password' : 
               isLogin ? 'Welcome back! Sign in to continue' : 'Create your account to get started'}
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {showForgotPassword ? (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-dark-100 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              ) : (
                <>
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                      <input
                        name="email"
                        type="email"
                        required
                        className="w-full px-4 py-3 bg-dark-100 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                    <input
                      name="username"
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-dark-100 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-slate-300">Password</label>
                      {isLogin && (
                        <button
                          type="button"
                          className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                          onClick={() => {
                            setShowForgotPassword(true)
                            setError('')
                            setFormData({ email: '', username: '', password: '' })
                          }}
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <input
                      name="password"
                      type="password"
                      required
                      className="w-full px-4 py-3 bg-dark-100 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {message && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <p className="text-green-400 text-sm text-center">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-purple hover:opacity-90 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </div>
              ) : (
                showForgotPassword ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>

            <div className="text-center space-y-2">
              {!showForgotPassword && (
                <button
                  type="button"
                  className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setError('')
                    setMessage('')
                    setFormData({ email: '', username: '', password: '' })
                  }}
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              )}
              
              {showForgotPassword && (
                <button
                  type="button"
                  className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                  onClick={() => {
                    setShowForgotPassword(false)
                    setError('')
                    setMessage('')
                    setFormData({ email: '', username: '', password: '' })
                  }}
                >
                  Back to sign in
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
