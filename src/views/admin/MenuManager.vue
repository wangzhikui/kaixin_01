<script setup>
import { ref, onMounted } from 'vue'
import { menusApi } from '../../api'
import { ElMessage } from 'element-plus'

const menus = ref([])
const loading = ref(true)
const dialogVisible = ref(false)
const formData = ref({
  id: '',
  key: '',
  title: '',
  path: '',
  icon: '',
  sort: 0
})

defineOptions({
  name: 'MenuManager'
})

async function loadData() {
  loading.value = true
  try {
    const data = await menusApi.getAll()
    menus.value = (data || []).sort((a, b) => (a.sort || 0) - (b.sort || 0))
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

function openEditDialog(menu) {
  formData.value = {
    id: menu.id,
    key: menu.key || '',
    title: menu.title || '',
    path: menu.path || '',
    icon: menu.icon || '',
    sort: menu.sort || 0
  }
  dialogVisible.value = true
}

async function handleSave() {
  if (!formData.value.key || !formData.value.title) {
    ElMessage.warning('请填写Key和标题')
    return
  }
  try {
    await menusApi.update(formData.value.id, {
      key: formData.value.key,
      title: formData.value.title,
      path: formData.value.path,
      icon: formData.value.icon,
      sort: formData.value.sort
    })

    // Update localStorage adminUser menus to sync with sidebar
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}')
    if (adminUser && adminUser.menus) {
      const menuIndex = adminUser.menus.findIndex(m => m.key === formData.value.key)
      if (menuIndex >= 0) {
        adminUser.menus[menuIndex] = {
          ...adminUser.menus[menuIndex],
          key: formData.value.key,
          title: formData.value.title,
          path: formData.value.path,
          icon: formData.value.icon,
          sort: formData.value.sort
        }
        localStorage.setItem('adminUser', JSON.stringify(adminUser))
        // Dispatch custom event to notify AdminLayout
        window.dispatchEvent(new CustomEvent('menusUpdated', { detail: adminUser.menus }))
      }
    }

    ElMessage.success('更新成功')
    dialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error('更新失败')
  }
}
</script>

<template>
  <div class="menu-manager" v-loading="loading">
    <el-table :data="menus" stripe style="width: 100%">
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column prop="key" label="Key" width="150" />
      <el-table-column prop="title" label="标题" width="120" />
      <el-table-column prop="path" label="路径" min-width="180" />
      <el-table-column prop="icon" label="图标" width="120" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button type="primary" size="small" link @click="openEditDialog(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="编辑菜单" width="450px" :close-on-click-modal="false">
      <el-form :model="formData" label-width="80px" class="compact-form">
        <el-form-item label="Key" required>
          <el-input v-model="formData.key" placeholder="菜单Key" />
        </el-form-item>
        <el-form-item label="标题" required>
          <el-input v-model="formData.title" placeholder="菜单标题" />
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="formData.path" placeholder="菜单路径" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="formData.icon" placeholder="图标名称" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="formData.sort" :min="0" size="small" />
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
.menu-manager {
  padding: 16px;
}

.compact-form :deep(.el-form-item) {
  margin-bottom: 14px;
}

.compact-form :deep(.el-form-item__label) {
  font-size: 0.85rem;
  padding-right: 8px;
}
</style>
