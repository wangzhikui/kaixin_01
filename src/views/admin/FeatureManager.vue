<script setup>
import { ref, onMounted } from 'vue'
import { featuresApi } from '../../api'
import { ElMessage, ElMessageBox } from 'element-plus'

const features = ref([])
const loading = ref(true)
const dialogVisible = ref(false)
const isEditing = ref(false)
const formData = ref({
  id: '',
  name: '',
  code: '',
  sort: 0,
  status: 'active'
})

defineOptions({
  name: 'FeatureManager'
})

async function loadData() {
  loading.value = true
  try {
    const data = await featuresApi.getAll()
    features.value = data || []
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

function openAddDialog() {
  isEditing.value = false
  formData.value = {
    id: '',
    name: '',
    code: '',
    sort: 0,
    status: 'active'
  }
  dialogVisible.value = true
}

function openEditDialog(feature) {
  isEditing.value = true
  formData.value = {
    id: feature.id,
    name: feature.name,
    code: feature.code,
    sort: feature.sort || 0,
    status: feature.status
  }
  dialogVisible.value = true
}

async function handleSave() {
  if (!formData.value.name || !formData.value.code) {
    ElMessage.warning('请填写功能名称和代码')
    return
  }
  try {
    if (isEditing.value) {
      await featuresApi.update(formData.value.id, formData.value)
      ElMessage.success('更新成功')
    } else {
      await featuresApi.create(formData.value)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error(isEditing.value ? '更新失败' : '创建失败')
  }
}

async function handleDelete(feature) {
  try {
    await ElMessageBox.confirm('确定要删除这个功能吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await featuresApi.delete(feature.id)
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
  <div class="feature-manager" v-loading="loading">
    <div class="tool-bar">
      <el-button type="primary" @click="openAddDialog">新增功能</el-button>
    </div>

    <el-table :data="features" stripe style="width: 100%">
      <el-table-column prop="name" label="功能名称" min-width="200" />
      <el-table-column prop="code" label="功能代码" width="200" />
      <el-table-column prop="sort" label="排序" width="100" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status === 'active' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="primary" size="small" link @click="openEditDialog(row)">编辑</el-button>
          <el-button type="danger" size="small" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="isEditing ? '编辑功能' : '新增功能'" width="420px" :close-on-click-modal="false">
      <el-form :model="formData" label-width="80px" class="compact-form">
        <el-form-item label="名称" required>
          <el-input v-model="formData.name" placeholder="功能名称" />
        </el-form-item>
        <el-form-item label="代码" required>
          <el-input v-model="formData.code" placeholder="功能代码" />
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
.feature-manager {
  padding: 16px;
}

.tool-bar {
  margin-bottom: 12px;
}

.compact-form :deep(.el-form-item) {
  margin-bottom: 14px;
}

.compact-form :deep(.el-form-item__label) {
  font-size: 0.85rem;
  padding-right: 8px;
}
</style>
