<script setup>
import { ref, computed,watchEffect, nextTick } from 'vue'
import Editor from "@/components/Editor.vue"
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import { marked } from 'marked';
import handleExportWord from "xh-htmlword";
// import { getOutline } from '@/api/ai'
import { fetchEventSource } from '@microsoft/fetch-event-source';

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

// 生成状态
const isGenerating = ref(false)

// 计算编辑器高度
const editorHeight = computed(() => {
  // 减去头部高度(52px)和内边距(40px)
  return 'calc(100vh - 92px)'
})


// 编辑器是否禁用
const editorDisabled = ref(false)

// 处理表单提交
const handleSubmit = async () => {
  try {
    isGenerating.value = true
    // 这里添加调用后端API的逻辑
    const query=`课程名称：${formData.value.courseName}，教学目标：${formData.value.teachingGoal}，年级：${formData.value.grade}，学科：${formData.value.subject},请帮我生成相关的教学大纲`
    //同步调用
    // const res = await getOutline(query)
    // editorContent.value = res.data.choices[0].messages.content.msg
    // ElMessage.success('生成成功')
    
    editorDisabled.value = true // 禁用编辑器
    editorContent.value = '' // 清空内容

    // SSE调用
    const connectToSSE = () => {
      isGenerating.value = true
      const streamUrl = `https://open.bigmodel.cn/api/llm-application/open/v3/application/invoke`
      const apiKey = '49613b99603942908e202474f204ead5.LYg0QJKY8Mkr6rjv'

      const app_id = '1895304167887695872'
      const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
      
      fetchEventSource(streamUrl, {
        method: 'post',
        headers,
        body: JSON.stringify({
          app_id,
          messages: [{
            role: 'user',
            content: [{
              value: query,
              type: "input"
            }],
          }]
        }),
        onmessage: async (event) => {
          const ev = ref(JSON.parse(event.data))
          editorContent.value += ev.value.choices[0].delta.content.msg
          
          // 实时滚动到底部
          await nextTick(() => {
            const editorContainer = document.querySelector('.w-e-scroll')
            
            if (editorContainer) {
              editorContainer.scrollTo({
                top:editorContainer.scrollHeight,
                behavior:'smooth'
              })
              
            }
          })
        },
        onerror(err) {
          console.log('err', err)
          ElMessage.error('生成失败')
          editorDisabled.value = false
        },
        async onopen(response) {
          if (response.ok) {
            console.log('开始建立连接')
            isGenerating.value = true
          }
        },
        onclose() {
          isGenerating.value = false
          editorDisabled.value = false // 启用编辑器
          console.log('关闭')
          ElMessage.success('生成成功')
        },
      }).catch((err) => {
        controller?.abort()
        setController(new AbortController())
        console.log({ err })
        ElMessage.error('生成失败')
        editorDisabled.value = false
        throw new Error(err)
      })
    }
    
    connectToSSE()
     
  } catch (error) {
    console.error('Submit Error:', error)
    ElMessage.error('生成失败')
  } finally {
    isGenerating.value = false
    editorDisabled.value = false
  }
}

// 监听编辑器内容变化，自动滚动到底部
watchEffect(() => {
  if (editorContent.value && isGenerating.value) {
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
        />
        <div class="export-box">
        </div>
      </div>
    </div>

    <!-- 右侧表单区域 -->
    <div class="form-section">
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
          <el-button type="primary" :loading="isGenerating" @click="handleSubmit" class="submit-btn" style="background-color: #4a6efa">
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

<style scoped lang="scss">
// ai感背景图
.form-section[data-v-8c507a66]{
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
  // width: 320px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 0 8px 8px 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* 表单内容过多时可滚动 */
  border: 1px solid #e6e6e6;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
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

/* 优化按钮样式 */
:deep(.el-button--primary) {
  background-color: #409EFF;
  border-color: #409EFF;
  
  &:hover, &:focus {
    background-color: #66b1ff;
    border-color: #66b1ff;
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