import request from '@/utils/request'
import { parseDate } from 'element-plus'
import {ref} from 'vue'


// const app_id='1895304167887695872'
const app_id='7480200186401275939'
// 获取大纲
export const getOutline = (data) => request.post(`/v3/application/invoke`, 
    {
            app_id,
            stream:false,
            messages:[
                {
                    role:'user',
                    content:[
                        {
                            value: data,
                            type: "input"
                          }
                    ],
                }
            ]
    
    })




// const streamUrl = `https://open.bigmodel.cn/api/llm-application/open/v3/application/invoke`
const streamUrl = `https://api.coze.cn/v3/chat`
// const apiKey ='49613b99603942908e202474f204ead5.LYg0QJKY8Mkr6rjv'
const apiKey ='pat_DjueLDXeXdMtOmDd83u0svybLjPo05fEFhgkBZcCoNFECUxWLgcpghQircY5VCOk'
const bot_id = '7480200186401275939'
const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
}
const eventSource = ref(null)
const numbers = ref([])

//数据处理函数
// let lastProcessedIndex = 0;

// function processMessageContent(content) {
//   let currentIndex = lastProcessedIndex;
//   let eventDeltaIndex = content.indexOf('event:conversation.message.delta', currentIndex);

//   while (eventDeltaIndex !== -1) {
//     // 找到下一个 'event:conversation.message.delta' 的位置
//     let nextEventDeltaIndex = content.indexOf('event:conversation.message.delta', eventDeltaIndex + 1);
//     let endEventDeltaIndex = nextEventDeltaIndex !== -1 ? nextEventDeltaIndex : content.length;

//     // 提取数据部分，移除"data:"前缀并找到 JSON 对象的结束位置 '}'
//     let dataString = content.substring(eventDeltaIndex, endEventDeltaIndex);
//     let dataIndex = dataString.indexOf('data:');
//     let jsonEndIndex = dataString.indexOf('}', dataIndex) + 1;

//     // 确保我们找到了完整的 JSON 对象
//     if (jsonEndIndex > 0 && dataString[jsonEndIndex - 1] === '}') {
//       try {
//         // 尝试解析 JSON 对象
//         const dataObject = JSON.parse(dataString.substring(dataIndex + 5, jsonEndIndex));
//         // 使用打字机效果逐字添加消息
//         typeMessage(dataObject.content, true);
//       } catch (error) {
//         console.error('Error parsing JSON:', error);
//       }

//       // 更新处理位置
//       currentIndex = eventDeltaIndex + jsonEndIndex;
//       eventDeltaIndex = nextEventDeltaIndex;
//     } else {
//       // 如果没有找到完整的 JSON 对象，则停止处理
//       break;
//     }
//   }
//   lastProcessedIndex = currentIndex;
// }
// let currentBubbleElement = null; // 用于存储当前正在打字的bubble元素
// function typeMessage(content, isLeft) {
//   // 初始化index
//   let index = 0;

//   // 如果当前bubble元素不存在，或者消息的方向改变了，创建一个新的bubble元素
//   if (!currentBubbleElement || !currentBubbleElement.classList.contains('bubble-left')) {
//     currentBubbleElement = document.createElement('div');
//     currentBubbleElement.className = 'bubble bubble-left'; // 总是使用'bubble-left'样式
//     currentBubbleElement.textContent = ''; // 初始化为空字符串

//     // 创建一个新的chat-message元素并添加bubble
//     const newMessage = document.createElement('div');
//     newMessage.className = `chat-message left`; // 确保消息总是使用'left'样式
//     newMessage.appendChild(currentBubbleElement);

//     // 将新消息添加到chatWindow
//     document.getElementById('chatWindow').appendChild(newMessage);
//   }

//   (function typeNextChar() {
//     // 逐字添加内容
//     if (index < content.length) {
//       currentBubbleElement.textContent += content[index]; // 逐字添加
//       index++; // 更新索引
//       requestAnimationFrame(typeNextChar); // 使用requestAnimationFrame模拟打字效果
//     }
//   })();
// }
// export const getStream=async (query)=>{
//   try{
//     const response = await fetch(streamUrl, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${apiKey}`
//       },
//       body: JSON.stringify({
//         bot_id,
//         user_id:"123",
//         stream:true,
//         auto_save_history:true,
//         additional_messages:[
//           {
//             role:'user',
//             content:query,
//             content_type:'text'

//           }

//         ]
//       })
//     });
//     // 创建一个可读流
//     const reader = response.body.getReader();
//     console.log(reader);
    
//     let messageContent = ''; // 用于累积消息内容
//     let decoder = new TextDecoder('utf-8');

//     while (true) {
//       const { done, value } = await reader.read();
//       if (done) {
//         console.log('Stream ended');
//         break;
//       }
//       const chunk = decoder.decode(value, { stream: true });
      
//       messageContent += chunk; // 累积消息内容
      

//     //   // 处理累积的消息内容
//       processMessageContent(messageContent);
//     }


//     // if(!response.ok){
//     //   throw new Error(`HTTP error! status: ${response.status}`);
//     // }

//     // console.log(response);

//     // const data = await response.json();
//     // return data.response; // 假设返回字段为 response
//   } catch (error) {
//       console.error('There was a problem with the fetch operation:', error);
//       return null
//   }

// }



export const getOutlineNew=(data)=>request.post(' https://api.coze.cn/v3/chat',
  {
      bot_id,
      user_id:"123",
      stream:true,
      // auto_save_history:true,
      additional_messages:[
        {
          role:'user',
          content:data,
          content_type:'text'

        }

      ]
  }
)

export const getResNew=()=>request.get('https://api.coze.cn/v1/conversation/message/retrieve',
  {
    conversation_id:"7480549280445464613",
    message_id:'7480549280445480997'
  }
)// 封装流式请求方法'

export const streamRequestTxt = async (content, onDataReceived )=> {
  try {
    const response = await fetch('https://api.coze.cn/v3/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        bot_id,
        user_id:"123",
        stream:true,
        auto_save_history:true,
        additional_messages:[
          {
            role:'user',
            content:'给我《高数》的教学大纲',
            content_type:'text'

          }

        ]
      })
    });

    // 处理非200响应
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 获取可读流和读取器
    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');
    let partialData = '';

    if (!reader) return;

    // 持续读取流数据
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // 解码并处理数据块
      const chunk = decoder.decode(value, { stream: true });
      partialData += chunk;

      // 处理可能的多个事件（按换行分割）
      const lines = partialData.split('\n');
      partialData = lines.pop() || ''; // 保留未完成的行

      for (const line of lines) {
        if (line.startsWith('')) {
          const jsonData = line.replace('', '');
          try {
            const parsed = JSON.parse(jsonData);
            if (parsed.content) {
              onDataReceived(parsed.content); // 触发回调更新UI
            }
          } catch (e) {
            console.error('JSON解析失败:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('流式请求失败:', error);
    throw error; // 向上传递错误
  }
}