<script setup>
import { Edit, Delete, MoreFilled, Document } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 定义props
const props = defineProps({
  classInfo: {
    type: Object,
    required: true
  }
})
// 定义emit事件
const emit = defineEmits(['edit', 'delete'])

// 处理下拉菜单命令
const handleCommand = (command) => {
  switch (command) {
    case 'edit':
      emit('edit', props.classInfo)
      break
    case 'delete':
      emit('delete', props.classInfo)
      break
  }
}

// 处理卡片点击
const handleCardClick = (e) => {
  // 如果点击的是更多按钮或其子元素，不进行跳转
  if (e.target.closest('.actions')) {
    return
  }
  router.push({
    path: '/layout/classdetail',
    query: {classId: props.classInfo.id }
  })
}
</script>

<template>
  <el-card 
    class="class-card" 
    shadow="hover"
    @click="handleCardClick"
  >
    <div class="card-left">
      <el-avatar :size="48" class="class-icon">
        <el-avatar v-if="props.classInfo.classAvatar" :size="48" :src="props.classInfo.classAvatar" alt="class-avatar"/>
        <el-icon v-else><Document /></el-icon>
      </el-avatar>
    </div>
    <div class="card-right">
      <div class="card-header">
        <h3 class="class-title">{{ classInfo.className }}</h3>
        <el-dropdown 
          trigger="click" 
          @command="handleCommand"
          class="actions"
        >
          <div class="dropdown-trigger">
            <el-icon><MoreFilled /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="edit">
                <el-icon><Edit /></el-icon>
                <span>编辑</span>
              </el-dropdown-item>
              <el-dropdown-item command="delete" divided>
                <el-icon><Delete /></el-icon>
                <span>删除</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="card-content">
        <p class="participants">
          {{ classInfo.studentCount }} 名参与者 · 0 个分组
        </p>
        <p class="class-code">
          课程代码：{{ classInfo.classCode }}
        </p>
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.class-card {
  display: flex;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }
}

.card-left {
  margin-right: 16px;
}

.class-icon {
  background-color: #f0f2ff;
  color: #4e6ef2;
}

.card-right {
  flex: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.class-title {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  color: #1a1a1a;
}

.actions {
  color: #666;
}

.card-content {
  color: #757575;
  font-size: 14px;
}

.participants {
  margin: 0 0 8px;
}

.class-code {
  display: inline-block;
  background-color: #f0f2ff;
  color: #4e6ef2;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
}

:deep(.el-card__body) {
  padding: 0;
  width: 100%;
  display: flex;
}

.dropdown-trigger {
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s;
  
  &:hover {
    background-color: #f5f5f5;
  }
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
  
  .el-icon {
    margin-right: 0;
  }
  
  &:hover {
    color: #4e6ef2;
    background-color: #f0f2ff;
  }
}

:deep(.el-dropdown-menu__item--divided) {
  border-top-color: #ebeef5;
  
  &:hover {
    color: #f56c6c;
    background-color: #fef0f0;
  }
}
</style> 