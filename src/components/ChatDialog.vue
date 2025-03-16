<script setup>
import { ref, nextTick, watchEffect} from "vue";
import { useMessagesStore } from "@/stores/messages.js";
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { ElMessage } from 'element-plus'
import {marked} from 'marked'
import { RefreshLeft, Connection } from '@element-plus/icons-vue'

const messagesStore = useMessagesStore()
const content = ref('')
const mdContentToHtml = ref('')
watchEffect(() => {
    mdContentToHtml.value = marked(content.value)
})
const textRef = ref(null)
const cursorRef = ref(null)
const props=defineProps({
    messageIndex:{
        required:true
    },
    index:{
        required:true
    },
    container:{
        required:true
    }
})
const emit = defineEmits(['insert-to-doc'])
// 控制器
const controller = ref(null)

// // 更新光标位置
// const updateCursorPosition = async () => {
//   await nextTick(() => {
//     const textElement = textRef.value
//     const cursorElement = cursorRef.value
//     if (!textElement || !cursorElement) return

//     const textContent = textElement.textContent || ''
//     const tempSpan = document.createElement('span')
//     tempSpan.style.visibility = 'hidden'
//     tempSpan.style.position = 'absolute'
//     tempSpan.style.whiteSpace = 'pre-wrap'
//     tempSpan.style.font = window.getComputedStyle(textElement).font
//     tempSpan.textContent = textContent

//     document.body.appendChild(tempSpan)
//     const textRect = textElement.getBoundingClientRect()
//     const spanRect = tempSpan.getBoundingClientRect()
//     document.body.removeChild(tempSpan)

//     // 计算最后一个字符的位置
//     const lines = Math.floor(spanRect.height / parseInt(window.getComputedStyle(textElement).lineHeight))
//     const isLastLine = spanRect.width > textRect.width * (lines - 1)
    
//     cursorElement.style.left = isLastLine ? 
//       `${Math.min(spanRect.width % textRect.width, textRect.width)}px` : 
//       '0px'
//     cursorElement.style.top = `${lines * parseInt(window.getComputedStyle(textElement).lineHeight) - parseInt(window.getComputedStyle(textElement).lineHeight)}px`
//   })
// }

// 停止生成
// const stopGenerate = () => {
//     console.log('stopGenerate')
    
//   if (controller.value) {
//     controller.value.abort()
//     isGenerating.value = false
//     ElMessage.info('已停止生成')
//   }
// }

// 插入到文档
const insertToDoc = () => {
  emit('insert-to-doc', messagesStore.answer[props.messageIndex][props.index])
  ElMessage.success('已插入到文档')
}

// SSE调用
const connectToSSE = () => {
  content.value = ''
  
  messagesStore.setIsGenerating(props.messageIndex,true)
  
  controller.value = new AbortController()
  const signal = controller.value.signal
  
  const streamUrl = `https://open.bigmodel.cn/api/llm-application/open/v3/application/invoke`
  const apiKey = '49613b99603942908e202474f204ead5.LYg0QJKY8Mkr6rjv'
  const app_id = '1895304167887695872'
  
  fetchEventSource(streamUrl, {
    method: 'post',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    signal,
    body: JSON.stringify({
      app_id,
      messages: [{
        role: 'user',
        content: [{
          value: messagesStore.ask[props.messageIndex][messagesStore.ask[props.messageIndex].length-1],
          type: "input"
        }],
      }]
    }),
    onmessage: async (event) => {
      const ev = ref(JSON.parse(event.data))
      content.value += ev.value.choices[0].delta.content.msg
      // await updateCursorPosition()
      console.log(content.value);
      

    
      messagesStore.setAnswer({text:mdContentToHtml.value, index1:props.messageIndex, index2:messagesStore.answer[props.messageIndex].length-1})
      // 实时滚动到底部
      await nextTick(() => {
            // const container = document.querySelector('.form-section')
            if (props.container) {
              props.container.scrollTo({
                top: props.container.scrollHeight,
                behavior: 'smooth'
              })
            }
          })
      
    },
    onerror(err) {
      console.log('err', err)
      ElMessage.error('生成失败')
      messagesStore.setIsGenerating(props.messageIndex,false)
      messagesStore.setStartGenerating(props.messageIndex,false)
    },
    onclose() {
      ElMessage.success('生成成功')
      messagesStore.setIsGenerating(props.messageIndex,false)
      messagesStore.setStartGenerating(props.messageIndex,false)
    }
  }).catch((err) => {
    console.log(err)
    ElMessage.error('生成失败')
    messagesStore.setIsGenerating(props.messageIndex,false)
    messagesStore.setStartGenerating(props.messageIndex,false)
  })
}
// 监听编辑器内容变化，自动滚动到底部
// watchEffect(() => {
//   if (content.value && messagesStore.isGenerating) {
//     nextTick(() => {
//       const container = document.querySelector('.form-section')
//       if (container) {
//         container.scrollTo({
//           top: container.scrollHeight,
//           behavior: 'smooth'
//         })
//       }
//     })
//   }
// })

