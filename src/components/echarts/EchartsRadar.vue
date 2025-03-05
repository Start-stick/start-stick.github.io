<script setup >
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'

const chartRef = ref(null)

//   chart.resize({
//     width:300,
//     height:200
// })
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

// 示例数据
const data = [
  { name: '数据类型与变量', value: 85 },
  { name: '函数', value: 92 },
  { name: '指针', value: 88 },
  { name: '内存管理', value: 78 },
  { name: '数组与字符串', value: 90 },
  { name: '文件操作', value: 86 }
]

// 计算最高值和最低值
const maxValue = Math.max(...data.map(item => item.value))
const minValue = Math.min(...data.map(item => item.value))
const maxItem = data.find(item => item.value === maxValue)
const minItem = data.find(item => item.value === minValue)

onMounted(() => {
  const chart = echarts.init(chartRef.value)
  window.addEventListener('resize', () => {
    chart.resize()
  })
  
  chart.setOption({
    title : {
        text: '知识点掌握情况',
        subtext: null// 隐藏标题副标题
    },
    tooltip : {
        trigger: 'item',
        position: function (pos, params) {
            //提示框跟随鼠标的位置显示
            // 坐标
            var obj = {
                left: '10%',
                top: '10%'
            };
        },
        formatter: function(params) {
          // 自定义提示框内容
          return `${params.name}: ${params.value}
最高: ${maxItem.name} (${maxValue})
最低: ${minItem.name} (${minValue})`
        }
    },
    legend: {
        x : 'right',
        y : 'bottom',
        data:['考试','作业']
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    // 颜色
    color : ['#0099ff','#00ff99'],
    //极坐标系，可以用于散点图和折线图。每个极坐标系拥有一个角度轴和一个半径轴。
    polar : [
        {
            indicator : [
                {text : '数据类型与变量', max  : 100},
                {text : '函数', max  : 100},
                {text : '指针', max  : 100},
                {text : '内存管理', max  : 100},
                {text : '数组与字符串', max  : 100},
                {text : '文件操作', max  : 100}
            ],
            // 雷达图的半径---大小
            radius : 60,
            // 雷达图的圆心---位置
            center : ['50%', '50%'],
            // shape : 'circle',// 雷达图的形状---圆形
            nameGap : 10,// 雷达图的名称---位置
            //雷达背景的颜色
            splitArea : {
                show : true,
                areaStyle : {
                    color : 'rgba(0,0,0,0)',
                    // shadowColor : 'blue',
                    // shadowBlur : 10,
                    // opacity : 0.5//雷达图数据线颜色
                }
            },
            axisLine : {
                lineStyle : {
                    // type: 'dashed' //dashed  solid dotted 射线类型【实线 虚线】
                    // color : 'rgba(0,0,0,0.2)'// 设置雷达图中间射线的颜色
                }
            },
            textStyle: {
                color: 'rgba(0,0,0,1)'//标题颜色
            },
            nameFormatter: function(params) {
            // 自定义格式化函数，value 是指示器名称，indicator 是指示器对象
            if (value.length > 3) {
                    // 如果名称长度超过三个字，进行换行处理
                    return value.substring(0, 3) + '\n' + value.substring(3);
                } else {
                    return value;
                }
            }
            
        }
    ],
    series : [
        {
            name: '完全实况球员数据',
            type: 'radar',
            itemStyle: {
                normal: {
                    areaStyle: {
                        type: 'default'
                    }
                }
            },
            data : [
                {
                    value : [97, 42, 88, 94, 90, 86],
                    name : '考试',
                    areaStyle: {
                        // color: 'rgba(0,0,0,0)'
                        opacity: 0.3
                    }
                },
                {
                    value : [97, 32, 74, 95, 88, 92],
                    name : '作业',
                    areaStyle: {
                        // color: 'rgba(0,0,0,0)'
                        opacity: 0.3
                    }
                }
            ]
        }
    ]
    });
})
</script>

<template>
  <div 
  class="chart"
  ref="chartRef"
  >

  </div>
</template>

<style scoped>
.chart{
    width: 100%;
    height: 100%;
}
</style>
