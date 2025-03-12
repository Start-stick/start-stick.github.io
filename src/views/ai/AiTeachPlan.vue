<script setup>
import { ref, computed, watchEffect, nextTick, watch, onMounted, } from 'vue'
import Editor from "@/components/Editor.vue"
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import { marked } from 'marked'
import { useMessagesStore } from '@/stores/messages'
import handleExportWord from "xh-htmlword"
// import { getOutline } from '@/api/ai'
// import { fetchEventSource } from '@microsoft/fetch-event-source'

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
  teachingGoal: '',    // 教学目标
  teachingTime: '',    // 课时
  teachingType: ''     // 教学类型
})

// 计算编辑器高度
const editorHeight = computed(() => {
  return 'calc(100vh - 92px)'
})

// 编辑器实例引用
const editorRef = ref(null)
// 编辑器是否禁用
const editorDisabled = ref(false)
const ask=ref('生成教案')
const messagesStore=useMessagesStore()
console.log(messagesStore.answer.length);

// 处理表单提交
const handleSubmit = async () => {
  messagesStore.addAnswer()
  messagesStore.addAsk()
  // try {
  

    editorDisabled.value = true // 禁用编辑器
    editorContent.value = '' // 清空内容

    const query = `课程名称：${formData.value.courseName}，
                  教学目标：${formData.value.teachingGoal}，
                  年级：${formData.value.grade}，
                  学科：${formData.value.subject}，
                  课时：${formData.value.teachingTime}，
                  教学类型：${formData.value.teachingType}，
                  请帮我生成一份详细的教案`
    ask.value=query
    messagesStore.setAsk({text:ask.value,index:messagesStore.ask.length-1})
    messagesStore.setStartGenerating(true)
    console.log(messagesStore.ask[messagesStore.ask.length-1]);
    console.log(messagesStore.startGenerating);
    editorDisabled.value=false

  //   // SSE调用
  //   const connectToSSE = () => {
  //     isGenerating.value = true
  //     const streamUrl = `https://open.bigmodel.cn/api/llm-application/open/v3/application/invoke`
  //     const apiKey = '49613b99603942908e202474f204ead5.LYg0QJKY8Mkr6rjv'

  //     const app_id = '1895304167887695872'
  //     const headers = {
  //       'Authorization': `Bearer ${apiKey}`,
  //       'Content-Type': 'application/json',
  //     }
      
  //     fetchEventSource(streamUrl, {
  //       method: 'post',
  //       headers,
  //       body: JSON.stringify({
  //         app_id,
  //         messages: [{
  //           role: 'user',
  //           content: [{
  //             value: query,
  //             type: "input"
  //           }],
  //         }]
  //       }),
  //       onmessage: async (event) => {
  //         const ev = ref(JSON.parse(event.data))
  //         editorContent.value += ev.value.choices[0].delta.content.msg
          
  //         // 实时滚动到底部
  //         await nextTick(() => {
  //           const editorContainer = document.querySelector('.w-e-scroll')
  //           if (editorContainer) {
  //             editorContainer.scrollTo({
  //               top: editorContainer.scrollHeight,
  //               behavior: 'smooth'
  //             })
  //           }
  //         })
  //       },
  //       onerror(err) {
  //         console.log('err', err)
  //         ElMessage.error('生成失败')
  //         editorDisabled.value = false
  //       },
  //       async onopen(response) {
  //         if (response.ok) {
  //           console.log('开始建立连接')
  //           isGenerating.value = true
  //         }
  //       },
  //       onclose() {
  //         isGenerating.value = false
  //         editorDisabled.value = false // 启用编辑器
  //         console.log('关闭')
  //         ElMessage.success('生成成功')
  //       },
  //     }).catch((err) => {
  //       controller?.abort()
  //       setController(new AbortController())
  //       console.log({ err })
  //       ElMessage.error('生成失败')
  //       editorDisabled.value = false
  //       throw new Error(err)
  //     })
  //   }
    
  //   connectToSSE()
    
  // } catch (error) {
  //   console.error('Submit Error:', error)
  //   ElMessage.error('生成失败')
  // } finally {
  //   isGenerating.value = false
  //   editorDisabled.value = false
  // }
}

