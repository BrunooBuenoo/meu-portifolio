'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/config'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Redireciona para o admin se já estiver logado
  useEffect(() => {
    if (!loading && user) {
      router.push('/admin')
    }
  }, [user, loading, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/admin')
    } catch (err) {
      console.error('Erro na autenticação:', err)
      setError('Email ou senha incorretos.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-[2px] border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      {/* Detalhe estético de background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-primary border border-border-custom rounded-2xl p-8 sm:p-10 z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black tracking-tight text-txt-primary hover:opacity-80 transition-opacity">
            BB
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-txt-primary mt-4">
            Login Administrativo
          </h1>
          <p className="text-txt-secondary text-xs mt-1">
            Entre para gerenciar o conteúdo do seu portfólio
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-txt-primary">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 bg-secondary/50 border border-border-custom hover:border-txt-secondary focus:border-txt-primary rounded-xl text-txt-primary outline-none transition-colors text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-txt-primary">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              className="w-full px-4 py-3 bg-secondary/50 border border-border-custom hover:border-txt-secondary focus:border-txt-primary rounded-xl text-txt-primary outline-none transition-colors text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-txt-primary text-primary hover:bg-transparent hover:text-txt-primary border border-txt-primary rounded-xl font-semibold transition-all cursor-pointer disabled:opacity-50 text-sm shadow-md"
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>

          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-rose-500 text-sm font-medium text-center"
            >
              {error}
            </motion.p>
          )}
        </form>
      </motion.div>
    </div>
  )
}
