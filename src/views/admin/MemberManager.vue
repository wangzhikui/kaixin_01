<script setup>
import { ref, onMounted } from 'vue'
import { membersApi, packagesApi } from '../../api'
import { ElMessage, ElMessageBox } from 'element-plus'

const members = ref([])
const packages = ref([])
const loading = ref(true)
const dialogVisible = ref(false)
const formData = ref({
  id: '',
  phone: '',
  nickname: '',
  email: '',
  wechat: '',
  packageId: '',
  tokenUsed: 0,
  status: 'active'
})

defineOptions({
  name: 'MemberManager'
})

async function loadData() {
  loading.value = true
  try {
    const [membersData, packagesData] = await Promise.all([
      membersApi.getAll(),
      packagesApi.getAll()
    ])
    members.value = membersData || []
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
  return pkg ? pkg.name : '未知'
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function openEditDialog(member) {
  formData.value = {
    id: member.id,
    phone: member.phone || '',
    nickname: member.nickname || '',
    email: member.email || '',
    wechat: member.wechat || '',
    packageId: member.packageId || '',
    tokenUsed: member.tokenUsed || 0,
    status: member.status || 'active'
  }
  dialogVisible.value = true
}

async function handleSave() {
  if (!formData.value.phone) {
    ElMessage.warning('请填写手机号')
    return
  }
  try {
    await membersApi.update(formData.value.id, {
      phone: formData.value.phone,
      nickname: formData.value.nickname,
      email: formData.value.email,
      wechat: formData.value.wechat,
      packageId: formData.value.packageId,
      tokenUsed: formData.value.tokenUsed,
      status: formData.value.status
    })
    ElMessage.success('更新成功')
    dialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

async function handleDelete(member) {
  try {
    await ElMessageBox.confirm('确定要删除这个会员吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await membersApi.delete(member.id)
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
  <div class="member-manager" v-loading="loading">
    <el-table :data="members" stripe border style="width: 100%">
      <el-table-column prop="phone" label="手机号" width="130" />
      <el-table-column prop="nickname" label="昵称" width="100" />
      <el-table-column prop="email" label="邮箱" min-width="160" />
      <el-table-column prop="wechat" label="微信" width="120" />
      <el-table-column label="套餐" width="100">
        <template #default="{ row }">
          {{ getPackageName(row.packageId) }}
        </template>
      </el-table-column>
      <el-table-column label="已用Token" width="100">
        <template #default="{ row }">
          {{ row.tokenUsed || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="70">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
            {{ row.status === 'active' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button type="primary" size="small" link @click="openEditDialog(row)">编辑</el-button>
          <el-button type="danger" size="small" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="编辑会员" width="500px" :close-on-click-modal="false">
      <el-form :model="formData" label-width="80px" class="compact-form">
        <el-form-item label="手机号" required>
          <el-input v-model="formData.phone" placeholder="手机号" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="formData.nickname" placeholder="昵称" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="微信">
          <el-input v-model="formData.wechat" placeholder="微信" />
        </el-form-item>
        <el-form-item label="套餐">
          <el-select v-model="formData.packageId" placeholder="选择套餐" style="width: 100%">
            <el-option
              v-for="pkg in packages"
              :key="pkg.id"
              :label="pkg.name"
              :value="pkg.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="已用Token">
          <el-input-number v-model="formData.tokenUsed" :min="0" size="small" />
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
.member-manager {
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
