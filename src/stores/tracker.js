import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTrackerStore = defineStore('tracker', () => {
    const isResize = ref(false)
    const setIsResize = (value) => {
        isResize.value = value
    }
    return { isResize, setIsResize }
})