watchEffect(()=>{
    if(messagesStore.startGenerating[props.messageIndex]&&props.index==messagesStore.ask[props.messageIndex].length-1){
        if(messagesStore.isGenerating[props.messageIndex]) return
        connectToSSE()
        messagesStore.setStartGenerating(props.messageIndex,false)
    }
})

// 111生成
const clickToGenerate = () => {
    content.value=''
    if (messagesStore.isGenerating[props.messageIndex]) return
    connectToSSE()
}
// 重新生成
const clickToRegenerate = () => {
    messagesStore.addAnswer(props.messageIndex)
    messagesStore.addAsk(props.messageIndex)
    messagesStore.setAsk({text:messagesStore.ask[props.messageIndex][props.index],index1:props.messageIndex,index2:messagesStore.ask[props.messageIndex].length-1})

    // messagesStore.setStartGenerating(true)
    
    if(messagesStore.isGenerating[props.messageIndex]) return
    connectToSSE()
    console.log('重新生成');
    
    // messagesStore.setStartGenerating(false)
}
</script>

<template>
  <div class="chat-container">
    <div class="chat-main">
        <div class="robot-icon">
            <img src="@/assets/images/robot.png" alt="robot">
        </div>
        <div class="chat-content">
            <div class="message-box">
                <div class="text-content" ref="textRef" v-html="messagesStore.answer[props.messageIndex][props.index]">
                </div>
                <div 
                    class="cursor" 
                    ref="cursorRef"
                    :class="{ 'generating': messagesStore.isGenerating[props.messageIndex] }"
                ></div>
            <!-- 生成中状态 -->
            <!-- <template v-if="isGenerating">
                <el-button 
                v-if="isGenerating"
                type="danger" 
                @click="stopGenerate"
                class="stop-generate"
                :loading="isGenerating"
                plain
                >
                停止生成
                </el-button>
            </template> -->
            </div>
        <!-- 生成完成状态 -->
            <template v-if="!messagesStore.isGenerating[props.messageIndex]">
                <el-button 
                type="primary" 
                @click="clickToGenerate"
                v-if="!messagesStore.answer[props.messageIndex][props.index]"
                >
                开始生成
                </el-button>
                <template v-else>
                    <div
                    @click="clickToRegenerate"
                    class="re-generate"
                    >

                    <el-icon><RefreshLeft /></el-icon>
                    重新生成
                    </div>
                    <div
                        @click="insertToDoc"
                        class="insert-doc"
                    >
                    <el-icon><Connection /></el-icon>
                        插入文档
                    </div>
                </template>
            </template>
        </div>
    </div>
    <!-- 光标 -->
    <div class="action-bar">

    </div>
  </div>
</template>

<style lang="scss" scoped>
// 重新生成按钮
.insert-doc,.re-generate{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    width: 80px;
    height: 30px;
    font-size: 12px;
    cursor: pointer;
}
.insert-doc{
    float: right;
}
.re-generate{
    float: left;
}
// // 停止生成按钮
//  .stop-generate{
//     position: absolute;
//     bottom: 5px;
//     right: 50%;
//     transform: translateX(50%);
//     width: 80px;
//     height: 25px;
//     font-size: 12px;
//     cursor: pointer;
// }
// 机器人头像
.chat-main{
    display: flex;
    gap: 7px;
}
.robot-icon img{
    display: inline;
  width: 40px;
  height: 40px;
  border-radius: 50%;
//   overflow: hidden;
}

.chat-container {
  padding:20px;
  padding-left: 5px;
  width: 80%;
//   height: 100%;

  display: flex;
  flex-direction: column;
  gap: 5px;
}

.message-box {
    flex: 1;
    margin-top: 25px;
  position: relative;
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  border-top-left-radius: 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  min-height: 20px;
  min-width: 80%;
}

.text-content {
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
  color: #303133;
}

.cursor {
  position: absolute;
  width: 2px;
  height: 16px;
  background-color: #409EFF;
  opacity: 0;
  transition: opacity 0.3s;
  
  &.generating {
    opacity: 1;
    animation: blink 0.8s infinite;
  }
}

.action-bar {
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 12px;
  
  .el-button {
    min-width: 100px;
  }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* 添加按钮动画效果 */
.el-button {
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

/* 优化危险按钮样式 */
:deep(.el-button--danger.is-plain) {
  &:hover {
    color: #fff;
    background-color: var(--el-color-danger);
    border-color: var(--el-color-danger);
  }
}
</style>