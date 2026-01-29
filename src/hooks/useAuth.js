import { useEffect, useState } from 'react'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('adminToken')
    if (token) {
      setUser({ email: 'admin@local' })
      setIsAdmin(true)
    } else {
      setUser(null)
      setIsAdmin(false)
    }
    setLoading(false)
  }, [])

  const login = async () => {
    const password = window.prompt('Enter Admin Password')
    if (!password) return

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      const data = await res.json()
      if (data.ok && data.token) {
        localStorage.setItem('adminToken', data.token)
        setUser({ email: 'admin@local' })
        setIsAdmin(true)
        window.location.reload()
      } else {
        alert('Invalid password')
      }
    } catch (err) {
      console.error(err)
      alert('Login failed')
    }
  }

  const logout = async () => {
    localStorage.removeItem('adminToken')
    setUser(null)
    setIsAdmin(false)
    window.location.reload()
  }

  return { user, isAdmin, loading, login, logout }
}