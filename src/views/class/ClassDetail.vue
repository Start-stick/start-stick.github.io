<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, UserFilled, Plus, Document, CopyDocument, VideoPlay, Timer, Edit, Bell, User, Reading, Collection } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useMyClassStore } from '@/stores/myclass'

const router = useRouter()
const route = useRoute()
const myClassStore = useMyClassStore()

// 获取课程ID并转换为数字类型
const classId = ref(Number(route.query.classId))

// 班级信息
const classInfo = ref(null)

// 返回上一页
const handleBack = () => {
  router.push('/layout/myclass')
}

// 当前激活的标签页
const activeTab = ref('students')

// 加载课程信息
const loadClassInfo = () => {
  if (classId.value) {
    const info = myClassStore.findClass(classId.value)
    if (info) {
      classInfo.value = info
    } else {
      ElMessage.error('未找到班级信息')
      router.push('/layout/myclass')
    }
  }
}

// 组件挂载时加载数据
onMounted(() => {
  if (!classId.value) {
    // 如果没有ID参数，返回列表页
    router.push('/layout/myclass')
    return
  }
  loadClassInfo()
})

// 学生列表
const students = ref([])

// 复制文本
const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('复制成功')
  } catch (err) {
    ElMessage.error('复制失败')
  }
}

// 添加学生对话框
const addStudentDialogVisible = ref(false)

// 打开添加学生对话框
const handleAddStudent = () => {
  addStudentDialogVisible.value = true
}

// 学生表单数据
const studentForm = ref([
  { firstName: '', lastName: '', username: '', password: '' }
])

// 添加一行
const addRow = () => {
  studentForm.value.push({ firstName: '', lastName: '', username: '', password: '' })
}

// 提交学生数据
const handleAddStudents = () => {
  // TODO: 处理添加学生的逻辑
  addStudentDialogVisible.value = false
}

// 进入课堂模式
const handleStartClass = () => {
  if (classInfo.value) {
    window.open(`/classbegin?classId=${classInfo.value.id}`)
  }
}

// 活动列表
const activities = [
  {
    icon: Timer,
    name: '签到',
    type: 'signin',
    desc: '记录学生出勤情况'
  },
  {
    icon: User,
    name: '选人',
    type: 'select',
    desc: '随机选择学生'
  },
  {
    icon: Edit,
    name: '作业',
    type: 'homework',
    desc: '发布课堂作业'
  },
  {
    icon: Bell,
    name: '抢答',
    type: 'answer',
    desc: '课堂互动抢答'
  },
  {
    icon: Collection,
    name: '考试',
    type: 'exam',
    desc: '发布在线考试'
  },
  {
    icon: Reading,
    name: '资料',
    type: 'material',
    desc: '课堂学习资料'
  }
]

// 处理活动点击
const handleActivityClick = (type) => {
  switch(type) {
    case 'signin':
      ElMessage.info('开始签到')
      break
    case 'select':
      ElMessage.info('开始随机选人')
      break
    case 'homework':
      activeTab.value = 'assignments'
      break
    case 'answer':
      ElMessage.info('开始抢答')
      break
    case 'exam':
      activeTab.value = 'exams'
      break
    case 'material':
      activeTab.value = 'courseware'
      break
  }
}
</script>

