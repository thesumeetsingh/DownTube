import React from 'react'
import SignIn from './SignIn'

// SignUp is handled within SignIn component via mode switching
// This is a wrapper for consistency
const SignUp = ({ isOpen, onClose }) => {
  return <SignIn isOpen={isOpen} onClose={onClose} defaultMode="signup" />
}

export default SignUp
