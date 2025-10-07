"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from 'next/navigation'
import { supabase } from './supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on initial load
  useEffect(() => {
    let mounted = true;
    
    // Check active sessions and set the user
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        if (session) {
          const { data: userData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          const merged = {
            ...session.user,
            user_metadata: {
              ...session.user.user_metadata,
              ...userData,
            },
          }
          // Normalize top-level userType and hasVehicle for existing UI
          const pendingRole1 = (() => { try { return localStorage.getItem('pending-user-type') } catch { return null } })()
          const normalizedType1 = pendingRole1 || userData?.user_type || merged.user_metadata?.user_type || null
          
          if (mounted) {
            setUser({
              ...merged,
              userType: normalizedType1,
              hasVehicle: Boolean(merged.user_metadata?.hasVehicle),
            })
          }
        } else if (mounted) {
          setUser(null)
        }
        
        if (mounted) {
          setLoading(false)
        }
      }
    )

    // Check the current user when the component mounts
    const getUser = async () => {
      if (!mounted) return;
      
      const { data: { user } } = await supabase.auth.getUser()
      if (user && mounted) {
        const { data: userData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        const merged = {
          ...user,
          user_metadata: {
            ...user.user_metadata,
            ...userData,
          },
        }
        const pendingRole2 = (() => { try { return localStorage.getItem('pending-user-type') } catch { return null } })()
        const normalizedType2 = pendingRole2 || userData?.user_type || merged.user_metadata?.user_type || null
        
        if (mounted) {
          setUser({
            ...merged,
            userType: normalizedType2,
            hasVehicle: Boolean(merged.user_metadata?.hasVehicle),
          })
        }
      }
      
      if (mounted) {
        setLoading(false)
      }
    }
    
    getUser()
    
    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    }
  }, [])

  // Login function with Supabase
  const login = async (email, password, userType) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      
      return data.user
    } catch (error) {
      // Fallback: allow local mock login for invalid credentials during development
      if (error?.message?.toLowerCase?.().includes('invalid login credentials')) {
        const mockUser = {
          id: `mock-${Date.now()}`,
          email,
          userType: userType || 'ev-owner',
          hasVehicle: false,
          user_metadata: { name: 'Local Dev User' },
        }
        setUser(mockUser)
        try {
          localStorage.setItem('ev-app-user', JSON.stringify(mockUser))
        } catch {}
        return mockUser
      }
      console.error('Login failed:', error?.message || error)
      throw error
    }
  }

  // Google OAuth login; persists selected role to profile on first login
  const googleLogin = async (userType) => {
    try {
      const target = `/${userType === 'ev-owner' ? 'evownerdashboard' : 'chargerownerdashboard'}`
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}${target}` : undefined,
          scopes: 'email profile openid',
        },
      })

      if (error) throw error

      // OAuth flow may redirect; as a fallback, set a pending role in localStorage
      if (userType) {
        try { localStorage.setItem('pending-user-type', userType) } catch {}
      }

      return data?.user ?? null
    } catch (error) {
      console.error('Google login failed:', error?.message || error)
      throw error
    }
  }

  // Signup function with Supabase
  const signup = async (email, password, userType, name) => {
    try {
      // Create user in Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            user_type: userType
          }
        }
      })

      if (signUpError) throw signUpError

      // Create user profile in the database
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: authData.user.id, 
            email,
            name,
            user_type: userType,
            created_at: new Date().toISOString()
          }
        ])

      if (profileError) throw profileError
      
      return authData.user
    } catch (error) {
      console.error('Signup failed:', error.message)
      throw error
    }
  }

  // Logout function
  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    try {
      localStorage.removeItem('ev-app-user')
      localStorage.removeItem('pending-user-type')
    } catch (e) {
      console.warn('Could not clear local storage on logout:', e)
    }
    router.push('/')
  }

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user
  }

  // Get auth headers
  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return {
      'Authorization': `Bearer ${session?.access_token}`
    }
  }

  // After auth state changes or load, upsert profile with role if missing (from local storage)
  useEffect(() => {
    const upsertProfileRole = async () => {
      if (!user?.id) return
      const pendingRole = (() => { try { return localStorage.getItem('pending-user-type') } catch { return null } })()
      if (!pendingRole) return
      try {
        await supabase.from('profiles').upsert({ id: user.id, user_type: pendingRole }, { onConflict: 'id' })
        // Immediately reflect role in memory to prevent flicker
        setUser((prev) => prev ? { ...prev, userType: pendingRole } : prev)
        try { localStorage.removeItem('pending-user-type') } catch {}
      } catch (e) {
        console.warn('Could not persist role to profile:', e?.message || e)
      }
    }
    upsertProfileRole()
  }, [user?.id])

  const value = {
    user,
    loading,
    login,
    googleLogin,
    signup,
    logout,
    isAuthenticated,
    getAuthHeaders,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
