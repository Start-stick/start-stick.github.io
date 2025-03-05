<script setup>
import { ref, computed, watchEffect } from 'vue'
import Editor from "@/components/Editor.vue"
import ChatDialog from "@/components/ChatDialog.vue"
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import { marked } from 'marked'
import { useMessagesStore } from '@/stores/messages'
import handleExportWord from "xh-htmlword"

// 编辑器内容
const editorContent = ref('')
const mdContentToHtml = ref('')
watchEffect(() => {
    mdContentToHtml.value = marked(editorContent.value)
})

// 表单数据
const formData = ref({
  courseName: '',
  grade: '',
  subject: '',
  resourceType: '',    // 资源类型
})

// 计算编辑器高度
const editorHeight = computed(() => {
  return 'calc(100vh - 92px)'
})

// 编辑器实例引用
const editorRef = ref(null)
const editorDisabled = ref(false)
const ask = ref('生成资源')
const messagesStore = useMessagesStore()

// 处理表单提交
const handleSubmit = async () => {
  messagesStore.addAnswer()
  messagesStore.addAsk()

  editorDisabled.value = true
  editorContent.value = ''

  const query = `课程名称：${formData.value.courseName}，
                年级：${formData.value.grade}，
                学科：${formData.value.subject}，
                资源类型：${formData.value.resourceType}，
                请帮我生成相关的ppt视频`
                
  ask.value = query
  messagesStore.setAsk({text:ask.value, index:messagesStore.ask.length-1})
  messagesStore.setStartGenerating(true)
  editorDisabled.value = false
}

// 导出Word文档
const exportWord = () => {
  if (!editorContent.value) {
    ElMessage.warning('暂无内容可导出')
    return
  }
  nextTick(() => {
    document.querySelector('.export-box').innerHTML = mdContentToHtml.value
    handleExportWord({
      dom: ".export-box",
      fileName: '教学资源',
      callBack: () => {
        ElMessage.success('导出成功')
      },
    })
  })
  document.querySelector('.export-box').innerHTML = ''
}

// 处理从 ChatDialog 插入内容
const handleInsertFromChat = (content) => {
  editorContent.value = content
}

// 要滚动的对象
const container = ref(null)
</script>

<template>
  <div class="resource-container">
    <!-- 左侧编辑器区域 -->
    <div class="editor-section">
      <div class="editor-header">
        <div class="title">教学资源</div>
        <div class="actions">
          <el-button type="primary" :icon="Download" @click="exportWord" style="background-color: #4a6efa">
            导出文档
          </el-button>
        </div>
      </div>
      <div class="editor-content">
        <Editor
          v-model="mdContentToHtml"
          :height="editorHeight"
          :disabled="editorDisabled"
          ref="editorRef"
        />
        <div class="export-box"></div>
      </div>
    </div>

    <!-- 右侧表单区域 -->
    <div class="form-section" ref="container">
      <el-form :model="formData" label-position="top" class="generate-form">
        <el-form-item label="课程名称">
          <el-input v-model="formData.courseName" placeholder="请输入课程名称" />
        </el-form-item>

        <el-form-item label="年级">
          <el-select v-model="formData.grade" placeholder="请选择年级" class="w-full">
            <el-option label="大一" value="大学一年级" />
            <el-option label="大二" value="大学二年级" />
            <el-option label="大三" value="大学三年级" />
            <el-option label="大四" value="大学四年级" />
          </el-select>
        </el-form-item>

        <el-form-item label="学科">
          <el-input v-model="formData.subject" placeholder="请输入学科" />
        </el-form-item>

        <el-form-item label="资源类型">
          <el-select v-model="formData.resourceType" placeholder="请选择资源类型" class="w-full">
            <el-option label="课件" value="courseware" />
            <el-option label="教案" value="teachingPlan" />
            <el-option label="习题" value="exercises" />
            <el-option label="视频" value="video" />
            <el-option label="实验指导" value="labGuide" />
          </el-select>
        </el-form-item>





        <div class="form-actions">
          <el-button 
            type="primary" 
            :loading="messagesStore.isGenerating" 
            @click="handleSubmit" 
            class="submit-btn" 
            style="background-color: #4a6efa"
          >
            {{ messagesStore.isGenerating ? '生成中...' : '智能生成资源' }}
          </el-button>
        </div>
      </el-form>

      <div class="chat-dialog">
        <ChatDialog 
          v-for="(item,index) in messagesStore.ask"
          :key="item"
          :index="index"
          :container="container"
          @insert-to-doc="handleInsertFromChat"
        ></ChatDialog>
      </div>
      
      <el-backtop :visibility-height="50" :target="'.form-section'" :right="38" :bottom="64" />
    </div>
  </div>
</template>

<style scoped lang="scss">
// 整体容器
.resource-container {
  display: flex;
  height: calc(100vh - 96px);
  overflow: hidden;
}

// 左侧编辑器区域
.editor-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  margin-right: 20px;
  padding: 20px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  border-radius: 8px;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  margin-bottom: 20px;

  .title {
    font-size: 18px;
    font-weight: 500;
    color: #303133;
  }

  .actions {
    .el-button {
      padding: 8px 16px;
      font-size: 14px;
    }
  }
}

.editor-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: none;
  position: relative;

  &.disabled::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.6);
    z-index: 10;
  }
}

// 右侧表单区域
.form-section {
  flex: 1;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  border: 1px solid #4770dc;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  background-image: url('@/assets/mainBg.png');

  // 自定义滚动条
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #dcdfe6;
    border-radius: 3px;
    
    &:hover {
      background-color: #c0c4cc;
    }
  }

  &::-webkit-scrollbar-track {
    background-color: #f5f7fa;
  }
}

// 表单样式
.generate-form {
  .el-form-item {
    margin-bottom: 16px;
    
    &__label {
      padding-bottom: 8px;
      font-weight: 500;
    }
  }
}

.form-actions {
  margin-top: 24px;
  
  .submit-btn {
    width: 100%;
    height: 40px;
    font-size: 14px;
    
    &:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
  }
}

// 聊天对话区域
.chat-dialog {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

// 导出框
.export-box {
  display: none;
}

// 工具类
.w-full {
  width: 100%;
}

// 编辑器自定义样式
:deep(.w-e-text-container) {
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #dcdfe6;
    border-radius: 3px;
    
    &:hover {
      background-color: #c0c4cc;
    }
  }

  &::-webkit-scrollbar-track {
    background-color: #f5f7fa;
  }
}

// 表单项样式优化
:deep(.el-input__inner) {
  &:hover, &:focus {
    border-color: #4a6efa;
  }
}

:deep(.el-select) {
  width: 100%;
  
  .el-input__inner:hover {
    border-color: #4a6efa;
  }
}

// 返回顶部按钮样式
:deep(.el-backtop) {
  background-color: #4a6efa;
  color: #fff;
  
  &:hover {
    background-color: #627aff;
  }
}
</style>

<style>
.textarea-input .el-textarea__inner {
  resize: none;
}

/* // 全局按钮样式覆盖 */
.el-button--primary {
  --el-button-hover-bg-color: #627aff;
  --el-button-hover-border-color: #627aff;
}
</style>