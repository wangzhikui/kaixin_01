<script setup>
import { ref, onMounted, nextTick, watch, inject } from 'vue'
import { useRoute } from 'vue-router'
import { conversationsApi, messagesApi, subscriptionsApi, packagesApi } from '../../api'
import { ElMessage } from 'element-plus'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()
const route = useRoute()

const selectedAgent = inject('selectedAgent')

const conversations = ref([])
const currentConversation = ref(null)
const messages = ref([])
const inputMessage = ref('')
const loading = ref(false)
const sending = ref(false)
const chatContainer = ref(null)
const userTokenUsage = ref({ used: 0, limit: 0 })

defineOptions({
  name: 'HubChat'
})

onMounted(async () => {
  await loadConversations()
  await loadTokenUsage()

  if (route.query.agentId && selectedAgent.value) {
    // Agent is selected from sidebar
  }
})

watch(selectedAgent, (agent) => {
  if (agent) {
    messages.value = []
    currentConversation.value = null
  }
})

async function loadConversations() {
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}')
  if (!user.id) return
  try {
    const data = await conversationsApi.getByUserId(user.id)
    conversations.value = data || []
  } catch (error) {
    console.error('Failed to load conversations:', error)
  }
}

async function loadTokenUsage() {
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}')
  if (!user.id) return
  try {
    const subs = await subscriptionsApi.getActiveByUserId(user.id)
    if (subs && subs.length > 0) {
      const pkg = await packagesApi.getAll()
      const packageInfo = pkg.find(p => p.id === subs[0].packageId)
      if (packageInfo) {
        userTokenUsage.value = {
          used: subs[0].tokenUsed || 0,
          limit: packageInfo.tokenLimit || 0
        }
      }
    }
  } catch (error) {
    console.error('Failed to load token usage:', error)
  }
}

async function selectConversation(conv) {
  currentConversation.value = conv
  loading.value = true
  try {
    const data = await messagesApi.getByConversationId(conv.id)
    messages.value = data || []
    await nextTick()
    scrollToBottom()
  } catch (error) {
    ElMessage.error('加载消息失败')
  } finally {
    loading.value = false
  }
}

async function startNewConversation() {
  if (!selectedAgent.value) {
    ElMessage.warning('请选择智能体')
    return
  }
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}')
  try {
    const conv = await conversationsApi.create({
      userId: user.id,
      agentId: selectedAgent.value.id,
      title: '新对话',
      status: 'active'
    })
    if (conv && conv.id) {
      conversations.value.unshift(conv)
      currentConversation.value = conv
      messages.value = []
    }
  } catch (error) {
    ElMessage.error('创建对话失败')
  }
}

