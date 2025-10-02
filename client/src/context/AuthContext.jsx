import React, { createContext, useContext, useEffect, useState } from 'react'
import { authAPI } from '@/services/api'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('downtube-token')
      if (!token) {
        setLoading(false)
        return
      }

      // Verify token with backend
      const response = await authAPI.verifyToken()
      if (response.data.success) {
        setUser(response.data.user)
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem('downtube-token')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('downtube-token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await authAPI.login({ email, password })
      
      if (response.data.success) {
        const { token, user } = response.data
        localStorage.setItem('downtube-token', token)
        setUser(user)
        setIsAuthenticated(true)
        toast.success('Login successful!')
        return { success: true, user }
      } else {
        toast.error(response.data.message || 'Login failed')
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      console.error('Login error:', error)
      const message = error.response?.data?.message || 'Login failed. Please try again.'
      toast.error(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      const response = await authAPI.register(userData)
      
      if (response.data.success) {
        const { token, user } = response.data
        localStorage.setItem('downtube-token', token)
        setUser(user)
        setIsAuthenticated(true)
        toast.success('Account created successfully!')
        return { success: true, user }
      } else {
        toast.error(response.data.message || 'Registration failed')
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      console.error('Registration error:', error)
      const message = error.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('downtube-token')
      setUser(null)
      setIsAuthenticated(false)
      toast.success('Logged out successfully!')
    }
  }

  const updateProfile = async (profileData) => {
    try {
      setLoading(true)
      const response = await authAPI.updateProfile(profileData)
      
      if (response.data.success) {
        setUser(response.data.user)
        toast.success('Profile updated successfully!')
        return { success: true, user: response.data.user }
      } else {
        toast.error(response.data.message || 'Profile update failed')
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      console.error('Profile update error:', error)
      const message = error.response?.data?.message || 'Profile update failed. Please try again.'
      toast.error(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const getUserInitials = () => {
    if (!user || !user.name) return '??'
    const names = user.name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return user.name.substring(0, 2).toUpperCase()
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    getUserInitials,
    checkAuthStatus,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
