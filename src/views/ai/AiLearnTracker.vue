<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue'
// import EchartsLine from '@/components/echarts/echartsLine.vue'
import EchartsBar from '@/components/echarts/EchartsBar.vue'
import EchartsPie from '@/components/echarts/EchartsPie.vue'
import EchartsRadar from '@/components/echarts/EchartsRadar.vue'
import { DataAnalysis, Collection, Reading, Refresh,Histogram,Loading } from '@element-plus/icons-vue'
import { learningData,aiSummary } from './AiEcharts.js'
import { useRouter } from 'vue-router'
import { useTrackerStore } from '@/stores/tracker'
import { getAiAnalysis, getAiSummary } from '@/api/LearnTracker.js'

console.log(learningData);


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

// 智能分析数据
const aiAnalysis = ref({
  behavior: {
    tag:'良好1',
    type:"success",
    summary: '该学生整体学习投入度良好，但存在注意力分散的情况。',
    strengths: [
      '每周学习时长稳定，平均18小时',
      '课堂参与度高，经常互动提问',
      '完成作业认真，质量较好'
    ],
    suggestions: [
      '建议适当增加每次学习的专注时长',
      '可以尝试番茄工作法提高效率',
      '建议做好课前预习，提高课堂吸收效率'
    ]
  },
  performance: {
    tag:'需加强2',
    type:"info",
    summary: '学习成绩稳定上升，但部分知识点掌握不够扎实。',
    strengths: [
      '基础知识掌握扎实',
      '实践能力较强',
      '学习态度积极'
    ],
    weakPoints: [
      '指针概念理解不够深入',
      '内存管理部分需要加强',
      '算法思维有待提升'
    ]
  },
  habits: {
    tag:'待改进3',
    type:"warning",
    summary: '学习习惯较好，但时间管理还需优化。',
    goodHabits: [
      '按时上课，出勤率高',
      '能够及时完成作业',
      '善于总结归纳'
    ],
    improvements: [
      '建议合理安排学习时间',
      '可以制定更详细的学习计划',
      '注意劳逸结合，保持学习效率'
    ]
  }
})

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


const trackerStore = useTrackerStore()
window.addEventListener('resize', () => {
    console.log(trackerStore.isResize);
    
    trackerStore.setIsResize(true)
    console.log('窗口大小变化');
    
})

// // 监听窗口大小变化---只能先这样
// const router = useRouter()
// window.addEventListener('resize', () => {
//     router.go(0)
// })


//控制加载动画的显示
//控制分析区域
const tracker=useTrackerStore()
const aiAnalysisStage=ref(0)//控制分析区域分情况显示
const progress=ref(0)
const clickForAnalysis=async ()=>{
    const res=await getAiAnalysis()
    aiAnalysis.value=res.aiAnalysis
    console.log(aiAnalysis.value);
    
    
}
watchEffect(async ()=>{
    if(tracker.isAnalysis===1){  
        aiAnalysisStage.value=-1
        tracker.setStage(0,2)
        
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟 1 秒延迟
        updateProgress('#analysis #stage_02',20)
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟 1 秒延迟
        updateProgress('#analysis  #stage_02',40)
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟 1 秒延迟
        updateProgress('#analysis  #stage_02',60)

    }
    else  if(tracker.isAnalysis===2) {        
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟 1 秒延迟
        updateProgress('#analysis  #stage_02',100)
        // await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟 1 秒延迟
        tracker.setStage(0,3)
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟 1 秒延迟
        updateProgress('#analysis  #stage_02',0)
        aiAnalysisStage.value =1
    }
    else{
        aiAnalysisStage.value=0
    }
    
})
//总结点击动画
const aiSummaryStage=ref(0)//控制总结区域分情况显示
const clickForSummary=async ()=>{
    const res=ref(null)
    nextTick(async ()=>{
        res.value=await getAiSummary()

    })
    console.log(res.value);
    
}
watchEffect(async ()=>{
    if(tracker.isSummary===1){  
        
        aiSummaryStage.value=-1
        tracker.setStage(1,2)
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟 1 秒延迟
        updateProgress('#summary #stage_02',20)
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟 1 秒延迟
        updateProgress('#summary #stage_02',40)
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟 1 秒延迟
        updateProgress('#summary #stage_02',60)

    }
    else  if(tracker.isSummary===2) {        
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟 1 秒延迟
        updateProgress('#summary #stage_02',100)
        tracker.setStage(1,3)
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟 1 秒延迟
        updateProgress('#summary #stage_02',0)
        aiSummaryStage.value =1
    }
    else{
        aiSummaryStage.value=0
    }
    
})
// 更新进度条
function updateProgress(key,value) {
    progress.value = value;
    document.querySelector(key)?.style.setProperty('--progress', `${progress.value}%`);
}
onBeforeUnmount(()=>{
    tracker.isAnalysis=0
    tracker.isSummary=0
})
</script>