async function sendMessage() {
  if (!inputMessage.value.trim()) return
  if (!currentConversation.value) {
    await startNewConversation()
  }

  const user = JSON.parse(localStorage.getItem('adminUser') || '{}')
  const userMessage = {
    id: Date.now(),
    conversationId: currentConversation.value.id,
    role: 'user',
    content: inputMessage.value,
    createdAt: new Date().toISOString()
  }

  messages.value.push(userMessage)
  const messageContent = inputMessage.value
  inputMessage.value = ''
  sending.value = true

  await nextTick()
  scrollToBottom()

  try {
    const aiMessage = {
      id: Date.now() + 1,
      conversationId: currentConversation.value.id,
      role: 'assistant',
      content: '正在思考...',
      createdAt: new Date().toISOString()
    }
    messages.value.push(aiMessage)
    await nextTick()
    scrollToBottom()

    const response = await fetch(selectedAgent.value.difyApiUrl + selectedAgent.value.difyChatUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${selectedAgent.value.difyApiKey}`
      },
      body: JSON.stringify({
        query: messageContent,
        user: user.id || 'anonymous',
        conversation_id: currentConversation.value.conversationId
      })
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullContent = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))
            if (data.answer) {
              fullContent += data.answer
              aiMessage.content = fullContent
              await nextTick()
              scrollToBottom()
            }
            if (data.conversation_id) {
              currentConversation.value.conversationId = data.conversation_id
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    }

    aiMessage.content = fullContent || '抱歉，我没有收到有效的回复'
    await messagesApi.create({
      conversationId: currentConversation.value.id,
      role: 'assistant',
      content: aiMessage.content
    })
  } catch (error) {
    ElMessage.error('发送消息失败')
    messages.value.pop()
  } finally {
    sending.value = false
  }
}

function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

function renderMarkdown(content) {
  return md.render(content)
}
</script>

<template>
  <div class="hub-chat">
    <div class="chat-layout">
      <!-- Chat Area -->
      <div class="chat-area">
        <!-- Header -->
        <div class="chat-header" v-if="selectedAgent">
          <div class="header-left">
            <span class="agent-avatar">{{ selectedAgent.icon }}</span>
            <span class="agent-name">{{ selectedAgent.name }}</span>
          </div>
          <div class="token-usage" v-if="userTokenUsage.limit > 0">
            <span class="token-text">{{ userTokenUsage.used }} / {{ userTokenUsage.limit }}</span>
          </div>
        </div>

        <!-- Messages -->
        <div class="messages-container" ref="chatContainer">
          <div v-if="messages.length === 0" class="empty-state">
            <div class="empty-illustration">
              <svg viewBox="0 0 100 100" class="empty-svg">
                <rect x="15" y="25" width="70" height="55" rx="8" fill="#111" opacity="0.1"/>
                <rect x="20" y="30" width="60" height="45" rx="4" fill="#111" opacity="0.05"/>
                <path d="M30 45 Q50 25, 70 45 Q75 50, 70 60 Q65 70, 50 75 Q35 70, 30 60 Q25 50, 30 45"
                      fill="#111" opacity="0.15"/>
                <circle cx="40" cy="42" r="3" fill="#111" opacity="0.3"/>
                <circle cx="60" cy="42" r="3" fill="#111" opacity="0.3"/>
                <path d="M38 55 Q50 62, 62 55" stroke="#111" stroke-width="2" fill="none" opacity="0.2"/>
              </svg>
            </div>
            <p class="empty-text">与 {{ selectedAgent?.name || '智能体' }} 开始对话</p>
            <p class="empty-hint">输入消息获取 AI 智能助手的帮助</p>
          </div>

          <div
            v-for="(msg, index) in messages"
            :key="msg.id"
            class="message"
            :class="msg.role"
          >
            <div class="message-avatar" v-if="msg.role === 'assistant'">
              <span class="avatar-icon">{{ selectedAgent?.icon }}</span>
            </div>
            <div class="message-bubble" :class="msg.role">
              <div class="message-content" v-html="renderMarkdown(msg.content)"></div>
            </div>
            <div class="message-avatar user-avatar" v-if="msg.role === 'user'">
              <svg class="avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>

          <div v-if="sending" class="message assistant">
            <div class="message-avatar">
              <span class="avatar-icon">{{ selectedAgent?.icon }}</span>
            </div>
            <div class="message-bubble assistant typing">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="input-area">
          <div class="input-wrapper">
            <textarea
              v-model="inputMessage"
              class="message-textarea"
              placeholder="输入消息..."
              @keyup.enter.ctrl="sendMessage"
              :disabled="sending"
              rows="1"
            ></textarea>
            <button
              class="send-btn"
              :disabled="sending || !inputMessage.trim()"
              @click="sendMessage"
            >
              <svg v-if="!sending" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="send-icon">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              <span v-else class="sending-text">发送中</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hub-chat {
  height: 100vh;
  margin: 0;
  padding: 0;
}

.chat-layout {
  display: flex;
  height: 100%;
  margin: 0;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
}

/* Header */
.chat-header {
  padding: 14px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.agent-avatar {
  font-size: 20px;
}

.agent-name {
  font-size: 1rem;
  font-weight: 600;
  color: #111;
}

.token-usage {
  display: flex;
  align-items: center;
}

.token-text {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Messages */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.empty-illustration {
  width: 80px;
  height: 80px;
  opacity: 0.5;
}

.empty-svg {
  width: 100%;
  height: 100%;
}

.empty-text {
  font-size: 1rem;
  font-weight: 500;
  color: #111;
  margin: 0;
}

.empty-hint {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.message {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-avatar.user-avatar {
  background: #111;
}

.avatar-icon {
  font-size: 16px;
  color: #fff;
}

.message-avatar:not(.user-avatar) .avatar-icon {
  color: #111;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 20px;
  line-height: 1.6;
}

.message-bubble.user {
  background: #111;
  color: #fff;
  border-bottom-right-radius: 6px;
}

.message-bubble.assistant {
  background: #f5f5f5;
  color: #111;
  border-bottom-left-radius: 6px;
}

.message-content {
  font-size: 0.9375rem;
}

.message-content :deep(p) {
  margin: 0 0 8px 0;
}

.message-content :deep(p:last-child) {
  margin-bottom: 0;
}

.message-content :deep(code) {
  background: rgba(0, 0, 0, 0.06);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
}

.message-bubble.user :deep(code) {
  background: rgba(255, 255, 255, 0.15);
}

.message-content :deep(pre) {
  background: #1f2937;
  color: #f3f4f6;
  padding: 14px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 8px 0;
}

.message-content :deep(pre code) {
  background: transparent;
  padding: 0;
}

/* Typing */
.typing {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
}

.typing-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #9ca3af;
  animation: typing 1.4s infinite;
}

.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-4px); opacity: 1; }
}

/* Input Area */
.input-area {
  padding: 16px 24px 24px;
  background: #fff;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  background: #f5f5f5;
  border-radius: 16px;
  padding: 10px 12px;
  transition: all 0.15s;
}

.input-wrapper:focus-within {
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.message-textarea {
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  font-size: 0.9375rem;
  line-height: 1.5;
  background: transparent;
  color: #111;
  font-family: inherit;
  padding: 4px 0;
  margin: 0;
}

.message-textarea::placeholder {
  color: #9ca3af;
  font-size: 0.875rem;
}

.message-textarea:disabled {
  opacity: 0.6;
}

.send-btn {
  width: 40px;
  height: 36px;
  padding: 0;
  border-radius: 10px;
  background: #111;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  background: #374151;
  transform: scale(1.02);
}

.send-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.send-icon {
  width: 16px;
  height: 16px;
  color: #fff;
}

.sending-text {
  font-size: 0.75rem;
  color: #fff;
}

/* Scrollbar */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
