import { useTrackerStore } from '@/stores/tracker'
import request from '@/utils/request'
import {ref} from 'vue'

const tracker=useTrackerStore() //用于改变is值，实时调控内容变化
const query='请根据以下学生进行学情分析：小明同学，每周学习25小时，一周互动10次，作业平均成绩80分，实验课平均成绩70分，90%出勤率，作业100%完成。'
const bycoze=async ({query,index})=>{
    console.log('一键生成')
    
    if(index===0){
        
        tracker.setIsAnalysis(1)
    }else{
        tracker.setIsSummary(1)
    }

    const streamUrl = `https://api.coze.cn/v3/chat`
    const apiKey = 'pat_DjueLDXeXdMtOmDd83u0svybLjPo05fEFhgkBZcCoNFECUxWLgcpghQircY5VCOk'
    const bot_id = '7482348702477205539'

    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
    }
    try {
        const response = await request.post(streamUrl, {
                bot_id,
                user_id: "123",
                auto_save_history: true,
                additional_messages: [
                    {
                        role: 'user',
                        content: query,
                        content_type: 'text'

                    }

                ]
        });
        console.log(response);
        const conversation_id=response.data.data.conversation_id
        const chat_id=response.data.data.id
        console.log(conversation_id);
        console.log(chat_id);
        

        // 封装轮询逻辑为 Promise
        const pollStatus = async () => {
            return new Promise(async (resolve, reject) => {
                let curTime = 0
                const timer = setInterval(async () => {
                    curTime++
                    if (curTime >= 30) {
                        console.log('数据量较大，拼命加载中，请耐心等待')
                    }
                    if (curTime >= 120) {
                        console.log('超时')
                        clearInterval(timer)
                        reject(new Error('请求超时'))
                        // 更新 tracker 状态
                        if (index === 0) {
                            tracker.setIsAnalysis(0)
                        } else {
                            tracker.setIsSummary(0)
                        }
                        ElMessage.error('请求超时，请重试！')
                    }

                    try {
                        const res1 = await request.get('https://api.coze.cn/v3/chat/retrieve', {
                            params: {
                                conversation_id,
                                chat_id,
                            },
                        })
                        

                        if (res1.data.data.status === 'completed') {
                            console.log('任务完成')

                            // 获取消息列表
                            const res2 = await request.get('https://api.coze.cn/v3/chat/message/list', {
                                params: {
                                    conversation_id,
                                    chat_id,
                                },
                            })

                            // 检查 res2.data.data[1].content 是否存在
                            if (res2.data.data[1] && res2.data.data[1].content) {
                                const content = JSON.parse(res2.data.data[1].content)

                                // 更新 tracker 状态
                                if (index === 0) {
                                    tracker.setIsAnalysis(2)
                                } else {
                                    tracker.setIsSummary(2)
                                }

                                

                                clearInterval(timer)
                                resolve(content) // 返回解析后的内容
                            } else {
                                console.error('res2.data.data[1].content 不存在')
                                clearInterval(timer)
                                reject(new Error('解析失败：content 字段为空'))
                                // 更新 tracker 状态
                                if (index === 0) {
                                    tracker.setIsAnalysis(0)
                                } else {
                                    tracker.setIsSummary(0)
                                }
                                ElMessage.error('加载失败，请重试！')
                            }
                        }
                    } catch (error) {
                        console.error('轮询失败:', error)
                        clearInterval(timer)
                        reject(error)
                        // 更新 tracker 状态
                        if (index === 0) {
                            tracker.setIsAnalysis(0)
                        } else {
                            tracker.setIsSummary(0)
                        }
                        ElMessage.error('加载失败，请重试！')
                    }
                }, 1000)
            })
        }
        // 调用轮询逻辑并返回结果

        return await pollStatus()
        

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return null
    }
}
export const  getAiAnalysis=async (data)=>{
    const res=await bycoze({query,index:0})
    console.log(res);
    
    return res
}
export const  getAiSummary=async (data)=>{
    const res=await bycoze({query,index:1})
    console.log(res);
    
    return res
}