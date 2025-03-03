import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMessagesStore = defineStore('messages', ()=>{
    const ask=ref([])
    const answer=ref([])

    const setAsk=({text,index})=>{
        ask.value[index]=text
    }
    const setAnswer=({text,index})=>{
        answer.value[index]=text
    }

    const addAsk=()=>{
        ask.value.push('')
    }
    const addAnswer=()=>{
        answer.value.push('')
    }

    // 是否开始生成中
    const startGenerating=ref(false)
    const setStartGenerating=(value)=>{
        startGenerating.value=value
    }
    // 是否正在生成中
    const isGenerating=ref(false)
    const setIsGenerating=(value)=>{
        isGenerating.value=value
    }


    return {ask,answer,setAsk,setAnswer,addAsk,addAnswer,startGenerating,setStartGenerating,isGenerating,setIsGenerating}
    
})


