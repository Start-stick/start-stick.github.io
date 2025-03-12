<script setup>
import { ref, onMounted } from 'vue'
import { School, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ClassCard from '@/components/class/ClassCard.vue'
import { useMyClassStore } from '@/stores/myclass'

// 班级列表数据
const myClassStore = useMyClassStore()

// const classList = ref(myClassStore.classList)

// 创建班级对话框
const dialogVisible = ref(false)
const dialogTitle = ref('创建班级')
const isEdit = ref(false)
const editClass=ref(null)

// 班级表单数据
const classForm = ref({
  className: '', // 班级名称
  classCode: '', // 班级代码
  classAvatar: null, // 班级头像
  subject: '',
})

// 表单校验规则
const rules = {
  className: [
    { required: true, message: '请输入班级名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  classCode: [
    { required: true, message: '请输入班级代码', trigger: 'blur' },
    { pattern: /^[A-Za-z0-9]{4,8}$/, message: '4-8位字母数字组合', trigger: 'blur' }
  ],
  subject: [
    { required: true, message: '请选择科目', trigger: 'change' }
  ]
}

// 科目选项
const subjectOptions = [
  { value: 'chinese', label: '语文' },
  { value: 'math', label: '数学' },
  { value: 'english', label: '英语' },
  { value: 'programming', label: '编程' },
  // ... 其他科目
]

// 头像相关
const avatarUrl = ref('')
const handleAvatarChange = (file) => {
    console.log('点击更换头像');
    
    console.log(file.target.files[0]);
    
  // 这里可以处理头像上传
  avatarUrl.value = URL.createObjectURL(file.target.files[0])
  classForm.value.classAvatar = URL.createObjectURL(file.target.files[0])
}



// 提交表单
const formRef = ref(null)
// 打开创建班级对话框
const avatarInput = ref(null)
const handleCreate = () => {
  dialogVisible.value = true
  isEdit.value = false
  dialogTitle.value = '创建班级'
  classForm.value = {
    className: '',
    classCode: '',
    classAvatar: null,
    subject: '',
  }
  avatarUrl.value = ''
  if(avatarInput.value) avatarInput.value.value = ''
}
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      // TODO: 调用创建/更新班级的API
      const newClass = {
        ...classForm.value,
        id: Date.now(),
        studentCount: 0
      }
      
      if (isEdit.value) {
        // 更新班级
        // const index = myClassStore.classList.value.findIndex(c => c.id === editClass.value.id)
        if (myClassStore.findClass(editClass.value.id)) {
          myClassStore.updateClass(editClass.value.id,newClass)
          ElMessage.success('更新成功')
        }
      } else {
        // 创建班级
        myClassStore.addClass(newClass)
        ElMessage.success('创建成功')
      }
      
      dialogVisible.value = false
    }
  })
}

// 编辑班级
const handleEdit = (row) => {
  dialogVisible.value = true
  isEdit.value = true
  editClass.value=row
  dialogTitle.value = '编辑班级'
  avatarUrl.value= row.classAvatar
  
  classForm.value = { ...row }
}

// 删除班级
const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该班级吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    if (myClassStore.findClass(row.id)) {
      myClassStore.deleteClass(row.id)
      ElMessage.success('删除成功')
    }
  })
}

// 初始化示例数据
onMounted(() => {
})
</script>

<template>
  <div class="class-container">
    <!-- 顶部操作栏 -->
    <div class="header">
      <div class="title">
        <el-icon><School /></el-icon>
        <h2>班级管理</h2>
      </div>
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        创建班级
      </el-button>
    </div>

    <!-- 班级列表 -->
    <div class="class-list">
      <div class="class-cards">
        <div v-for="item in myClassStore.classList" :key="item.id">
          <ClassCard
            :classInfo="item"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>
      </div>
    </div>

    <!-- 创建班级对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="440px"
      :close-on-click-modal="false"
      :show-close="true"
      class="class-dialog"
    >
      <el-form
        ref="formRef"
        :model="classForm"
        :rules="rules"
        label-position="top"
        class="class-form"
      >
        <!-- 班级名称 -->
        <el-form-item 
          label="班级名称" 
          prop="className"
        >
          <el-input 
            v-model="classForm.className"
            placeholder="例如：数学1班"
          />
        </el-form-item>

        <!-- 班级代码 -->
        <el-form-item 
          label="课程代码" 
          prop="classCode"
        >
          <el-input 
            v-model="classForm.classCode"
            placeholder="4-8位字母数字组合，例如：MATH01"
          />
        </el-form-item>

        <!-- 班级头像 -->
        <el-form-item label="班级头像">
          <div class="avatar-upload">
            <el-avatar 
              :size="80" 
              :src="avatarUrl" 
              class="class-avatar"
            >
              <img src="@/assets/default-avatar.jpg" alt="default"/>
            </el-avatar>
            <el-button 
              type="primary" 
              plain
              class="change-avatar-btn"
              @click="$refs.avatarInput.click()"
            >
              更改
            </el-button>
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              style="display: none"
              @click="console.log('点击了')"
              @change="handleAvatarChange"
            >
          </div>
        </el-form-item>

        <el-form-item label="科目" prop="subject">
          <el-select v-model="classForm.subject" placeholder="请选择科目" class="w-full">
            <el-option
              v-for="item in subjectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 对话框底部按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.class-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.class-list {
  margin-top: 20px;
}

.class-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.class-dialog {
  :deep(.el-dialog) {
    height: 460px;
    margin-top: 15vh !important;
    border-radius: 8px;
  }
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 16px 24px;
  text-align: left;
  border-bottom: 1px solid #ebeef5;
  height: 56px;
  box-sizing: border-box;
}

:deep(.el-dialog__title) {
  font-size: 16px;
  color: #303133;
  font-weight: 500;
}

:deep(.el-dialog__body) {
  padding: 24px;
  height: calc(460px - 56px - 56px);
}

.class-form {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-form-item__label) {
  margin-bottom: 4px;
  color: #606266;
  font-size: 14px;
  line-height: 20px;
}

.avatar-upload {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0;
}

.class-avatar {
  border: 1px dashed #dcdfe6;
  background-color: #f5f7fa;
  width: 64px;
  height: 64px;
}

.change-avatar-btn {
  height: 30px;
  padding: 6px 12px;
}

:deep(.el-input__wrapper) {
  height: 32px;
  padding: 0 12px 0 16px;
}

:deep(.el-textarea__inner) {
  min-height: 65px !important;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-select__wrapper) {
  height: 32px;
  padding: 0 12px 0 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 24px;
  border-top: 1px solid #ebeef5;
  margin: 0 -24px;
  height: 56px;
  box-sizing: border-box;
}

:deep(.el-button) {
  padding: 8px 20px;
  font-size: 14px;
  height: 32px;
  font-weight: 500;
  border-radius: 4px;
  
  &.el-button--primary {
    
    &:hover, &:focus {
      background-color: #627aff;
      border-color: #627aff;
    }
  }
}
</style> 