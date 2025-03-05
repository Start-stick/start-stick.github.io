<script setup>
import { ref } from 'vue'
// import EchartsLine from '@/components/echarts/echartsLine.vue'
import EchartsBar from '@/components/echarts/EchartsBar.vue'
import EchartsPie from '@/components/echarts/EchartsPie.vue'
import EchartsRadar from '@/components/echarts/EchartsRadar.vue'
import { DataAnalysis, Collection, Reading, Refresh } from '@element-plus/icons-vue'

// 定义标题数据
const title = [
  {
    name: '在线学习行为追踪',
    icon: 'Track',
    child: [
      '学习时长与专注度',
      '学习进度与知识点掌握情况',
      '学习资源使用情况',
      '学习行为分析'
    ]
  },
  {
    name: '学业表现分析',
    icon: 'Analysis',
    child: [
      '作业与测试成绩-折线图',
      '知识点掌握图谱-知识点热力图'
    ]
  },
  {
    name: '学习习惯与时间管理',
    icon: 'Time',
    child: [
      '学习时段分布-折线图',
      '任务完成效率-饼图'
    ]
  }
]

// 刷新数据
const isRefreshing = ref(false)
const handleRefresh = () => {
  isRefreshing.value = true
  // 模拟刷新数据
  setTimeout(() => {
    isRefreshing.value = false
    ElMessage.success('数据已更新')
  }, 1000)
}

// 时间范围选择
const dateRange = ref('')
const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  }
]

//规定可视化模块的宽高
const chartWidth = '600px';
const chartHeight = '200px';
</script>

<template>
    <div class="learn-tracker">
        <!-- 顶部操作栏 -->
        <div class="tracker-header">
            <div class="header-left">
                <h2 class="main-title">学情看板</h2>
                <el-tag type="info" effect="light" style="padding: 4px;" >实时数据</el-tag>
            </div>
            <div class="header-right">
                <el-date-picker
                    v-model="dateRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :shortcuts="shortcuts"
                    size="small"
                />
                <el-button 
                    type="primary" 
                    :icon="Refresh"
                    :loading="isRefreshing"
                    @click="handleRefresh"
                    size="small"
                >
                    刷新数据
                </el-button>
            </div>
        </div>

        <div class="learn-status">
            <div class="learn-status-main">
                <h3 class="title">学情分析</h3>
                <div class="status-list list">
                    <div class="learn-behavior item">
                        <div class="echarts-whole" style="width: 100%; height: 100%;">
                            <EchartsBar 
                            :chartWidth="chartWidth"
                            :chartHeight="chartHeight"
                            />
                        </div>
                    </div>
                    <div class="learn-grade item">
                        <div class="echarts-half" style="width: 50%; height: 100%;">
                            <EchartsLine 
                            :chartWidth="chartWidth"
                            :chartHeight="chartHeight"
                            />
                        </div>
                        <span></span>
                        <div class="echarts-half" style="width: 50%; height: 100%;">
                            <EchartsLine 
                            :chartWidth="chartWidth"
                            :chartHeight="chartHeight"
                            />
                        </div>
                    </div>
                    <div class="learn-habit item">
                        <div class="echarts-half" style="width: 50%; height: 100%;">
                            <EchartsPie 
                            :data="[1,1,2,25,36,258,45]"
                            :chartWidth="chartWidth"
                            :chartHeight="chartHeight"
                            />
                        </div>
                        <span></span>
                        <div class="echarts-half" style="width: 50%; height: 100%;">
                            <EchartsLine 
                            :chartWidth="chartWidth"
                            :chartHeight="chartHeight"
                            />
                        </div>
                    </div>
                </div>

                
            </div>
            <div class="learn-status-aside">
                <h3 class="title">智能分析</h3>
                <div class="ai-list list">
                    <div class="ai-behavior ai-item item">

                    </div>
                    <div class="ai-grade ai-item item item-have-border">
                        <div class="echarts-half" style="width: 50%; height: 100%;">
                            <EchartsRadar
                            :chartWidth="chartWidth"
                            :chartHeight="chartHeight"
                            />
                        </div>

                    </div>
                    <div class="ai-habit ai-item item">
                        
                    </div>
                </div>
            </div>
        </div>
        <div class="learn-summary">
            <h3 class="title">学情总结</h3>
            <div class="summary-container">
                <!-- 情况分析 -->
                <div class="summary-item analysis">
                    <div class="item-header">
                        <h4>情况分析</h4>
                        <el-icon><DataAnalysis /></el-icon>
                    </div>
                    <div class="item-content">
                        <p>1. 学习进度：目前已完成80%的课程内容，整体进度良好。</p>
                        <p>2. 知识掌握：在函数和数组操作方面表现优秀，但指针和内存管理需要加强。</p>
                        <p>3. 学习习惯：每周学习时长稳定，但晚间学习效率有待提高。</p>
                    </div>
                </div>

                <!-- 资源推荐 -->
                <div class="summary-item resource">
                    <div class="item-header">
                        <h4>资源推荐</h4>
                        <el-icon><Collection /></el-icon>
                    </div>
                    <div class="item-content">
                        <ul class="resource-list">
                            <li>
                                <span class="resource-type">视频</span>
                                <span class="resource-name">指针与内存管理精讲</span>
                                <el-button type="primary" link>查看</el-button>
                            </li>
                            <li>
                                <span class="resource-type">文档</span>
                                <span class="resource-name">C语言内存管理最佳实践</span>
                                <el-button type="primary" link>查看</el-button>
                            </li>
                            <li>
                                <span class="resource-type">实验</span>
                                <span class="resource-name">指针操作实战演练</span>
                                <el-button type="primary" link>查看</el-button>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- 题目推荐 -->
                <div class="summary-item exercise">
                    <div class="item-header">
                        <h4>题目推荐</h4>
                        <el-icon><Reading /></el-icon>
                    </div>
                    <div class="item-content">
                        <ul class="exercise-list">
                            <li>
                                <span class="exercise-difficulty easy">简单</span>
                                <span class="exercise-title">指针数组基础操作</span>
                                <el-button type="primary" link>练习</el-button>
                            </li>
                            <li>
                                <span class="exercise-difficulty medium">中等</span>
                                <span class="exercise-title">动态内存分配应用</span>
                                <el-button type="primary" link>练习</el-button>
                            </li>
                            <li>
                                <span class="exercise-difficulty hard">困难</span>
                                <span class="exercise-title">复杂数据结构内存管理</span>
                                <el-button type="primary" link>练习</el-button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.echarts-whole{
    width: 100%;
    height: 100%;
}
.echarts-half{
    width: 50%;
    height: 100%;
}
//所有单独项样式设置
.list{
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 100%;
    .item{
        padding: 20px;
        display: flex;
        flex-direction: row;
        border-radius: 10px;
        // background-color: pink;
        height: 320px;
        background-color: #fff;
        span{
            display: flex;
            justify-content: center;
            align-items: center;
            &::after{
                content: '';
                width: 2px;
                margin: 0 10px;
                height:70%;
                background-color: #cad5e6;
            }
        }
    }
}
h3.title{
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    color: #333;
    background: url('@/assets/xueqing1.png') no-repeat 0 center;
    background-size: 30px 30px;
    padding-left: 30px;
}

