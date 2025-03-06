<script setup >
import * as echarts from 'echarts'
import { onMounted, ref,  } from 'vue'
import { useTrackerStore } from '@/stores/tracker'

const chartRef = ref(null)

// const title = ref({
//     text: '学情动态监控',
//     subtext: 'From ExcelHome',
//     // left: 'center'
// })
// const legend = ref(['互动参与度','学习时长'])
// const xAxis =ref([
//         {
//             type : 'category',
//             data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
//         }
//     ])
// const series = ref([
//         {
//             name:'互动参与度',
//             type:'line',
//             color:'#68bea8',
//             unit:'%',
//             data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
//             // 最大小值
//             markPoint : {
//                 symbolSize: 13,
//                 symbol: 'diamond',
//                 data : [
//                     {type : 'max', name: '最大值'},
//                     {type : 'min', name: '最小值'}
//                 ]
//             },
//             markLine : {
//                 data : [
//                     {type : 'average', name: '平均值'}
//                 ]
//             }
//         },
//         {
//             name:'学习时长',
//             type:'line',
//             unit:'h',
//             data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
//             // 最大小值
//             // markPoint : {
//             //     data : [
//             //         {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183, symbolSize:18},
//             //         {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
//             //     ]
//             // },
//             markLine : {
//                 data : [
//                     {type : 'average', name : '平均值'}
//                 ]
//             }
//         }
//     ])
// const props = defineProps({
//     title:Object,
//     legend:Array,
//     xAxis:Array,
//     series:Array
// })
const props = defineProps({
    data:Object
})


onMounted(() => {
  const chart = echarts.init(chartRef.value)
//   chart.resize({
//     width:300,
//     height:200
// })
window.addEventListener('resize', () => {
    chart.resize()
})
const trackerStore = useTrackerStore()
  chart.setOption({
    title : props.data.title,
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:props.data.legend
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
    xAxis : props.data.xAxis,
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
