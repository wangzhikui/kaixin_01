<script setup>
import { ref, onMounted } from 'vue'
import { rolesApi, menusApi } from '../../api'
import { ElMessage, ElMessageBox } from 'element-plus'

const roles = ref([])
const menus = ref([])
const loading = ref(true)
const dialogVisible = ref(false)
const formData = ref({
  id: '',
  name: '',
  code: '',
  description: '',
  menuKeys: []
})

defineOptions({
  name: 'RoleManager'
})

async function loadData() {
  loading.value = true
  try {
    const [rolesData, menusData] = await Promise.all([
      rolesApi.getAll(),
      menusApi.getAll()
    ])
    roles.value = rolesData || []
    menus.value = menusData || []
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

function getMenuNames(menuKeys) {
  if (!menuKeys || !menuKeys.length) return '无'
  return menuKeys.map(key => {
    const menu = menus.value.find(m => m.key === key)
    return menu ? menu.title : key
  }).join('、')
}

function openEditDialog(role) {
  formData.value = {
    id: role.id,
    name: role.name || '',
    code: role.code || '',
    description: role.description || '',
    menuKeys: [...(role.menuKeys || [])]
  }
  dialogVisible.value = true
}

async function handleSave() {
  if (!formData.value.name || !formData.value.code) {
    ElMessage.warning('请填写角色名称和代码')
    return
  }
  try {
    await rolesApi.update(formData.value.id, {
      name: formData.value.name,
      code: formData.value.code,
      description: formData.value.description,
      menuKeys: formData.value.menuKeys,
      isSystem: false
    })
    ElMessage.success('更新成功')
    dialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

function handleMenuChange(checkedKeys) {
  formData.value.menuKeys = checkedKeys
}

async function handleDelete(role) {
  if (role.code === 'admin') {
    ElMessage.warning('不能删除管理员角色')
    return
  }
  try {
    await ElMessageBox.confirm('确定要删除这个角色吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await rolesApi.delete(role.id)
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
  <div class="role-manager" v-loading="loading">
    <el-table :data="roles" stripe style="width: 100%">
      <el-table-column prop="name" label="角色名称" width="150" />
      <el-table-column prop="code" label="角色代码" width="120" />
      <el-table-column prop="description" label="描述" min-width="200" />
      <el-table-column label="菜单权限" min-width="300">
        <template #default="{ row }">
          <span class="menu-names">{{ getMenuNames(row.menuKeys) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="primary" size="small" link @click="openEditDialog(row)">编辑</el-button>
          <el-button
            type="danger"
            size="small"
            link
            :disabled="row.code === 'admin'"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="编辑角色权限" width="500px" :close-on-click-modal="false">
      <el-form :model="formData" label-width="80px" class="compact-form">
        <el-form-item label="角色名称">
          <el-input v-model="formData.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="角色代码">
          <el-input v-model="formData.code" placeholder="角色代码" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.description" type="textarea" :rows="2" placeholder="描述" />
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-checkbox-group v-model="formData.menuKeys" @change="handleMenuChange">
            <el-checkbox
              v-for="menu in menus"
              :key="menu.key"
              :value="menu.key"
              :label="menu.key"
            >
              {{ menu.title }}
            </el-checkbox>
          </el-checkbox-group>
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
.role-manager {
  padding: 16px;
}

.menu-names {
  font-size: 0.875rem;
  color: #606266;
}

.compact-form :deep(.el-form-item) {
  margin-bottom: 14px;
}

.compact-form :deep(.el-checkbox-group) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