// 监听编辑器内容变化，自动滚动到底部
watchEffect(() => {
  if (editorContent.value && messagesStore.isGenerating) {
    nextTick(() => {
      const editorContainer = document.querySelector('.w-e-scroll')
      if (editorContainer) {
        editorContainer.scrollTo({
          top: editorContainer.scrollHeight,
          behavior: 'smooth'
        })
      }
    })
  }
})
// 监听编辑器内容变化，自动滚动到底部
// watchEffect(() => {
  // if ( messagesStore.isGenerating) {
  //   nextTick(() => {
  //     const container = document.querySelector('.form-section')
  //     if (container) {
  //       container.scrollTo({
  //         top: container.scrollHeight,
  //         behavior: 'smooth'
  //       })
  //     }
  //   })
  // }
// })

//要滚动的对象
const container = ref(null)

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
      fileName: '教学教案',
      callBack: () => {
        ElMessage.success('导出成功')
      },
    })
  })
  document.querySelector('.export-box').innerHTML = ''
}

// 重新生成
const regenerate = () => {
  editorContent.value = ''
  handleSubmit()
}

// 处理从 ChatDialog 插入内容
const handleInsertFromChat = (content) => {
  editorContent.value = content
}
</script>

<template>
  <div class="outline-container">
    <!-- 左侧编辑器区域 -->
    <div class="editor-section">
      <div class="editor-header">
        <div class="title">教学教案</div>
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

        <el-form-item label="教学目标">
          <el-input v-model="formData.teachingGoal" type="textarea" class="textarea-input" :rows="3" placeholder="请输入本节课的教学目标" />
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

        <el-form-item label="课时">
          <el-input-number v-model="formData.teachingTime" :min="1" :max="10" class="w-full" />
        </el-form-item>

        <el-form-item label="教学类型">
          <el-select v-model="formData.teachingType" placeholder="请选择教学类型" class="w-full">
            <el-option label="理论课" value="theory" />
            <el-option label="实验课" value="experiment" />
            <el-option label="研讨课" value="seminar" />
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
          {{ messagesStore.isGenerating ? '生成中...' : '智能生成教案' }}
          </el-button>
          <!-- 111 -->
          <!-- <el-button type="primary" :loading="isGenerating" @click="handleSubmit" class="submit-btn" style="background-color: #4a6efa">
            {{ isGenerating ? '生成中...' : '开始生成' }}
          </el-button>
          <el-button v-if="editorContent" @click="regenerate" :disabled="isGenerating">
            重新生成
          </el-button> -->
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
      
      <el-backtop :visibility-height="50" :target="'.form-section'"  :right="38" :bottom="64" />
    </div>
  </div>
</template>

<style scoped lang="scss">
//表单项
.form-item{
  margin-bottom: 10px;
}
// ai感背景图
.form-section{
  border: 1px solid #4770dc;
  box-sizing: border-box;
  border-radius: 8px;
  background: url('@/assets/mainBg.png');
}

.outline-container {
  display: flex;
  height: calc(100vh - 96px);
  overflow: hidden;
}

.editor-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  margin-right: 20px;
  padding: 20px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
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
  border-radius: 0 8px 8px 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  border: 1px solid #e6e6e6;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  height: calc(100vh - 96px); /* 设置固定高度 */

  /* 自定义滚动条样式 */
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
  display: flex;
  flex-direction: column;
}

.form-actions {
  margin-top: auto;
  padding-top: 16px;
  display: flex;
  gap: 12px;

  .submit-btn {
    flex: 1;
  }
}

:deep(.el-button--primary) {
  background-color: #409EFF;
  border-color: #409EFF;
  
  &:hover, &:focus {
    background-color: #66b1ff;
    border-color: #66b1ff;
  }
}

.export-box {
  display: inline;
  height: 0;
  overflow: hidden;
}

// 自定义输入框宽度
:deep(.el-input-number) {
  width: 100%;
}

.w-full {
  width: 100%;
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
.textarea-input .el-textarea__inner {
  resize: none;
}
</style>