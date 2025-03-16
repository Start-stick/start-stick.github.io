import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMessagesStore = defineStore('messages', ()=>{
    const ask=ref([[],[]])
    const answer=ref([[],[]])

    const setAsk=({text,index1,index2})=>{
        ask.value[index1][index2]=text
    }
    const setAnswer=({text,index1,index2})=>{
        answer.value[index1][index2]=text
    }

    const addAsk=(index1)=>{
        ask.value[index1].push('')
    }
    const addAnswer=(index1)=>{
        answer.value[index1].push('')
    }

    // 是否开始生成中
    const startGenerating=ref([false,false])
    const setStartGenerating=(index1,value)=>{
        startGenerating.value[index1]=value
    }
    // 是否正在生成中
    const isGenerating=ref([false,false])
    const setIsGenerating=(index1,value)=>{
        isGenerating.value[index1]=value
    }


    return {ask,answer,setAsk,setAnswer,addAsk,addAnswer,startGenerating,setStartGenerating,isGenerating,setIsGenerating}
    
})

