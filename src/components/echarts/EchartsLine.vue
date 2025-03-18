<script setup >
import * as echarts from 'echarts'
import { onMounted, ref,  watchEffect } from 'vue'
import { useTrackerStore } from '@/stores/tracker'

const chartRef = ref(null)

// const title = ref({
//     text: '学情动态监控',
//     subtext: 'From ExcelHome',
//     // left: 'center'
// })
// const legend = ref(['学习时长'])
// const xAxis = function (){
//                 var list = [];
//                 for (var i = 1; i <= 30; i++) {
//                     list.push('2013-03-' + i);
//                 }
//                 return list;
//             }()
// const series = ref([
//     {
//         name:'学习时长',
//         type:'line',
//         // color:'#1e90ff',
//         data:function (){
//             var list = [];
//             for (var i = 1; i <= 30; i++) {
//                 list.push(Math.round(Math.random()* 16));
//             }
//             return list;
//             }()
//     }
// ])
// const props = defineProps({
//     title:Object,
//     legend:Array,
//     xAxis:Array,
//     series:Array
// })

const props = defineProps({
    data:Object,
})
onMounted(() => {
  const chart = echarts.init(chartRef.value)
//   chart.resize({
//     width:300,
//     height:200
// })
    const trackerStore = useTrackerStore()
    window.addEventListener('resize', () => {
        console.log('222窗口大小变化');
        console.log(trackerStore.isResize);
        if(chart)
        chart.resize()
    })
    watchEffect(()=>{
        if(trackerStore.isResize){
            console.log('333窗口大小变化');
            console.log(trackerStore.isResize);
            trackerStore.setIsResize(false)
            chart.resize()
            console.log('333变化完毕');
            
        }
        
    })
  chart.setOption({
    title : props.data.title,
    tooltip : {
        trigger: 'axis',
    },
    legend: {
        data:props.data.legend,
        right: '10%',
        // bottom: '10%'
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            // dataView : {show: true, readOnly: false},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis :props.data.xAxis,
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : props.data.series
    });
})
</script>

<template>
  <div 
  class="chart"
  ref="chartRef"
  style="width: 100%; height: 100%;"
  >

  </div>
</template>

<style scoped>

</style>
