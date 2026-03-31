<script setup>
import { ref, onMounted } from 'vue'
import { agentsApi, packagesApi } from '../../api'
import { ElMessage, ElMessageBox } from 'element-plus'

const agents = ref([])
const packages = ref([])
const loading = ref(true)
const dialogVisible = ref(false)
const isEditing = ref(false)
const formData = ref({
  id: '',
  name: '',
  code: '',
  icon: '',
  description: '',
  status: 1,
  sort: 0,
  packageIds: [],
  difyApiUrl: '',
  difyApiKey: '',
  difyChatUrl: '/chat-messages',
  difyFileUrl: '/files/upload'
})

defineOptions({
  name: 'AgentManager'
})

async function loadData() {
  loading.value = true
  try {
    const [agentsData, packagesData] = await Promise.all([
      agentsApi.getAll(),
      packagesApi.getAll()
    ])
    agents.value = agentsData || []
    packages.value = packagesData || []
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

function getPackageName(packageId) {
  const pkg = packages.value.find(p => p.id === packageId)
  return pkg ? pkg.name : '未配置'
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

function openAddDialog() {
  isEditing.value = false
  formData.value = {
    id: '',
    name: '',
    code: '',
    icon: '',
    description: '',
    status: 1,
    sort: 0,
    packageIds: [],
    difyApiUrl: '',
    difyApiKey: '',
    difyChatUrl: '/chat-messages',
    difyFileUrl: '/files/upload'
  }
  dialogVisible.value = true
}

function openEditDialog(agent) {
  isEditing.value = true
  formData.value = {
    id: agent.id,
    name: agent.name || '',
    code: agent.code || '',
    icon: agent.icon || '',
    description: agent.description || '',
    status: agent.status ?? 1,
    sort: agent.sort || 0,
    packageIds: agent.packageIds || [],
    difyApiUrl: agent.difyApiUrl || '',
    difyApiKey: agent.difyApiKey || '',
    difyChatUrl: agent.difyChatUrl || '/chat-messages',
    difyFileUrl: agent.difyFileUrl || '/files/upload'
  }
  dialogVisible.value = true
}

async function handleSave() {
  if (!formData.value.name || !formData.value.code) {
    ElMessage.warning('请填写名称和代码')
    return
  }
  try {
    if (isEditing.value) {
      await agentsApi.update(formData.value.id, formData.value)
      ElMessage.success('更新成功')
    } else {
      await agentsApi.create(formData.value)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error(isEditing.value ? '更新失败' : '创建失败')
  }
}

async function handleDelete(agent) {
  try {
    await ElMessageBox.confirm('确定要删除这个智能体吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await agentsApi.delete(agent.id)
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
  <div class="agent-manager" v-loading="loading">
    <div class="tool-bar">
      <el-button type="primary" @click="openAddDialog">新增智能体</el-button>
    </div>

    <el-table :data="agents" stripe style="width: 100%">
      <el-table-column label="名称" width="180">
        <template #default="{ row }">
          <span class="agent-name">
            <span class="agent-icon">{{ row.icon }}</span>
            {{ row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="代码" width="100" />
      <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
      <el-table-column label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="70" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="primary" size="small" link @click="openEditDialog(row)">编辑</el-button>
          <el-button type="danger" size="small" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="isEditing ? '编辑智能体' : '新增智能体'" width="550px" :close-on-click-modal="false">
      <el-form :model="formData" label-width="90px" class="compact-form">
        <el-form-item label="名称" required>
          <el-input v-model="formData.name" placeholder="智能体名称" />
        </el-form-item>
        <el-form-item label="代码" required>
          <el-input v-model="formData.code" placeholder="智能体代码" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="formData.icon" placeholder="图标emoji" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.description" type="textarea" :rows="2" placeholder="描述" />
        </el-form-item>
        <el-form-item label="Dify API">
          <el-input v-model="formData.difyApiUrl" placeholder="Dify API地址" />
        </el-form-item>
        <el-form-item label="Dify Key">
          <el-input v-model="formData.difyApiKey" placeholder="Dify API Key" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="formData.sort" :min="0" size="small" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status" size="small">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="default" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" size="default" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.agent-manager {
  padding: 16px;
}

.tool-bar {
  margin-bottom: 12px;
}

.agent-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.agent-icon {
  font-size: 18px;
}

.compact-form :deep(.el-form-item) {
  margin-bottom: 14px;
}

.compact-form :deep(.el-form-item__label) {
  font-size: 0.85rem;
  padding-right: 8px;
}
</style>