<template>
  <div class="class-detail">
    <!-- 顶部返回栏 -->
    <div class="back-header">
      <el-button link @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
    </div>

    <!-- 班级基本信息 -->
    <div class="class-info">
      <div class="class-avatar">
        <el-avatar :size="80" class="avatar-icon">
          <template v-if="classInfo?.classAvatar">
            <img :src="classInfo.classAvatar" alt="avatar" />
          </template>
          <template v-else>
            <el-icon><Document /></el-icon>
          </template>
        </el-avatar>
      </div>
      <div class="info-content">
        <div class="info-header">
          <h1>{{ classInfo?.className }}</h1>
          <el-button 
            type="primary" 
            class="start-class-btn"
            @click="handleStartClass"
          >
            <el-icon><VideoPlay /></el-icon>
            开始上课
          </el-button>
        </div>
        <div class="info-stats">
          <span>{{ classInfo?.studentCount }} 学生</span>
          <span>课程代码：{{ classInfo?.classCode }}</span>
          <span>科目：{{ classInfo?.subject }}</span>
        </div>
      </div>
    </div>

    <!-- 标签页 -->
    <el-tabs v-model="activeTab" class="class-tabs">
      <el-tab-pane name="students" label="学生">
        <div class="tab-header">
          <div class="tab-title">
            <el-icon><UserFilled /></el-icon>
            <span>学生 ({{ students.length }})</span>
          </div>
          <el-button type="primary" @click="handleAddStudent">
            <el-icon><Plus /></el-icon>
            添加学生
          </el-button>
        </div>
        
        <!-- 无学生时的提示 -->
        <div v-if="!students.length" class="no-data">
          <p>无学生报名</p>
          <p class="tip">分享班级加入链接和学生加入码，并要求学生加入。</p>
          
          <!-- 加入链接和代码 -->
          <div class="join-info">
            <div class="join-item">
              <div class="join-label">班级加入链接</div>
              <div class="join-value">
                <el-input
                  :value="`https://frm.tv/join/${classInfo?.id}`"   
                  readonly
                >
                  <template #append>
                    <el-button @click="copyText(`https://frm.tv/join/${classInfo?.id}`)">
                      <el-icon><CopyDocument /></el-icon>
                    </el-button>
                  </template>
                </el-input>
              </div>
            </div>
            
            <div class="join-item">
              <div class="join-label">学生加入码</div>
              <div class="join-value">
                <el-input
                  :value="classInfo?.id"
                  readonly
                >
                  <template #append>
                    <el-button @click="copyText(classInfo?.id)">
                      <el-icon><CopyDocument /></el-icon>
                    </el-button>
                  </template>
                </el-input>
              </div>
            </div>
          </div>
        </div>

        <!-- 学生列表 -->
        <div v-else class="student-list">
          <!-- 学生列表内容 -->
        </div>
      </el-tab-pane>

      <el-tab-pane name="groupings" label="分组">
        分组内容
      </el-tab-pane>

      <el-tab-pane name="activities" label="活动">
        <div class="activities-container">
          <div class="activities-grid">
            <div 
              v-for="activity in activities" 
              :key="activity.type"
              class="activity-card"
              @click="handleActivityClick(activity.type)"
            >
              <el-icon>
                <component :is="activity.icon" />
              </el-icon>
              <h3>{{ activity.name }}</h3>
              <p>{{ activity.desc }}</p>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加学生对话框 -->
    <el-dialog
      v-model="addStudentDialogVisible"
      :title="`添加学生到 ${classInfo?.className || ''}`"
      width="800px"
      :close-on-click-modal="false"
      class="add-student-dialog"
    >
      <div class="join-section">
        <div class="join-item">
          <div class="join-title">Class Join Link 班级加入链接</div>
          <el-input
            :value="`https://frm.tv/join/${classInfo.classCode}`"
            readonly
          >
            <template #append>
              <el-button @click="copyText(`https://frm.tv/join/${classInfo.classCode}`)">
                <el-icon><CopyDocument /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
        
        <div class="join-divider">
          <span>or 或者</span>
        </div>
        
        <div class="join-item">
          <div class="join-title">Student Join Code 学生加入码</div>
          <el-input
            :value="classInfo.classCode"
            readonly
          >
            <template #append>
              <el-button @click="copyText(classInfo.classCode)">
                <el-icon><CopyDocument /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
      </div>
      
      <div class="manual-section">
        <div class="section-title">
          Manually enter students or paste from a CSV below
          <br>
          手动输入学生或从下面的 CSV 粘贴
        </div>
        
        <div class="student-form">
          <div class="form-header">
            <div class="col">First Name 姓名</div>
            <div class="col">Last Name 姓氏</div>
            <div class="col">Username/Email 用户名/电子邮件地址</div>
            <div class="col">Password 密码</div>
          </div>
          
          <div 
            v-for="(student, index) in studentForm" 
            :key="index"
            class="form-row"
          >
            <div class="col">
              <el-input v-model="student.firstName" />
            </div>
            <div class="col">
              <el-input v-model="student.lastName" />
            </div>
            <div class="col">
              <el-input v-model="student.username" />
            </div>
            <div class="col">
              <el-input v-model="student.password" />
            </div>
          </div>
        </div>
        
        <el-button @click="addRow" class="add-row-btn">
          <el-icon><Plus /></el-icon>
          添加一行
        </el-button>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addStudentDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddStudents">添加学生</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.class-detail {
  padding: 20px;
  min-height: 100%;
  background-color: #f5f7fa;
}

