<script setup>
import { ref, onMounted } from 'vue'
import { packagesApi, agentsApi } from '../../api'
import { ElMessage, ElMessageBox } from 'element-plus'

const packages = ref([])
const agents = ref([])
const loading = ref(true)
const dialogVisible = ref(false)
const isEditing = ref(false)
const formData = ref({
  id: '',
  name: '',
  code: '',
  description: '',
  tokenLimit: 0,
  agentIds: [],
  sort: 0,
  status: 'active',
  prices: {
    monthly: 0,
    quarterly: 0,
    yearly: 0
  }
})

defineOptions({
  name: 'PackageManager'
})

async function loadData() {
  loading.value = true
  try {
    const [packagesData, agentsData] = await Promise.all([
      packagesApi.getAll(),
      agentsApi.getAll()
    ])
    packages.value = packagesData || []
    agents.value = agentsData || []
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

function getAgentNames(agentIds) {
  if (!agentIds || !agentIds.length) return '无'
  return agentIds.map(id => {
    const agent = agents.value.find(a => a.id === id)
    return agent ? `${agent.icon || ''} ${agent.name}`.trim() : id
  }).join('、')
}

function formatPrice(price) {
  if (!price && price !== 0) return '-'
  return price === 0 ? '免费' : `¥${price}`
}

function formatTokenLimit(limit) {
  if (limit === -1) return '无限'
  if (!limit) return '-'
  return limit.toLocaleString()
}

function openAddDialog() {
  isEditing.value = false
  formData.value = {
    id: '',
    name: '',
    code: '',
    description: '',
    tokenLimit: 0,
    agentIds: [],
    sort: 0,
    status: 'active',
    prices: {
      monthly: 0,
      quarterly: 0,
      yearly: 0
    }
  }
  dialogVisible.value = true
}

function openEditDialog(pkg) {
  isEditing.value = true
  formData.value = {
    id: pkg.id,
    name: pkg.name,
    code: pkg.code,
    description: pkg.description || '',
    tokenLimit: pkg.tokenLimit,
    agentIds: pkg.agentIds || pkg.featureIds || [],
    sort: pkg.sort || 0,
    status: pkg.status,
    prices: {
      monthly: pkg.prices?.monthly || 0,
      quarterly: pkg.prices?.quarterly || 0,
      yearly: pkg.prices?.yearly || 0
    }
  }
  dialogVisible.value = true
}

async function handleSave() {
  if (!formData.value.name || !formData.value.code) {
    ElMessage.warning('请填写套餐名称和代码')
    return
  }
  try {
    if (isEditing.value) {
      await packagesApi.update(formData.value.id, formData.value)
      ElMessage.success('更新成功')
    } else {
      await packagesApi.create(formData.value)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error(isEditing.value ? '更新失败' : '创建失败')
  }
}

async function handleDelete(pkg) {
  try {
    await ElMessageBox.confirm('确定要删除这个套餐吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await packagesApi.delete(pkg.id)
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
  <div class="package-manager" v-loading="loading">
    <div class="tool-bar">
      <el-button type="primary" @click="openAddDialog">新增套餐</el-button>
    </div>

    <el-table :data="packages" stripe style="width: 100%">
      <el-table-column prop="name" label="套餐名称" width="120">
        <template #default="{ row }">
          <div class="package-name">
            <span class="name-text">{{ row.name }}</span>
            <el-tag v-if="row.isDefault" size="small" type="info">默认</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="代码" width="90">
        <template #default="{ row }">
          <span class="code-tag">{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="月价" width="80">
        <template #default="{ row }">
          <span class="price">{{ formatPrice(row.prices?.monthly) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="季价" width="80">
        <template #default="{ row }">
          <span class="price">{{ formatPrice(row.prices?.quarterly) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年价" width="80">
        <template #default="{ row }">
          <span class="price">{{ formatPrice(row.prices?.yearly) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Token" width="100">
        <template #default="{ row }">
          <span class="token-limit">{{ formatTokenLimit(row.tokenLimit) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="智能体" min-width="200">
        <template #default="{ row }">
          <div class="agent-tags">
            <el-tag
              v-for="(name, idx) in getAgentNames(row.agentIds || row.featureIds || []).split('、')"
              :key="idx"
              size="small"
              type="info"
            >{{ name }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="60" align="center" />
      <el-table-column label="状态" width="70" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
            {{ row.status === 'active' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" link @click="openEditDialog(row)">编辑</el-button>
          <el-button type="danger" size="small" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="isEditing ? '编辑套餐' : '新增套餐'" width="720px" :close-on-click-modal="false" :lock-scroll="false">
      <el-form :model="formData" label-width="80px" class="compact-form">
        <el-form-item label="名称" required>
          <el-input v-model="formData.name" placeholder="套餐名称" />
        </el-form-item>
        <el-form-item label="代码" required>
          <el-input v-model="formData.code" placeholder="套餐代码" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.description" type="textarea" :rows="2" placeholder="描述" />
        </el-form-item>
        <div class="price-section">
          <div class="price-item">
            <label class="price-label">月价</label>
            <el-input-number v-model="formData.prices.monthly" :min="0" size="default" placeholder="月价" />
          </div>
          <div class="price-item">
            <label class="price-label">季价</label>
            <el-input-number v-model="formData.prices.quarterly" :min="0" size="default" placeholder="季价" />
          </div>
          <div class="price-item">
            <label class="price-label">年价</label>
            <el-input-number v-model="formData.prices.yearly" :min="0" size="default" placeholder="年价" />
          </div>
        </div>
        <el-form-item label="Token" class="token-form-item">
          <el-input-number v-model="formData.tokenLimit" :min="-1" size="small" />
          <span class="form-tip">-1表示无限</span>
        </el-form-item>
        <el-form-item label="智能体" class="agent-form-item">
          <el-checkbox-group v-model="formData.agentIds" size="small">
            <el-checkbox-button
              v-for="agent in agents"
              :key="agent.id"
              :value="agent.id"
            >
              {{ agent.icon }} {{ agent.name }}
            </el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="formData.sort" :min="0" size="small" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status" size="small">
            <el-radio value="active">启用</el-radio>
            <el-radio value="inactive">禁用</el-radio>
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
.package-manager {
  padding: 16px;
}

.tool-bar {
  margin-bottom: 12px;
}

.package-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.name-text {
  font-weight: 500;
  color: var(--color-text-primary);
}

.code-tag {
  padding: 2px 8px;
  background: var(--color-bg-secondary);
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.price {
  font-weight: 600;
  color: var(--color-primary);
}

.token-limit {
  color: var(--color-text-secondary);
  font-size: 0.85rem;
}

.agent-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.agent-tags :deep(.el-tag) {
  margin-right: 0;
}

.compact-form :deep(.el-form-item) {
  margin-bottom: 14px;
}

.compact-form :deep(.el-form-item__label) {
  font-size: 0.85rem;
  padding-right: 8px;
}

.compact-form :deep(.el-input__inner) {
  font-size: 0.85rem;
}

/* 价格输入区域 */
.price-section {
  display: flex;
  gap: 16px;
  margin-bottom: 18px;
  padding-left: 80px;
}

.price-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.price-label {
  font-size: 0.85rem;
  color: var(--color-text-regular);
  padding-left: 2px;
}

.price-item :deep(.el-input-number) {
  width: 100%;
}

.token-form-item :deep(.el-input-number) {
  width: 160px;
}

.form-tip {
  margin-left: 12px;
  color: #909399;
  font-size: 0.8rem;
}

.agent-form-item :deep(.el-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.agent-form-item :deep(.el-checkbox-button) {
  margin-right: 0;
}

.agent-form-item :deep(.el-checkbox-button__inner) {
  padding: 6px 12px;
  font-size: 0.85rem;
  border-radius: 4px;
}
</style>
