import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMyClassStore = defineStore('myclass',()=>{
    const classList=ref([
        {
          id: 1,
          className: '2班',
          subject: 'programming',
          studentCount: 0,
          classCode: '10012A',
          classAvatar: null
        },
        {
          id: 2,
          className: 'C语言教学',
          subject: 'programming',
          studentCount: 1,
          classCode: '10013B',
          classAvatar: null
        }
      ])
    const setClassList=(list)=>{
        classList.value=list
    }
    
    //增删改查
    const addClass=(newClass)=>{
        classList.value.push(newClass)
    }
    const updateClass=(id,newClass)=>{
        const index=classList.value.findIndex(item=>item.id===id)
        if(index!==-1){
            classList.value[index]=newClass
        }
    }
    const deleteClass=(index)=>{
        classList.value=classList.value.filter(item=>item.id!==index)
    }
    const findClass=(id)=>{
        return classList.value.find(item=>item.id===id)
    }

    //返回数据
    return {
        classList,
        setClassList,
        addClass,
        deleteClass,
        findClass,
        updateClass
    }   
})

