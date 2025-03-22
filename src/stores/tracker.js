import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTrackerStore = defineStore('tracker', () => {
    const isResize = ref(false)
    const setIsResize = (value) => {
        isResize.value = value
    }
    //标志是否在生成中
    const isAnalysis=ref(0)
    const setIsAnalysis=(value)=>{
        isAnalysis.value=value
    }
    const isSummary=ref(0)
    const setIsSummary=(value)=>{
        isSummary.value=value
    }
    //控制进度条
    const stage=ref([0,0])
    const setStage=(index,value)=>{
        stage.value[index]=value
        
        
    }
    //智能分析结果
    const aiAnalysis=ref(null)
    const setAiAnlysis=(value)=>{
        aiAnalysis.value=value
    }

    return { isResize, setIsResize,isAnalysis,setIsAnalysis,isSummary,setIsSummary ,stage,setStage,aiAnalysis,setAiAnlysis}
})
