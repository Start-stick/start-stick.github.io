<script setup>
import { ref } from 'vue'
import Editor from "@/components/Editor.vue"
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'

// 编辑器内容
const editorContent = ref('')

// 表单数据
const formData = ref({
  courseName: '',
  courseType: '',
  wordCount: 2000,
  requirements: ''
})

// 生成状态
const isGenerating = ref(false)

// 处理表单提交
const handleSubmit = async () => {
  try {
    isGenerating.value = true
    // 这里添加调用后端API的逻辑
    await new Promise(resolve => setTimeout(resolve, 2000)) // 模拟API调用
    editorContent.value = '这是生成的大纲内容...'
    ElMessage.success('生成成功')
  } catch (error) {
    console.error('Submit Error:', error)
    ElMessage.error('生成失败')
  } finally {
    isGenerating.value = false
  }
}

// 导出Word文档
const exportWord = () => {
  if (!editorContent.value) {
    ElMessage.warning('暂无内容可导出')
    return
  }
  const blob = new Blob([editorContent.value], { type: 'application/msword' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = '教学大纲.doc'
  link.click()
  URL.revokeObjectURL(link.href)
}

// 重新生成
const regenerate = () => {
  editorContent.value = ''
  handleSubmit()
}
</script>

<template>
  <div class="outline-container">
    <!-- 左侧编辑器区域 -->
    <div class="editor-section">
      <div class="editor-header">
        <div class="title">教学大纲</div>
        <div class="actions">
          <el-button type="primary" :icon="Download" @click="exportWord">
            导出文档
          </el-button>
        </div>
      </div>
      <div class="editor-content">
        <Editor  
        v-model="editorContent"  />
      </div>
    </div>

    <!-- 右侧表单区域 -->
    <div class="form-section">
      <el-form :model="formData" label-position="top" class="generate-form">
        <el-form-item label="课程名称">
          <el-input v-model="formData.courseName" placeholder="请输入课程名称" />
        </el-form-item>

        <el-form-item label="课程类型">
          <el-select v-model="formData.courseType" placeholder="请选择课程类型" class="w-full">
            <el-option label="必修课" value="required" />
            <el-option label="选修课" value="optional" />
          </el-select>
        </el-form-item>

        <el-form-item label="字数要求">
          <el-input-number v-model="formData.wordCount" :min="1000" :max="5000" :step="100" class="w-full" />
        </el-form-item>

        <el-form-item label="其他要求">
          <el-input v-model="formData.requirements" type="textarea" :rows="4" placeholder="请输入其他具体要求" />
        </el-form-item>

        <div class="form-actions">
          <el-button type="primary" :loading="isGenerating" @click="handleSubmit" class="submit-btn">
            {{ isGenerating ? '生成中...' : '开始生成' }}
          </el-button>
          <el-button v-if="editorContent" @click="regenerate" :disabled="isGenerating">
            重新生成
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.outline-container {
  display: flex;
  height: 100%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.editor-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e6e6e6;
  padding: 20px;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .title {
    font-size: 18px;
    font-weight: 500;
    color: #303133;
  }
}

.editor-content {
  flex: 1;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
}

.form-section {
  width: 320px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 0 8px 8px 0;
}

.generate-form {
  height: 100%;
  display: flex;
  flex-direction: column;

  :deep(.el-form-item) {
    margin-bottom: 20px;
  }

  .w-full {
    width: 100%;
  }
}

.form-actions {
  margin-top: auto;
  display: flex;
  gap: 12px;

  .submit-btn {
    flex: 1;
  }
}

/* TinyMCE编辑器自定义样式 */
:deep(.tox-tinymce) {
  border-radius: 4px;
}

:deep(.tox .tox-toolbar__primary) {
  background-color: #f8f9fa;
}
</style>