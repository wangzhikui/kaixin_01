<script setup>
import { ref, onMounted } from 'vue'
import { usersApi, rolesApi } from '../../api'
import { ElMessage, ElMessageBox } from 'element-plus'

const users = ref([])
const roles = ref([])
const loading = ref(true)

defineOptions({
  name: 'UserManager'
})

async function loadData() {
  loading.value = true
  try {
    const [usersData, rolesData] = await Promise.all([
      usersApi.getAllUsers(),
      rolesApi.getAll()
    ])
    users.value = usersData || []
    roles.value = rolesData || []
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

function getRoleName(roleId) {
  const role = roles.value.find(r => r.id === roleId)
  return role ? role.name : '未知'
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

async function handleDelete(user) {
  try {
    await ElMessageBox.confirm('确定要删除这个用户吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await usersApi.delete(user.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}
</script>

<template>
  <div class="user-manager" v-loading="loading">
    <el-table :data="users" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" width="150" />
      <el-table-column prop="name" label="姓名" width="150" />
      <el-table-column prop="email" label="邮箱" min-width="200" />
      <el-table-column label="角色" width="120">
        <template #default="{ row }">
          <el-tag>{{ getRoleName(row.roleId) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="150">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.user-manager {
  padding: 16px;
}
</style>
