import React from 'react'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { useTheme } from '@/context/ThemeContext'

const Layout = ({ children }) => {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen flex flex-col theme-transition ${theme}`}>
      <Header />
      
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      
      <Footer />
    </div>
  )
}

export default Layout