<template>
    <div class="learn-tracker scrollbar-8">
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
                    style="padding: 4px;"
                >
                    刷新数据
                </el-button>
            </div>
        </div>

        <div class="learn-status">
            <div class="learn-status-main">
                <h3 class="title">学情分析</h3>
                <div class="status-list list scrollbar-6">
                    <div class="learn-behavior item scrollbar-4">
                        <div class="echarts-whole" style="width: 100%; height: 100%;">
                            <EchartsBar 
                            :data="learningData.studyBehavior.timeAndInteraction"
                            :chartWidth="chartWidth"
                            :chartHeight="chartHeight"
                            />
                        </div>
                    </div>
                    <div class="learn-grade item scrollbar-4">
                        <div class="echarts-half" style="width: 50%; height: 100%;">
                            <EchartsLine 
                            :data="learningData.performance.scoreAnalysis"
                            :chartWidth="chartWidth"
                            :chartHeight="chartHeight"
                            />
                        </div>
                        <span></span>
                        <div class="echarts-half" style="width: 50%; height: 100%;">
                            <EchartsRadar 
                            :data="learningData.performance.knowledgeRadar"
                            :chartWidth="chartWidth"
                            :chartHeight="chartHeight"
                            />
                        </div>
                    </div>
                    <div class="learn-habit item scrollbar-4">
                        <div class="echarts-half" style="width: 50%; height: 100%;">
                            <EchartsPie 
                            :data="learningData.studyHabits.timeDistribution"
                            :chartWidth="chartWidth"
                            :chartHeight="chartHeight"
                            />
                        </div>
                        <span></span>
                        <div class="echarts-half" style="width: 50%; height: 100%;">
                            <EchartsPie
                            :data="learningData.studyHabits.taskCompletion"
                            :chartWidth="chartWidth"
                            :chartHeight="chartHeight"
                            />
                        </div>
                    </div>
                </div>

                
            </div>
            <div class="learn-status-aside">
                
                <div class="ai-header">
                <h3 class="title">
                    智能分析
                </h3>
                <el-icon @click="clickForAnalysis" v-show="tracker.isAnalysis!==1"><Histogram /></el-icon>
                <el-icon v-show="tracker.isAnalysis===1" class="loadingIcon"><Loading /></el-icon>
                </div>
                <div class="ai-list list scrollbar-6" v-show="aiAnalysisStage===1">
                    <!-- 学习行为分析 -->
                    <div class="ai-behavior ai-item item">
                        <div class="ai-header">
                            <div class="ai-title">
                                <el-icon><DataAnalysis /></el-icon>
                                <span>学习行为分析</span>
                            </div>
                            <el-tag size="small" :type="aiAnalysis.behavior.type">{{ aiAnalysis.behavior.tag }}</el-tag>
                        </div>
                        <div class="ai-content">
                            <p class="summary">{{ aiAnalysis.behavior.summary }}</p>
                            <div class="analysis-section">
                                <h5>学习优势</h5>
                                <ul>
                                <li v-for="(item, index) in aiAnalysis.behavior.strengths" 
                                    :key="'strength-'+index">
                                    {{ item }}
                                </li>
                                </ul>
                            </div>
                            <div class="analysis-section">
                                <h5>改进建议</h5>
                                <ul>
                                    <li v-for="(item, index) in aiAnalysis.behavior.suggestions" 
                                        :key="'suggestion-'+index">
                                        {{ item }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- 学业表现分析 -->
                    <div class="ai-grade ai-item item">
                        <div class="ai-header">
                        <div class="ai-title">
                            <el-icon><Reading /></el-icon>
                            <span>学业表现分析</span>
                        </div>
                        <el-tag size="small" :type="aiAnalysis.performance.type">{{ aiAnalysis.performance.tag }}</el-tag>
                        </div>
                        <div class="ai-content">
                        <p class="summary">{{ aiAnalysis.performance.summary }}</p>
                        <div class="analysis-section">
                            <h5>掌握情况</h5>
                            <ul>
                            <li v-for="(item, index) in aiAnalysis.performance.strengths" 
                                :key="'mastery-'+index">
                                {{ item }}
                            </li>
                            </ul>
                        </div>
                        <div class="analysis-section">
                            <h5>薄弱知识点</h5>
                            <ul>
                            <li v-for="(item, index) in aiAnalysis.performance.weakPoints" 
                                :key="'weak-'+index"
                                class="weak-point">
                                {{ item }}
                            </li>
                            </ul>
                        </div>
                        </div>
                    </div>

                    <!-- 学习习惯分析 -->
                    <div class="ai-habit ai-item item">
                        <div class="ai-header">
                        <div class="ai-title">
                            <el-icon><Collection /></el-icon>
                            <span>学习习惯分析</span>
                        </div>
                        <el-tag size="small" :type="aiAnalysis.habits.type">{{ aiAnalysis.habits.tag }}</el-tag>
                        </div>
                        <div class="ai-content">
                        <p class="summary">{{ aiAnalysis.habits.summary }}</p>
                        <div class="analysis-section">
                            <h5>良好习惯</h5>
                            <ul>
                            <li v-for="(item, index) in aiAnalysis.habits.goodHabits" 
                                :key="'habit-'+index">
                                {{ item }}
                            </li>
                            </ul>
                        </div>
                        <div class="analysis-section">
                            <h5>建议改进</h5>
                            <ul>
                            <li v-for="(item, index) in aiAnalysis.habits.improvements" 
                                :key="'improvement-'+index">
                                {{ item }}
                            </li>
                            </ul>
                        </div>
                        </div>
                    </div>
                </div>
                
                <div class="progress" v-show="aiAnalysisStage===-1" id="analysis">
                            <simpleLoadingBox
                            :index="0"
                            />
                </div>
                <div class="null" v-show="aiAnalysisStage===0">
                    <div class="empty__image">

                    </div>
                    <span class="description">暂未内容生成</span>
                </div>
            </div>
        </div>
        <div class="learn-summary">
            <div class="ai-header">
                <h3 class="title">学情总结</h3>
                <el-icon @click="clickForSummary" v-show="tracker.isSummary!==1"><Histogram /></el-icon>
                <el-icon v-show="tracker.isSummary===1" class="loadingIcon" ><Loading /></el-icon>

            </div>
            <div class="summary-container" v-show="aiSummaryStage===1">
                <!-- 情况分析 -->
                <div class="summary-item analysis">
                    <div class="item-header">
                    <h4>学情分析</h4>
                    <el-icon @click="clickForSummary"><DataAnalysis /></el-icon>
                    </div>
                    <div class="item-content">
                    <p v-for="(item, index) in aiSummary.analysis.content" 
                        :key="index">
                        {{ index + 1 }}. {{ item.text }}
                    </p>
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
                        <li v-for="resource in aiSummary.resources.list" :key="resource.name">
                        <span class="resource-type">{{ resource.type }}</span>
                        <span class="resource-name">{{ resource.name }}</span>
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
                        <li v-for="exercise in aiSummary.exercises.list" :key="exercise.title">
                        <span :class="['exercise-difficulty', exercise.difficulty]">
                            {{ exercise.difficultyText }}
                        </span>
                        <span class="exercise-title">{{ exercise.title }}</span>
                        <el-button type="primary" link>练习</el-button>
                        </li>
                    </ul>
                    </div>
                </div>
            </div>
            <div class="progress" v-show="aiSummaryStage===-1" id="summary">
                <simpleLoadingBox
                :index="1"
                />
            </div>
            <div class="null" v-show="aiSummaryStage===0">
                <div class="empty__image">

                </div>
                <span class="description">暂未内容生成</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

//加载图标
@keyframes rotate{
    from{
        transform: rotate(0deg);
    }
    to{
        transform :rotate(360deg);
    }
}
.loadingIcon{
    animation: rotate 2s linear infinite; /* 2秒完成一次旋转，无限循环 */
}
//空值显示
.null{
    margin-top: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    .empty__image{
        width: 200px;
        height:200px;
        background: url('@/assets/null.png') no-repeat center center;
        background-size: 300px;

    }
    .description{
        color: #909399;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

.ai-header{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .el-icon{
        margin: 0 20px;
        font-size: 20px;
        color: #5e5bff;
        :hover{
            cursor: pointer;
        }
    }

}

// 标题样式优化
.title {
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    color: #333;
    background: url('@/assets/xueqing1.png') no-repeat 0 center;
    background-size: 30px 30px;
    padding-left: 36px;
    height: 42px;
    line-height: 42px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.ai-item {
    overflow-y: scroll;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .ai-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e4e7ed;

    .ai-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 500;
      color: #303133;

      .el-icon {
        font-size: 20px;
        color: #409EFF;
      }
    }
  }

  .ai-content {
    .summary {
      color: #606266;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 16px;
      padding: 12px;
      background: #f5f7fa;
      border-radius: 4px;
    }

    .analysis-section {
      margin-bottom: 16px;

      h5 {
        font-size: 14px;
        color: #303133;
        margin: 0 0 8px 0;
        display: flex;
        align-items: center;
        gap: 4px;

        &::before {
          content: '';
          width: 4px;
          height: 14px;
          background: #409EFF;
          border-radius: 2px;
        }
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          position: relative;
          padding-left: 16px;
          margin-bottom: 8px;
          font-size: 13px;
          color: #606266;
          line-height: 1.6;

          &::before {
            content: '•';
            position: absolute;
            left: 0;
            color: #409EFF;
          }

          &.weak-point {
            color: #f56c6c;
            
            &::before {
              color: #f56c6c;
            }
          }
        }
      }
    }
  }
}




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
        border-radius: 10px;
        // background-color: pink;
        height: 320px;
        background-color: #fff;
        transition: all 0.3s ease;
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
    overflow-y: auto;
    height: calc(100vh - 92px); // 减去头部高度
    // background: url('@/assets/mainBg.png') no-repeat center center;
    background-size: cover;
    flex-direction: column;
    width: 100%;
    // min-width: 1040px;
    min-width: 830px;
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
    flex-direction: column;
    gap: 20px;
    
    .learn-status-main {
        width: 100%;
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
                display: flex;
                flex-direction: row;
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
        width: 100%;
        background: #fff;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);


        .ai-list {
            gap: 20px;
            
            .ai-item {
                background: #f8f9fa;
                transition: all 0.3s ease;
                height: 100%;
                
                &:hover {
                    // transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
            }
        }
    }
}


</style>