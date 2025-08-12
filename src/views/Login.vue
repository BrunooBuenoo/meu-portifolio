<template>
  <div class="login">
    <div class="login-container">
      <div class="login-card">
        <h1>Login Administrativo</h1>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>Email</label>
            <input 
              v-model="email" 
              type="email" 
              required 
              placeholder="seu@email.com"
            />
          </div>
          <div class="form-group">
            <label>Senha</label>
            <input 
              v-model="password" 
              type="password" 
              required 
              placeholder="Sua senha"
            />
          </div>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
          <p v-if="error" class="error">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const { user } = inject('auth')
    
    const email = ref('')
    const password = ref('')
    const loading = ref(false)
    const error = ref('')

    const handleLogin = async () => {
      loading.value = true
      error.value = ''
      
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value)
        router.push('/admin')
      } catch (err) {
        error.value = 'Email ou senha incorretos'
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      if (user.value) {
        router.push('/admin')
      }
    })

    return {
      email,
      password,
      loading,
      error,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.login-card {
  background: var(--bg-card);
  padding: 40px;
  border-radius: 12px;
  border: 1px solid var(--border);
}

.login-card h1 {
  text-align: center;
  margin-bottom: 32px;
  color: var(--text-primary);
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-primary);
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: inherit;
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent);
}

.btn {
  width: 100%;
  margin-bottom: 16px;
}

.error {
  color: #ef4444;
  text-align: center;
  font-size: 0.9rem;
}
</style>