.back-header {
  margin-bottom: 20px;
}

.class-info {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  padding: 24px;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 20px;
}

.class-avatar {
  .avatar-icon {
    background-color: #f0f2ff;
    color: #4e6ef2;
  }
}

.info-content {
  h1 {
    margin: 0 0 12px;
    font-size: 24px;
    font-weight: 500;
    color: #1a1a1a;
  }
}

.info-stats {
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 14px;

  span {
    position: relative;
    
    &:not(:last-child)::after {
      content: '';
      position: absolute;
      right: -8px;
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
      height: 12px;
      background-color: #dcdfe6;
    }
  }
}

.class-tabs {
  background-color: white;
  border-radius: 8px;
  padding: 20px;

  :deep(.el-tabs__header) {
    margin-bottom: 24px;
  }
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tab-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
}

.no-data {
  text-align: center;
  padding: 40px 0;

  p {
    margin: 0;
    
    &.tip {
      color: #666;
      font-size: 14px;
      margin-top: 8px;
    }
  }
}

.join-info {
  max-width: 600px;
  margin: 24px auto 0;
}

.join-item {
  margin-bottom: 16px;

  .join-label {
    font-size: 14px;
    color: #606266;
    margin-bottom: 8px;
  }

  :deep(.el-input-group__append) {
    button {
      padding: 8px 16px;
    }
  }
}

.add-student-dialog {
  :deep(.el-dialog) {
    --el-dialog-padding-primary: 0;
  }
  
  :deep(.el-dialog__header) {
    padding: 20px 24px;
    margin: 0;
    border-bottom: 1px solid #ebeef5;
  }
  
  :deep(.el-dialog__body) {
    padding: 24px;
  }
  
  :deep(.el-dialog__footer) {
    padding: 16px 24px;
    border-top: 1px solid #ebeef5;
  }
}

.join-section {
  margin-bottom: 32px;
}

.join-item {
  margin-bottom: 16px;

  .join-title {
    font-size: 14px;
    color: #606266;
    margin-bottom: 8px;
  }
}

.join-divider {
  display: flex;
  align-items: center;
  margin: 24px 0;
  color: #909399;
  font-size: 14px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #dcdfe6;
  }

  span {
    padding: 0 16px;
  }
}

.manual-section {
  .section-title {
    font-size: 14px;
    color: #606266;
    margin-bottom: 16px;
    line-height: 1.6;
  }
}

.student-form {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-bottom: 16px;
}

.form-header {
  display: flex;
  padding: 12px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;
}

.form-row {
  display: flex;
  padding: 12px;
  
  &:not(:last-child) {
    border-bottom: 1px solid #dcdfe6;
  }
}

.col {
  flex: 1;
  padding: 0 8px;
  font-size: 14px;
  color: #606266;
}

.add-row-btn {
  width: 100%;
  margin-top: 8px;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  
  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 500;
    color: #1a1a1a;
  }
}

.start-class-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  
  .el-icon {
    font-size: 16px;
  }
}

.activities-container {
  padding: 20px 0;
}

.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.activity-card {
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;

  &:hover {
    background-color: #fff;
    border-color: #4e6ef2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
    .el-icon {
      transform: scale(1.1);
    }
  }

  .el-icon {
    font-size: 32px;
    color: #4e6ef2;
    margin-bottom: 16px;
    transition: transform 0.3s ease;
  }

  h3 {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 500;
    color: #1a1a1a;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #606266;
    line-height: 1.4;
  }
}

@media screen and (max-width: 768px) {
  .activities-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 