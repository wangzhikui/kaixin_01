<script setup>
import { ref, onMounted, computed } from 'vue'
import { subscriptionsApi, packagesApi, membersApi } from '../../api'
import { ElMessage, ElMessageBox } from 'element-plus'

const subscriptions = ref([])
const packages = ref([])
const members = ref([])
const loading = ref(true)

defineOptions({
  name: 'SubscriptionManager'
})

async function loadData() {
  loading.value = true
  try {
    const [subscriptionsData, packagesData, membersData] = await Promise.all([
      subscriptionsApi.getAll(),
      packagesApi.getAll(),
      membersApi.getAll()
    ])
    subscriptions.value = subscriptionsData || []
    packages.value = packagesData || []
    members.value = membersData || []
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

// 过滤出有有效会员的订阅
const validSubscriptions = computed(() => {
  return subscriptions.value.filter(sub => {
    const member = members.value.find(m => m.id === sub.userId)
    return member && member.phone && member.phone !== '未知' && member.phone.trim() !== ''
  })
})

// 删除无效订阅
async function deleteInvalidSubscriptions() {
  const invalid = subscriptions.value.filter(sub => {
    const member = members.value.find(m => m.id === sub.userId)
    return !member || !member.phone || member.phone === '未知' || member.phone.trim() === ''
  })

  if (invalid.length === 0) {
    ElMessage.info('没有需要清理的数据')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除 ${invalid.length} 条无效订阅记录吗？`,
      '确认清理',
      { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' }
    )

    for (const sub of invalid) {
      await subscriptionsApi.delete(sub.id)
    }
    subscriptions.value = validSubscriptions.value
    ElMessage.success(`已删除 ${invalid.length} 条无效订阅`)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('清理失败')
    }
  }
}

function getPackageName(packageId) {
  const pkg = packages.value.find(p => p.id === packageId)
  return pkg ? pkg.name : '未知'
}

function getMemberName(userId) {
  const member = members.value.find(m => m.id === userId)
  return member ? (member.name || member.nickname || '未知') : '未知'
}

function getMemberPhone(userId) {
  const member = members.value.find(m => m.id === userId)
  return member ? (member.phone || '-') : '-'
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}
</script>

<template>
  <div class="subscription-manager" v-loading="loading">
    <div class="tool-bar">
      <span class="result-info">共 {{ validSubscriptions.length }} 条有效订阅</span>
      <el-button type="danger" plain size="small" @click="deleteInvalidSubscriptions">
        清理无效订阅
      </el-button>
    </div>

    <el-table :data="validSubscriptions" stripe style="width: 100%">
      <el-table-column label="会员" width="150">
        <template #default="{ row }">
          <div>
            <div>{{ getMemberName(row.userId) }}</div>
            <div class="phone">{{ getMemberPhone(row.userId) }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="套餐" width="120">
        <template #default="{ row }">
          <el-tag type="success">{{ getPackageName(row.packageId) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status === 'active' ? '生效中' : '已过期' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="150">
        <template #default="{ row }">
          {{ formatDate(row.startTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="150">
        <template #default="{ row }">
          {{ formatDate(row.endTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="150">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.subscription-manager {
  padding: 16px;
}

.tool-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.result-info {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.phone {
  font-size: 0.75rem;
  color: #909399;
}
</style>
