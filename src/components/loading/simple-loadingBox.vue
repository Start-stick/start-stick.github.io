<script setup>
import { defineProps, onMounted, ref, watchEffect } from 'vue';

const props=defineProps({
    stage:{
        type:Number,
        required:true
    }
})
const stage=ref(Number(props.stage))
// onMounted(()=>{

//     console.log(props.stage);
//     document.querySelector('#stage_01').style.setProperty('--progress','100%')
//     document.querySelector('#stage_02').style.setProperty('--progress','0%')
//     // document.querySelector('#stage_02').style.setProperty('--progress',props.progress2)
// })
// watchEffect(()=>{
//     document.querySelector('#stage_01').style.setProperty('--progress',props.progress1)
//     document.querySelector('#stage_02').style.setProperty('--progress',props.progress2)
// })
</script>

<template>
    <!-- 加载动画 -->
    <div class="loading-box" >
        
        <div class="loading-stage">
          <span class="stage-item search" :class="{ done: stage >= 2 }">智能分析</span>
        </div>

        <div class="loading_container">
          <div class="loading_progress" ref="stage02" id="stage_02" style="--progress: 20%; transition-duration: 0.5s; transition-timing-function: cubic-bezier(0, 0, 0, 0);">

          </div>
        </div>

        <div class="loading-stage">
          <span class="stage-item success" :class="{ done: stage >= 3 }">完成</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
// 加载样式
.loading-box{
    // width: 900px;
    width: 100%;
    height: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color:#CCD8E7;
  .loading_container{
    width: 50px;
    height: 3px;
    margin:  0 5px;
    border-radius: 999px;
    background-color: #CCD8E7;
    overflow: hidden;
    .loading_progress{
      width: var(--progress,0%);
      height: inherit;
      background: #3A8BFF;

    }
  }
  .loading-stage{

    .stage-item{
      display: flex;
      align-items: center;
      filter: grayscale(100%);
      opacity: .6;
      height: 20px;
      color: #131B26;
      font-size: 14px;
    }
    ::before{
      content: '';
      padding-right: 10px;
      display: inline-block;
      background: url('@/assets/icon-analysis-blue.png') no-repeat left ;
      background-size: 18px 18px;
      width: 18px;
      height: 18px;
    }
    .search::before{
      background: url('@/assets/icon-search-blue.png') no-repeat left ;
      background-size: 18px 18px;
    }
    .success::before{
      background: url('@/assets/icon-success-blue.png') no-repeat left ;
      background-size: 18px 18px;
    }
  }
  
  .stage-item.done{
    filter: grayscale(0) ;
    opacity: 1 ;
    transition: all .3s;
  }
}
</style>