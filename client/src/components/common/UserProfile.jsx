import React from 'react'
import { useAuth } from '@/context/AuthContext'


import { motion } from 'framer-motion'

const UserProfile = ({ size = 'md', showName = false, className = '' }) => {
  const { user, getUserInitials } = useAuth()

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }

  const avatarClass = `${sizeClasses[size]} rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold ${className}`

  return (
    <div className="flex items-center space-x-3">
      {/* User Avatar */}
      <motion.div
        className={avatarClass}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span>{getUserInitials()}</span>
        )}
      </motion.div>

      {/* User Name */}
      {showName && (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {user?.name || 'User'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {user?.email}
          </span>
        </div>
      )}
    </div>
  )
}

export default UserProfile
