<script setup>
import { ref, nextTick, watchEffect} from "vue";
import { useMessagesStore } from "@/stores/messages.js";
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { ElMessage } from 'element-plus'
import {marked} from 'marked'
import { RefreshLeft, Connection } from '@element-plus/icons-vue'

const messagesStore = useMessagesStore()
const editorContent = ref('')
const mdContentToHtml = ref('')
watchEffect(() => {
    mdContentToHtml.value = marked(editorContent.value)
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

// 插入到文档
const insertToDoc = () => {
  emit('insert-to-doc', messagesStore.answer[props.messageIndex][props.index])
  ElMessage.success('已插入到文档')
}

// SSE调用
const connectToSSE =  async () => {
  editorContent.value = ''
  
  messagesStore.setIsGenerating(props.messageIndex,true)
  
  controller.value = new AbortController()
  const signal = controller.value.signal
  
  const streamUrl = `https://api.coze.cn/v3/chat`
    const apiKey = 'pat_DjueLDXeXdMtOmDd83u0svybLjPo05fEFhgkBZcCoNFECUxWLgcpghQircY5VCOk'
    const bot_id = '7482348702477205539'
    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
    }

    const eventSource = ref(null)
    const numbers = ref([])

    //数据处理函数
    let lastProcessedIndex = 0;
    let messageQueue = []; // 消息队列，用于存放待打字的消息
    let isTyping = false; // 标志，用于指示是否正在打字
    let messageContent = ''; // 用于累积消息内容

    function processMessageContent(content) {
        let currentIndex = lastProcessedIndex;
        let eventDeltaIndex = content.indexOf('event:conversation.message.delta', currentIndex);

        while (eventDeltaIndex !== -1) {
            // 找到下一个 'event:conversation.message.delta' 的位置
            let nextEventDeltaIndex = content.indexOf('event:conversation.message.delta', eventDeltaIndex + 1);
            let endEventDeltaIndex = nextEventDeltaIndex !== -1 ? nextEventDeltaIndex : content.length;

            // 提取数据部分，移除"data:"前缀并找到 JSON 对象的结束位置 '}'
            let dataString = content.substring(eventDeltaIndex, endEventDeltaIndex);
            let dataIndex = dataString.indexOf('data:');
            let jsonEndIndex = dataString.indexOf('}', dataIndex) + 1;

            // 确保我们找到了完整的 JSON 对象
            if (jsonEndIndex > 9 && dataString[jsonEndIndex - 1] === '}') {
                try {
                    // 尝试解析 JSON 对象
                    const dataObject = JSON.parse(dataString.substring(dataIndex + 5, jsonEndIndex));
                    // 使用打字机效果逐字添加消息
                    messageQueue.push(dataObject.content);
                    processQueue();
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }

                // 更新处理位置
                currentIndex = eventDeltaIndex + jsonEndIndex;
                eventDeltaIndex = nextEventDeltaIndex;
            } else {
                // 如果没有找到完整的 JSON 对象，则停止处理
                break;
            }
        }
        // 检测到 event:done，重置 messageContent
        const eventDoneIndex = content.indexOf('event:done', lastProcessedIndex)
        if (eventDoneIndex !== -1) {
            messageContent = ''; // 重置内容
            lastProcessedIndex = 0; // 重置处理位置
            return; // 退出处理
        }
        lastProcessedIndex = currentIndex;
    }
    function processQueue() {
        if (!isTyping && messageQueue.length > 0) {
            isTyping = true;
            typeMessage(messageQueue.shift(), true); // 开始打字队列中的下一条消息
        }
    }

    function typeMessage(content, isLeft) {
        // 初始化index
        let index = 0;
        (function typeNextChar() {
            // 逐字添加内容
            if (index < content.length) {
              editorContent.value+=content[index]
              messagesStore.setAnswer({text:mdContentToHtml.value,index1:props.messageIndex,index2:messagesStore.answer[props.messageIndex].length-1})
              index++; // 更新索引
              requestAnimationFrame(typeNextChar); // 使用requestAnimationFrame模拟打字效果
            }else{
              isTyping = false;
              processQueue(); // 继续处理队列中的下一条消息
            }
        })();
    }
    try {
        const response = await fetch(streamUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                bot_id,
                user_id: "123",
                stream: true,
                auto_save_history: true,
                additional_messages: [
                    {
                        role: 'user',
                        content: messagesStore.ask[props.messageIndex][messagesStore.ask[props.messageIndex].length-1],
                        content_type: 'text'

                    }

                ]
            })
        });
        // 创建一个可读流
        const reader = response.body.getReader();
        console.log(reader);

        let decoder = new TextDecoder('utf-8');

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                console.log('Stream ended');
                messagesStore.setIsGenerating(props.messageIndex,false)
                messagesStore.setStartGenerating(props.messageIndex,false)
                break;
            }
            const chunk = decoder.decode(value, { stream: true });
            messageContent += chunk; // 累积消息内容

            //   // 处理累积的消息内容
            processMessageContent(messageContent);
            // 实时滚动到底部
            await nextTick(() => {
                if (props.container) {
                    props.container.scrollTo({
                        top: props.container.scrollHeight,
                        behavior: 'smooth'
                    })
                }
            })
        }

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        messagesStore.setIsGenerating(props.messageIndex,false)
        messagesStore.setStartGenerating(props.messageIndex,false)
        return null
    }

}

watchEffect(()=>{
    if(messagesStore.startGenerating[props.messageIndex]&&props.index==messagesStore.ask[props.messageIndex].length-1){
        if(messagesStore.isGenerating[props.messageIndex]) return
        connectToSSE()
        messagesStore.setStartGenerating(props.messageIndex,false)
    }
})

// 111生成
const clickToGenerate = () => {
    editorContent.value=''
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