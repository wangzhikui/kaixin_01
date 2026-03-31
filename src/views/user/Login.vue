<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usersApi } from '../../api'
import { ElMessage } from 'element-plus'
import AppHeader from '../../components/AppHeader.vue'
import AppFooter from '../../components/AppFooter.vue'

const router = useRouter()
const route = useRoute()
const loginType = ref('password')
const phone = ref('')
const code = ref('')
const smsSent = ref(false)
const countdown = ref(0)
const loading = ref(false)
const sendingCode = ref(false)

async function handlePasswordLogin() {
  if (!phone.value || !code.value) {
    ElMessage.warning('请输入手机号和密码')
    return
  }

  loading.value = true
  try {
    // 先查询会员信息，通过手机号验证密码
    const members = await usersApi.getMembersByPhone(phone.value)
    if (members && members.length > 0) {
      const member = members[0]
      // 简单验证：密码就是手机号后6位或者123456（演示用）
      if (code.value === '123456' || code.value === phone.value.slice(-6)) {
        const user = {
          id: member.id,
          username: member.phone,
          phone: member.phone,
          name: member.nickname || '会员用户',
          roleId: '1'
        }
        usersApi.setCurrentUser(user)
        ElMessage.success('登录成功')
        router.back()
        return
      } else {
        ElMessage.error('密码错误')
        loading.value = false
        return
      }
    }
    // 如果没找到会员，尝试使用admin账号登录（保留原有逻辑）
    const adminUser = await usersApi.login(phone.value, code.value)
    if (adminUser) {
      usersApi.setCurrentUser(adminUser)
      ElMessage.success('登录成功')
      router.back()
    } else {
      ElMessage.error('手机号或密码错误')
    }
  } catch (error) {
    ElMessage.error('登录失败，请检查网络')
  } finally {
    loading.value = false
  }
}

async function handleSendCode() {
  if (!phone.value) {
    ElMessage.warning('请输入手机号')
    return
  }

  sendingCode.value = true
  try {
    // 模拟发送验证码
    smsSent.value = true
    countdown.value = 60
    ElMessage.success('验证码已发送（测试用：123456）')
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    ElMessage.error('发送验证码失败')
  } finally {
    sendingCode.value = false
  }
}

async function handleSmsLogin() {
  if (!phone.value || !code.value) {
    ElMessage.warning('请输入手机号和验证码')
    return
  }

  loading.value = true
  try {
    // 演示模式：验证码 123456 直接登录
    if (code.value === '123456') {
      // 先查询会员信息，获取真实会员ID
      let memberId = 'demo'
      try {
        const members = await usersApi.getMembersByPhone(phone.value)
        if (members && members.length > 0) {
          memberId = members[0].id
        }
      } catch (e) {
        console.warn('未找到会员信息，使用演示ID')
      }

      const mockUser = {
        id: memberId,
        username: phone.value,
        phone: phone.value,
        name: '演示用户',
        roleId: '1'
      }
      usersApi.setCurrentUser(mockUser)
      ElMessage.success('登录成功')
      router.back()
    } else {
      ElMessage.error('验证码错误（测试验证码：123456）')
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
    <AppHeader />
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <svg viewBox="0 0 100 100" class="logo-svg">
            <defs>
              <linearGradient id="dolphinGradUL" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#14B8A6;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#2DD4BF;stop-opacity:1" />
              </linearGradient>
              <linearGradient id="chipGradUL" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#14B8A6;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#2DD4BF;stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect x="10" y="40" width="80" height="50" rx="8" fill="url(#chipGradUL)" opacity="0.9"/>
            <rect x="15" y="45" width="70" height="40" rx="4" fill="#1e1b4b"/>
            <line x1="25" y1="55" x2="75" y2="55" stroke="#5eead4" stroke-width="1.5" opacity="0.8"/>
            <line x1="25" y1="65" x2="75" y2="65" stroke="#5eead4" stroke-width="1.5" opacity="0.6"/>
            <line x1="25" y1="75" x2="75" y2="75" stroke="#5eead4" stroke-width="1.5" opacity="0.4"/>
            <circle cx="25" cy="55" r="3" fill="#5eead4"/>
            <circle cx="75" cy="55" r="3" fill="#5eead4"/>
            <circle cx="35" cy="65" r="2.5" fill="#5eead4"/>
            <circle cx="65" cy="65" r="2.5" fill="#5eead4"/>
            <path d="M30 28 Q35 15, 50 18 Q65 12, 75 25 Q82 35, 78 42 Q72 48, 65 45 Q58 42, 55 48 Q50 55, 45 52 Q38 48, 35 38 Q32 32, 30 28"
                  fill="url(#dolphinGradUL)" opacity="0.95"/>
            <circle cx="58" cy="28" r="2.5" fill="#1e1b4b"/>
            <circle cx="59" cy="27" r="1" fill="#fff"/>
          </svg>
          <h1>EDA365 AI</h1>
          <p>登录以开始智能对话</p>
        </div>

        <el-tabs v-model="loginType" class="login-tabs">
          <el-tab-pane label="密码登录" name="password">
            <el-form @submit.prevent="handlePasswordLogin" class="login-form">
              <el-form-item>
                <el-input
                  v-model="phone"
                  placeholder="手机号"
                  prefix-icon="Phone"
                  size="large"
                />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="code"
                  type="password"
                  placeholder="密码"
                  prefix-icon="Lock"
                  size="large"
                  @keyup.enter="handlePasswordLogin"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  size="large"
                  :loading="loading"
                  class="login-btn"
                  @click="handlePasswordLogin"
                >
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="验证码登录" name="sms">
            <el-form class="login-form">
              <el-form-item>
                <el-input
                  v-model="phone"
                  placeholder="手机号"
                  prefix-icon="Phone"
                  size="large"
                />
              </el-form-item>
              <el-form-item>
                <div class="code-input">
                  <el-input
                    v-model="code"
                    placeholder="验证码"
                    size="large"
                  />
                  <el-button
                    :disabled="countdown > 0"
                    :loading="sendingCode"
                    @click="handleSendCode"
                  >
                    {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                  </el-button>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  size="large"
                  class="login-btn"
                  @click="handleSmsLogin"
                >
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>

        <div class="login-footer">
          <router-link to="/">返回首页</router-link>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-secondary);
}

.login-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 20px 60px;
}

.login-card {
  width: 400px;
  padding: 48px;
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border-light);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
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

.login-tabs {
  margin-bottom: 24px;
}

.login-form {
  margin-top: 24px;
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  border: none;
}

.login-btn:hover {
  background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%);
}

.code-input {
  display: flex;
  gap: 12px;
}

.code-input .el-input {
  flex: 1;
}

.login-footer {
  text-align: center;
  margin-top: 24px;
}

.login-footer a {
  color: var(--color-accent-primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.login-footer a:hover {
  color: var(--color-accent-secondary);
  text-decoration: underline;
}

.login-footer a:focus-visible {
  outline: 2px solid var(--color-accent-primary);
  outline-offset: 2px;
}

:deep(.el-tabs__item) {
  color: var(--color-text-secondary);
}

:deep(.el-tabs__item.is-active) {
  color: var(--color-accent-primary);
}

:deep(.el-tabs__active-bar) {
  background-color: var(--color-accent-primary);
}

:deep(.el-input__wrapper) {
  border-radius: var(--radius-md);
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  border-color: var(--color-primary);
}
</style>
