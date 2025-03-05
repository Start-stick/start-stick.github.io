<script setup >
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'

const chartRef = ref(null)

onMounted(() => {
  const chart = echarts.init(chartRef.value)
//   chart.resize({
//     width:300,
//     height:200
// })
  chart.setOption({
    title : {
        text: '学情动态监控',
        // left: 'center'
    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['最高','最低']
    },
    toolbox: {
        show : false,
        orient: 'horizontal',      // 布局方式，默认为水平布局，可选为：
                                   // 'horizontal' ¦ 'vertical'
        x: 'right',                // 水平安放位置，默认为全图右对齐，可选为：
                                   // 'center' ¦ 'left' ¦ 'right'
                                   // ¦ {number}（x坐标，单位px）
        y: 'top',                  // 垂直安放位置，默认为全图顶端，可选为：
                                   // 'top' ¦ 'bottom' ¦ 'center'
                                   // ¦ {number}（y坐标，单位px）
        color : ['#1e90ff','#22bb22','#4b0082','#d2691e'],
        backgroundColor: 'rgba(0,0,0,0)', // 工具箱背景颜色
        borderColor: '#ccc',       // 工具箱边框颜色
        borderWidth: 0,            // 工具箱边框线宽，单位px，默认为0（无边框）
        padding: 5,                // 工具箱内边距，单位px，默认各方向内边距为5，
        showTitle: true,
        feature : {
            mark : {
                show : true,
                title : {
                    mark : '辅助线-开关',
                    markUndo : '辅助线-删除',
                    markClear : '辅助线-清空'
                },
                lineStyle : {
                    width : 1,
                    color : '#1e90ff',
                    type : 'dashed'
                }
            },
            dataZoom : {
                show : true,
                title : {
                    dataZoom : '区域缩放',
                    dataZoomReset : '区域缩放-后退'
                }
            },
            dataView : {
                show : true,
                title : '数据视图',
                readOnly: false,
                lang : ['数据视图', '关闭', '刷新']
            },
            magicType: {
                show : true,
                title : {
                    line : '动态类型切换-折线图',
                    bar : '动态类型切换-柱形图',
                    stack : '动态类型切换-堆积',
                    tiled : '动态类型切换-平铺'
                },
                type : ['line', 'bar', 'stack', 'tiled'],
            },
            restore : {
                show : true,
                title : '还原',
                color : 'black'
            },
            saveAsImage : {
                show : true,
                title : '保存为图片',
                type : 'jpeg',
                lang : ['点击本地保存'] 
            },
            myTool : {
                show : true,
                title : '自定义扩展方法',
                icon : 'image://../asset/ico/favicon.png',
                onclick : function (){
                    alert('myToolHandler')
                }
            }
        }
    },
    calculable : true,
    dataZoom : {
        show : true,
        realtime : true,
        // color : '#1e90ff',
        start : 40,
        end : 100
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : function (){
                var list = [];
                for (var i = 1; i <= 30; i++) {
                    list.push('2013-03-' + i);
                }
                return list;
            }()
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'学习时长',
            type:'line',
            // color:'#1e90ff',
            data:function (){
                var list = [];
                for (var i = 1; i <= 30; i++) {
                    list.push(Math.round(Math.random()* 16));
                }
                return list;
            }()
        },
        // {
        //     name:'最低',
        //     type:'line',
        //     data:function (){
        //         var list = [];
        //         for (var i = 1; i <= 30; i++) {
        //             list.push(Math.round(Math.random()* 10));
        //         }
        //         return list;
        //     }()
        // }
    ]
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
