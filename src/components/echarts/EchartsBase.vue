<script setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  options: {
    type: Object,
    required: true
  }
})

const chartRef = ref(null)
let chart = null
let resizeObserver = null

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  chart.setOption(props.options)
}

// 处理窗口大小变化
const handleResize = () => {
  if (chart) {
    chart.resize()
  }
}

// 监听容器大小变化
const observeResize = () => {
  if (!chartRef.value) return
  
  resizeObserver = new ResizeObserver(() => {
    nextTick(() => {
      handleResize()
    })
  })
  
  resizeObserver.observe(chartRef.value)
}

onMounted(() => {
  initChart()
  observeResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (chart) {
    chart.dispose()
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  window.removeEventListener('resize', handleResize)
})

// 暴露更新方法
defineExpose({
  updateChart: (newOptions) => {
    if (chart) {
      chart.setOption(newOptions)
    }
  }
})
</script>

<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style> 