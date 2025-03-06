<script setup >
import * as echarts from 'echarts'
import { onMounted, ref, watch, watchEffect } from 'vue'
import { useTrackerStore } from '@/stores/tracker'


var dataStyle = {
    normal: {
        label: {show:false},
        labelLine: {show:false}
    }
};
var placeHolderStyle = {
    normal : {
        color: 'rgba(0,0,0,0)',
        label: {show:false},
        labelLine: {show:false}
    },
    emphasis : {
        color: 'rgba(0,0,0,0)'
    }
};

const chartRef = ref(null)
// const title = ref({
//         text: '圆环图',
//         // subtext: 'From ExcelHome',
//         link: 'http://e.weibo.com/1341556070/AhQXtjbqh',
//         // title位置
//         // x: 'center',
//         // y: 'center',
//         itemGap: 20,
//         // textStyle : {
//         //     color : 'rgba(30,144,255,0.8)',
//         //     fontFamily : '微软雅黑',
//         //     fontSize : 20,
//         //     fontWeight : 'bolder'
//         // }
//     },)
// const legend = ref(['68%的人表示过的不错','29%的人表示生活压力很大','3%的人表示“我姓曾”'])

// const xAxis =ref([  
//     ])
// const series = ref([
//         {
//             name:'1',
//             type:'pie',
//             clockWise:false,
//             radius : ['90%', '75%'],
//             itemStyle : dataStyle,
//             data:[
//                 {
//                     value:68,
//                     name:'68%的人表示过的不错'
//                 },
//                 {
//                     value:32,
//                     name:'invisible',
//                     itemStyle : placeHolderStyle
//                 }
//             ]
//         },
//         {
//             name:'2',
//             type:'pie',
//             clockWise:false,
//             radius : ['75%', '60%'],
//             itemStyle : dataStyle,
//             data:[
//                 {
//                     value:29, 
//                     name:'29%的人表示生活压力很大'
//                 },
//                 {
//                     value:71,
//                     name:'invisible',
//                     itemStyle : placeHolderStyle
//                 }
//             ]
//         },
//         {
//             name:'3',
//             type:'pie',
//             clockWise:false,
//             radius : ['60%', '45%'],
//             itemStyle : dataStyle,
//             data:[
//                 {
//                     value:3, 
//                     name:'3%的人表示“我姓曾”'
//                 },
//                 {
//                     value:97,
//                     name:'invisible',
//                     itemStyle : placeHolderStyle
//                 }
//             ]
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
  window.addEventListener('resize', () => {
    chart.resize()
  })

//   chart.resize({
//     width:300,
//     height:200
// })
window.addEventListener('resize', () => {
    chart.resize()
})
  chart.setOption({
    title: props.data.title,
    tooltip : {
        show: true,
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'vertical',
        right: '10%',
        itemGap:12,
        // data:legend.value
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            saveAsImage : {show: true}
        }
    },
    series : props.data.series
    });

})

</script>

<template>
  <div 
  class="chart chart-wrapper"
  ref="chartRef"
  >

  </div>
</template>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
  /* min-height: 300px; */
}

</style>