*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
li{
    list-style: none;
}
.learn-tracker{
    display: flex;
    // background: url('@/assets/mainBg.png') no-repeat center center;
    background-size: cover;
    flex-direction: column;
    width: 100%;
    min-width: 1040px;
    gap: 20px;
    padding: 20px;
}

.learn-summary{
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

    .summary-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-top: 20px;
    }

    .summary-item {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 16px;

        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e4e7ed;

            h4 {
                font-size: 16px;
                color: #303133;
                margin: 0;
            }

            .el-icon {
                font-size: 20px;
                color: #409EFF;
            }
        }

        .item-content {
            font-size: 14px;
            color: #606266;
            line-height: 1.6;
        }
    }

    .resource-list, .exercise-list {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
            display: flex;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px dashed #e4e7ed;

            &:last-child {
                border-bottom: none;
            }
        }
    }

    .resource-type {
        background: #ecf5ff;
        color: #409EFF;
        padding: 2px 8px;
        border-radius: 4px;
        margin-right: 10px;
        font-size: 12px;
    }

    .resource-name, .exercise-title {
        flex: 1;
        margin: 0 10px;
    }

    .exercise-difficulty {
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
        margin-right: 10px;

        &.easy {
            background: #f0f9eb;
            color: #67c23a;
        }

        &.medium {
            background: #fdf6ec;
            color: #e6a23c;
        }

        &.hard {
            background: #fef0f0;
            color: #f56c6c;
        }
    }
}


//以下是优化内容
.tracker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

    .header-left {
        display: flex;
        align-items: center;
        gap: 12px;

        .main-title {
            font-size: 18px;
            font-weight: 500;
            color: #303133;
            margin: 0;
        }
    }

    .header-right {
        display: flex;
        align-items: center;
        gap: 12px;
    }
}


.learn-status {
    display: flex;
    gap: 20px;
    
    .learn-status-main {
        flex: 3;
        background: #fff;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

        .title {
            margin-bottom: 20px;
        }

        .status-list {
            gap: 20px;
            
            .item {
                background: #f8f9fa;
                transition: all 0.3s ease;
                
                &:hover {
                    // transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
            }
        }
    }

    .learn-status-aside {
        flex: 2;
        background: #fff;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

        .title{
            margin-bottom: 20px;
        }

        .ai-list {
            gap: 20px;
            
            .ai-item {
                background: #f8f9fa;
                transition: all 0.3s ease;
                
                &:hover {
                    transform: translateY(-2px);
                    // box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
            }
        }
    }
}


</style>