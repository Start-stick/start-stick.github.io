import request from '@/utils/request'
import {ref} from 'vue'


const query='请根据以下学生进行学情分析：小明同学，每周学习25小时，一周互动10次，作业平均成绩80分，实验课平均成绩70分，90%出勤率，作业100%完成。'
const bycoze=async (query)=>{
    console.log('一键生成')

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
        

        const coze_status=ref("in_progress")
        const curTime=ref(0)
        const timer=setInterval(async ()=>{
            curTime.value++
            if(curTime.value>=30){
                console.log('数据量较大，拼命加载中，请耐心等待');
                
            }
            if(curTime.value>=120){
                console.log('超时');
                
                clearInterval(timer)
            }
            const res1=await request.get('https://api.coze.cn/v3/chat/retrieve', {
                params:{
                conversation_id,
                chat_id

                }

            });
            if(res1.data.data.status==='completed'){
                coze_status.value=res1?.data?.data?.status
                console.log(coze_status.value);
                console.log(res1);
                const res2=await request.get('https://api.coze.cn/v3/chat/message/list', {
                    params:{
                    conversation_id,
                    chat_id
                    }

                });
                console.log(res2.data.data[1].content);
                console.log(JSON.parse(res2.data.data[1].content));
                clearInterval(timer)
                return JSON.parse(res2.data.data[1].content)
            }
            },1000)
        

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return null
    }
}
export const  getAiAnalysis=(data)=>{
    const res=bycoze(query)
    return res
}