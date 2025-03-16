<script setup>
import { ref, computed,watchEffect, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, Clock, Edit, Delete, MagicStick } from '@element-plus/icons-vue'
import { marked } from 'marked';
import handleExportWord from "xh-htmlword";
// import { getOutline } from '@/api/ai'
import { useMessagesStore } from '@/stores/messages.js';
import { useRouter } from 'vue-router'

const router = useRouter()
const messagesStore = useMessagesStore()
const messageIndex=ref(0)

// 历史大纲列表
const outlineHistory = ref([
  {
    title: '高等数学第一章大纲',
    time: '2024-03-15 14:30:00',
  },
  {
    title: 'C语言指针教学大纲',
    time: '2024-03-14 16:20:00',
  }
])

// 编辑器内容
const editorContent = ref('')
const mdContentToHtml =ref('')
watchEffect(() => {
    mdContentToHtml.value = marked(editorContent.value); // 将 Markdown 转换为 HTML
});
const abortController = ref<AbortController | null>(null)

// 表单数据
const formData = ref({
  courseName: '',
  grade: '',
  subject: '',
  teachingGoal: ''
})



// 计算编辑器高度
const editorHeight = computed(() => {
  // 减去头部高度(52px)和内边距(40px)
  return 'calc(100vh - 92px)'
})

// 处理从 ChatDialog 插入内容
const handleInsertFromChat = (content) => {
  editorContent.value = content
}

// 编辑器是否禁用
const editorDisabled = ref(false)

// 处理表单提交
const handleSubmit = async () => {
  try {
    messagesStore.addAnswer(messageIndex.value) // 添加答案
    messagesStore.addAsk(messageIndex.value) // 添加问题

    messagesStore.setStartGenerating(messageIndex.value,true) // 设置开始生成状态
    // 这里添加调用后端API的逻辑
    const query=`课程名称：${formData.value.courseName}，教学目标：${formData.value.teachingGoal}，年级：${formData.value.grade}，学科：${formData.value.subject},请帮我生成相关的教学大纲`
    //同步调用
    messagesStore.setAsk({text:query,index1:messageIndex.value,index2:messagesStore.ask[messageIndex.value].length-1})
    editorDisabled.value = true // 禁用编辑器

     
  } catch (error) {
    console.error('Submit Error:', error)
    ElMessage.error('生成失败')
  } finally {
    messagesStore.setIsGenerating(messageIndex.value,false)
    editorDisabled.value = false
  }
}

// 监听编辑器内容变化，自动滚动到底部
watchEffect(() => {
  if (editorContent.value && messagesStore.isGenerating[messageIndex.value]) {
    nextTick(() => {
      const editorContainer = document.querySelector('.w-e-scroll')
      if (editorContainer) {
        editorContainer.scrollTop = editorContainer.scrollHeight
      }
    })
  }
})

