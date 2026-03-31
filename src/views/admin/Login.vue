<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usersApi } from '../../api'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loginForm = ref({
  username: '',
  password: ''
})
const loading = ref(false)

async function handleLogin() {
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }

  loading.value = true
  try {
    const user = await usersApi.login(loginForm.value.username, loginForm.value.password)
    if (user) {
      usersApi.setCurrentAdmin(user)
      ElMessage.success('登录成功')
      router.push('/admin/home')
    } else {
      ElMessage.error('用户名或密码错误')
    }
  } catch (error) {
    ElMessage.error('登录失败，请检查网络')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <svg viewBox="0 0 100 100" class="logo-svg">
          <defs>
            <linearGradient id="dolphinGradL" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#14B8A6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#2DD4BF;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="chipGradL" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#14B8A6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#2DD4BF;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect x="10" y="40" width="80" height="50" rx="8" fill="url(#chipGradL)" opacity="0.9"/>
          <rect x="15" y="45" width="70" height="40" rx="4" fill="#1e1b4b"/>
          <line x1="25" y1="55" x2="75" y2="55" stroke="#5eead4" stroke-width="1.5" opacity="0.8"/>
          <line x1="25" y1="65" x2="75" y2="65" stroke="#5eead4" stroke-width="1.5" opacity="0.6"/>
          <line x1="25" y1="75" x2="75" y2="75" stroke="#5eead4" stroke-width="1.5" opacity="0.4"/>
          <circle cx="25" cy="55" r="3" fill="#5eead4"/>
          <circle cx="75" cy="55" r="3" fill="#5eead4"/>
          <circle cx="35" cy="65" r="2.5" fill="#5eead4"/>
          <circle cx="65" cy="65" r="2.5" fill="#5eead4"/>
          <path d="M30 28 Q35 15, 50 18 Q65 12, 75 25 Q82 35, 78 42 Q72 48, 65 45 Q58 42, 55 48 Q50 55, 45 52 Q38 48, 35 38 Q32 32, 30 28"
                fill="url(#dolphinGradL)" opacity="0.95"/>
          <circle cx="58" cy="28" r="2.5" fill="#1e1b4b"/>
          <circle cx="59" cy="27" r="1" fill="#fff"/>
        </svg>
        <h1>EDA365 AI</h1>
        <p>管理后台</p>
      </div>

      <el-form class="login-form" @submit.prevent="handleLogin">
        <el-form-item>
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            size="large"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-btn"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-secondary);
}

.login-card {
  width: 400px;
  padding: 48px;
  background: #fff;
  border-radius: 20px;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-border-light);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-svg {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.login-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent-warm));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 8px 0;
}

.login-header p {
  color: var(--color-text-muted);
  margin: 0;
}

.login-form {
  margin-top: 24px;
}

.login-form :deep(.el-input__wrapper) {
  border-radius: 10px;
  padding: 4px 16px;
}

.login-form :deep(.el-button--primary) {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent-warm));
  border-color: var(--color-primary);
  border-radius: 10px;
}

.login-form :deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, var(--color-accent-warm), var(--color-primary));
  border-color: var(--color-accent-warm);
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent-warm));
  border: none;
  border-radius: 10px;
}

.login-btn:hover {
  background: linear-gradient(135deg, var(--color-accent-warm), var(--color-primary));
  box-shadow: 0 8px 24px rgba(20, 184, 166, 0.3);
}
</style>
