import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    return Promise.reject(error)
  }
)

// Articles API
export const articlesApi = {
  getAll: () => api.get('/articles'),
  getById: (id) => api.get(`/articles/${id}`),
  create: (data) => api.post('/articles', data),
  update: (id, data) => api.put(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`)
}

// Categories API (网址导航分类)
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`)
}

// Article Categories API (文章分类)
export const articleCategoriesApi = {
  getAll: () => api.get('/articleCategories'),
  getById: (id) => api.get(`/articleCategories/${id}`),
  create: (data) => api.post('/articleCategories', data),
  update: (id, data) => api.put(`/articleCategories/${id}`, data),
  delete: (id) => api.delete(`/articleCategories/${id}`)
}

// Links API
export const linksApi = {
  getAll: () => api.get('/links'),
  getByCategory: (categoryId) => api.get(`/links?categoryId=${categoryId}`),
  getById: (id) => api.get(`/links/${id}`),
  create: (data) => api.post('/links', data),
  update: (id, data) => api.put(`/links/${id}`, data),
  delete: (id) => api.delete(`/links/${id}`)
}

// Users API (for login and user management)
export const usersApi = {
  // Admin login
  login: async (username, password) => {
    const encodedUsername = encodeURIComponent(username)
    const encodedPassword = encodeURIComponent(password)
    const users = await api.get(`/users?username=${encodedUsername}&password=${encodedPassword}`)
    if (users && users.length > 0) {
      const user = Array.isArray(users) ? users[0] : users
      if (user.roleId) {
        const role = await api.get(`/roles/${user.roleId}`)
        if (role) {
          user.role = role
          const allMenus = await api.get('/menus')
          user.menus = allMenus
            .filter(menu => role.menuKeys.includes(menu.key))
            .sort((a, b) => (a.sort || 0) - (b.sort || 0))
        }
      }
      return user
    }
    return null
  },
  // Refresh admin user menus from database based on role permissions
  refreshAdminMenus: async () => {
    const userStr = localStorage.getItem('adminUser')
    if (!userStr) return null
    const user = JSON.parse(userStr)
    if (user && user.roleId) {
      const role = await api.get(`/roles/${user.roleId}`)
      if (role) {
        user.role = role
        const allMenus = await api.get('/menus')
        user.menus = allMenus
          .filter(menu => role.menuKeys.includes(menu.key))
          .sort((a, b) => (a.sort || 0) - (b.sort || 0))
        localStorage.setItem('adminUser', JSON.stringify(user))
      }
    }
    return user
  },
  getAllUsers: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  // Admin user management (uses adminUser key)
  getCurrentAdmin: () => {
    const userStr = localStorage.getItem('adminUser')
    return userStr ? JSON.parse(userStr) : null
  },
  setCurrentAdmin: (user) => {
    localStorage.setItem('adminUser', JSON.stringify(user))
  },
  logoutAdmin: () => {
    localStorage.removeItem('adminUser')
  },
  // Frontend user management (uses userToken key)
  getCurrentUser: () => {
    const userStr = localStorage.getItem('userToken')
    return userStr ? JSON.parse(userStr) : null
  },
  setCurrentUser: (user) => {
    localStorage.setItem('userToken', JSON.stringify(user))
  },
  logout: () => {
    localStorage.removeItem('userToken')
  },
  // 查询会员（用于前端登录时获取真实会员ID）
  // 注意：json-server 对手机号查询有问题，需要获取所有后过滤
  getMembersByPhone: async (phone) => {
    const allMembers = await api.get('/members')
    return allMembers.filter(m => m.phone === phone)
  }
}

// Roles API
export const rolesApi = {
  getAll: () => api.get('/roles'),
  getById: (id) => api.get(`/roles/${id}`),
  create: (data) => api.post('/roles', data),
  update: (id, data) => api.put(`/roles/${id}`, data),
  delete: (id) => api.delete(`/roles/${id}`)
}

// Menus API
export const menusApi = {
  getAll: () => api.get('/menus'),
  getById: (id) => api.get(`/menus/${id}`),
  update: (id, data) => api.put(`/menus/${id}`, data)
}

// Packages API
export const packagesApi = {
  getAll: () => api.get('/packages'),
  getById: (id) => api.get(`/packages/${id}`),
  getByCode: (code) => api.get(`/packages?code=${code}`),
  create: (data) => api.post('/packages', data),
  update: (id, data) => api.put(`/packages/${id}`, data),
  delete: (id) => api.delete(`/packages/${id}`)
}

// Features API
export const featuresApi = {
  getAll: () => api.get('/features'),
  getById: (id) => api.get(`/features/${id}`),
  create: (data) => api.post('/features', data),
  update: (id, data) => api.put(`/features/${id}`, data),
  delete: (id) => api.delete(`/features/${id}`)
}

// Members API
export const membersApi = {
  getAll: () => api.get('/members'),
  getById: (id) => api.get(`/members/${id}`),
  getByPhone: (phone) => api.get(`/members?phone=${phone}`),
  create: (data) => api.post('/members', data),
  update: (id, data) => api.put(`/members/${id}`, data),
  delete: (id) => api.delete(`/members/${id}`)
}

// Subscriptions API
export const subscriptionsApi = {
  getAll: () => api.get('/subscriptions'),
  getByUserId: (userId) => api.get(`/subscriptions?userId=${userId}&_sort=createdAt&_order=desc`),
  getActiveByUserId: (userId) => api.get(`/subscriptions?userId=${userId}&status=active`),
  create: (data) => api.post('/subscriptions', data),
  update: (id, data) => api.put(`/subscriptions/${id}`, data)
}

// SMS Codes API
export const smsCodesApi = {
  create: (phone, code) => api.post('/smsCodes', { phone, code, createdAt: new Date().toISOString() }),
  verify: async (phone, code) => {
    const codes = await api.get(`/smsCodes?phone=${phone}&_sort=createdAt&_order=desc&_limit=1`)
    if (codes && codes.length > 0) {
      const latest = codes[0]
      const diff = Date.now() - new Date(latest.createdAt).getTime()
      if (diff > 5 * 60 * 1000) {
        return false
      }
      return latest.code === code
    }
    return false
  }
}

// Agents API
export const agentsApi = {
  getAll: () => api.get('/agents'),
  getById: (id) => api.get(`/agents/${id}`),
  getByPackageId: (packageId) => api.get(`/agents?packageId=${packageId}`),
  create: (data) => api.post('/agents', data),
  update: (id, data) => api.put(`/agents/${id}`, data),
  delete: (id) => api.delete(`/agents/${id}`)
}

// Conversations API
export const conversationsApi = {
  getByUserId: (userId) => api.get(`/conversations?userId=${userId}&_sort=updatedAt&_order=desc`),
  getById: (id) => api.get(`/conversations/${id}`),
  create: (data) => api.post('/conversations', data),
  update: (id, data) => api.put(`/conversations/${id}`, data),
  delete: (id) => api.delete(`/conversations/${id}`)
}

// Messages API
export const messagesApi = {
  getByConversationId: (conversationId) => api.get(`/messages?conversationId=${conversationId}&_sort=createdAt&_order=asc`),
  create: (data) => api.post('/messages', data),
  createBatch: (dataArray) => Promise.all(dataArray.map(data => api.post('/messages', data)))
}

// Agent Packages API
export const agentPackagesApi = {
  getAll: () => api.get('/agentPackages'),
  getByPackageId: (packageId) => api.get(`/agentPackages?packageId=${packageId}`)
}

export default api