// 导出Word文档
const exportWord = () => {
  if (!editorContent.value) {
    ElMessage.warning('暂无内容可导出')
    return
  }
  nextTick(() => {
  document.querySelector('.export-box').innerHTML = mdContentToHtml.value 
  // console.log(mdContentToHtml.value);
  // console.log(editorContent.value);
  
  // console.log(document.querySelector('.export-box').innerHTML);
  
  
  handleExportWord({
      dom:".export-box",
      fileName:'教学大纲', 
      callBack: () => {
      ElMessage.success('导出成功');
    },
  })
})
  document.querySelector('.export-box').innerHTML = ''
  // 另外一种导出文档方式（无脱html）
  // try {
    
  //   const blob = new Blob([editorContent.value], { 
  //     type: 'application/msword;charset=utf-8' 
  //   })
  //   const link = document.createElement('a')
  //   link.href = URL.createObjectURL(blob)
  //   link.download = '教学大纲.doc'
  //   link.click()
  //   URL.revokeObjectURL(link.href)
  //   ElMessage.success('导出成功')
  // } catch (error) {
  //   console.error('Export Error:', error)
  //   ElMessage.error('导出失败')
  // }
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
          <Down 
          :editorContent="editorContent"
          />
        </div>
      </div>
      <div class="editor-content">
        <Editor  
          v-model="mdContentToHtml"
          :height="editorHeight"
          :disabled="editorDisabled"
        />
        <div class="export-box">
        </div>
      </div>
    </div>

    <!-- 右侧表单区域 -->
    <div class="form-section" ref="container">
      <el-form :model="formData" label-position="top" class="generate-form">
        <el-form-item label="课程名称">
          <el-input v-model="formData.courseName" placeholder="请输入课程名称" />
        </el-form-item>

        <el-form-item label="教学目标">
          <el-input v-model="formData.teachingGoal" type="textarea" class="textarea-input" :rows="4" placeholder="请输入教学目标" />
        </el-form-item>

        <el-form-item label="年级">
          <el-select v-model="formData.grade" placeholder="请选择年级" class="w-full">
            <el-option label="大一" value="grade1" />
            <el-option label="大二" value="grade2" />
            <el-option label="大三" value="grade3" />
            <el-option label="大四" value="grade4" />
          </el-select>
        </el-form-item>

        <el-form-item label="学科">
          <el-input v-model="formData.subject" placeholder="请输入学科"  class="w-full" />
        </el-form-item>

        <div class="form-actions">
          <el-button type="primary" :loading="messagesStore.isGenerating[messageIndex]" @click="handleSubmit" class="submit-btn" style="background-color: #4a6efa">
            {{ messagesStore.isGenerating[messageIndex] ? '生成中...' : '开始生成' }}
          </el-button>
          <el-button v-if="editorContent" @click="regenerate" :disabled="messagesStore.isGenerating[messageIndex]">
            重新生成
          </el-button>
        </div>
      </el-form>
      <div class="chat-dialog">
        <ChatDialog 
        v-for="(item,index) in messagesStore.ask[messageIndex]"
        :key="item"
        :index="index"
        :messageIndex="messageIndex"
        :container="container"
        @insert-to-doc="handleInsertFromChat"
      ></ChatDialog>
      <el-backtop :visibility-height="50" :target="'.form-section'"  :right="38" :bottom="64" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// ai感背景图
.form-section{
  border: 1px solid #4770dc;
  box-sizing: border-box;
  border-radius: 8px;
  background: url('@/assets/mainBg.png') no-repeat ;
  
  // background-color: #f5f7fa;
}

.outline-container {
  display: flex;
  height: calc(100vh - 96px); /* 减去外部容器的padding */
  // background-color: #fff;
  // box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  overflow: hidden; /* 防止内容溢出 */
}

.editor-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  // border: 1px solid #e6e6e6;
  background-color: #fff;
  margin-right: 20px;
  padding: 20px;
  overflow: hidden; /* 防止编辑器溢出 */
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  border-radius: 8px;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px; /* 固定头部高度 */
  margin-bottom: 20px;

  .title {
    font-size: 18px;
    font-weight: 500;
    color: #303133;
  }
}

.editor-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: none;
  position: relative; /* 添加相对定位 */

  /* 添加禁用状态的遮罩 */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.6);
    z-index: 10;
    display: none;
  }

  &.disabled::after {
    display: block;
  }
}

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

.generate-form {
  height: 100%;
  display: flex;
  flex-direction: column;
}


.form-actions {
  margin-top: auto;
  padding-top: 16px; /* 增加顶部间距 */
  display: flex;
  gap: 12px;

  .submit-btn {
    flex: 1;
  }
}



.export-box{
  display: inline;
  height: 0;
  overflow: hidden;
}

/* 优化编辑器滚动条样式 */
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
</style>
<style>
.textarea-input .el-textarea__inner{
  resize: none;
}
</style>