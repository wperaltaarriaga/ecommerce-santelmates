import { useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../firebase/config'
import { AuthContext } from './contexts'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      // El rol admin viaja como custom claim dentro del token de sesión
      if (firebaseUser) {
        try {
          const { claims } = await firebaseUser.getIdTokenResult()
          setIsAdmin(claims.admin === true)
        } catch {
          setIsAdmin(false)
        }
      } else {
        setIsAdmin(false)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const register = (email, password) => createUserWithEmailAndPassword(auth, email, password)
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password)
  const resetPassword = (email) => sendPasswordResetEmail(auth, email)
  const logout = () => signOut(auth)

  const value = { user, isAdmin, loading, register, login, resetPassword, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
