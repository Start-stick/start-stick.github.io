import request from '@/utils/request'
import { parseDate } from 'element-plus'
import {ref} from 'vue'


const app_id='1895304167887695872'
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

const abortController = ref<AbortController | null>(null)
const streamUrl = `https://open.bigmodel.cn/api/llm-application/open/v3/application/invoke`
const apiKey ='49613b99603942908e202474f204ead5.LYg0QJKY8Mkr6rjv'

const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
}
const eventSource = ref(null)
const numbers = ref([])

//流式获取大纲
export const getOutlineStream =async (data)=>{
    eventSource = new EventSource(streamUrl);
      
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data)//将字符串转换成json格式
        if (data.number !== 'done') {
          numbers.push(data.number);
        } else {
          eventSource.close();
        }
      };
      
      eventSource.onerror = (error) => {
        if (eventSource.readyState === EventSource.CLOSED) {
          console.log('Connection to server closed');
        } else {
          console.error('Error occurred:', error);
        }
      };
}

