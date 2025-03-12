<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { ref ,nextTick} from 'vue'
// import { getStream } from '@/api/ai'

const handleClick = async () => {

    console.log('一键生成')

    const streamUrl = `https://api.coze.cn/v3/chat`
    const apiKey = 'pat_DjueLDXeXdMtOmDd83u0svybLjPo05fEFhgkBZcCoNFECUxWLgcpghQircY5VCOk'
    const bot_id = '7480200186401275939'
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

    let currentBubbleElement = null; // 用于存储当前正在打字的bubble元素
    function typeMessage(content, isLeft) {
        // 初始化index
        let index = 0;

        // 如果当前bubble元素不存在，或者消息的方向改变了，创建一个新的bubble元素
        if (!currentBubbleElement || !currentBubbleElement.classList.contains('bubble-left')) {
            currentBubbleElement = document.createElement('div');
            currentBubbleElement.className = 'bubble bubble-left'; // 总是使用'bubble-left'样式
            currentBubbleElement.textContent = ''; // 初始化为空字符串

            // 创建一个新的chat-message元素并添加bubble
            const newMessage = document.createElement('div');
            newMessage.className = `chat-message left`; // 确保消息总是使用'left'样式
            newMessage.appendChild(currentBubbleElement);

            // 将新消息添加到chatWindow
            document.querySelector('.chatWindow').appendChild(newMessage);
        }

        (function typeNextChar() {
            // 逐字添加内容
            if (index < content.length) {
                currentBubbleElement.textContent += content[index]; // 逐字添加
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
                        content: '给我《高数》的教学大纲',
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
                break;
            }
            const chunk = decoder.decode(value, { stream: true });

            messageContent += chunk; // 累积消息内容


            //   // 处理累积的消息内容
            processMessageContent(messageContent);
            // 实时滚动到底部
            await nextTick(() => {
                const container = document.querySelector('.chat')
                if (container) {
                    container.scrollTo({
                        top: container.scrollHeight,
                        behavior: 'smooth'
                    })
                }
            })
        }

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return null
    }

}
</script>

<template>
    <div>
        一键生成
        <button @click="handleClick">1111</button>
        <div class="chat">

            <div class="chatWindow">

            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.chat{
    width: 400px;
    height: calc(100vh - 120px);
    border: 1px solid #000;
    overflow-y: auto;
}
</style> 