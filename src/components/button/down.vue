<script setup>
import { Download } from '@element-plus/icons-vue';
import { ref ,nextTick,watchEffect} from 'vue';
import { marked } from 'marked';
import handleExportWord from "xh-htmlword";
import { ElMessage } from 'element-plus'

const props=defineProps({
    editorContent:{
        type:String,
        required:true
    },
    title:{
        type:String,
        default:'教学大纲'
    },
})
const mdContentToHtml=ref('')
console.log(props.editorContent);

watchEffect(() => {
    mdContentToHtml.value = marked(props.editorContent)
})
// 导出Word文档
const exportWord = () => {
  if (!props.editorContent) {
    ElMessage.warning('暂无内容可导出')
    return
  }
  nextTick(() => {
  document.querySelector('.export-box').innerHTML = mdContentToHtml.value   
  handleExportWord({
      dom:".export-box",
      fileName:props.title, 
      callBack: () => {
      ElMessage.success('导出成功');
    },
  })
  document.querySelector('.export-box').innerHTML = ''
})
}
</script>

<template>
  <el-button type="primary" :icon="Download" @click="exportWord" style="background-color: #4a6efa">
    下载
  </el-button>
  <div class="export-box">
  </div>
</template>

<style lang="scss" scoped>
.button {
    padding: 15px 8px ;
    font-size: 14px;
    color: #fff;
    border-radius: 6px;
    background-color: #4a6efa;
    border: none;
    transition: all 0.3s ease;
    
    &:hover {
        box-shadow: 0 4px 12px rgba(78, 110, 242, 0.2);
    }
    
    span {
        margin-right: 8px;
    }
}

.export-box{
  display: inline;
  height: 0;
  overflow: hidden;
}
</style>