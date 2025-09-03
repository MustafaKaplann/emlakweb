'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const AdminContext = createContext()

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Burada gerçek admin kontrolü yapılacak
    // Şimdilik localStorage'dan kontrol ediyoruz
    const adminStatus = localStorage.getItem('isAdmin')
    setIsAdmin(adminStatus === 'true')
    setIsLoading(false)
  }, [])

  const loginAsAdmin = () => {
    setIsAdmin(true)
    localStorage.setItem('isAdmin', 'true')
  }

  const logoutAdmin = () => {
    setIsAdmin(false)
    localStorage.removeItem('isAdmin')
  }

  return (
    <AdminContext.Provider value={{ isAdmin, isLoading, loginAsAdmin, logoutAdmin }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
