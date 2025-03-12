
//学业表现分析
//作业与测试成绩-折线图
//知识点掌握图谱-知识点热力图

//学习习惯与时间管理
//任务完成效率-折线图

//学习时段分布-环形图

//在线学习行为追踪

// C语言课程学习数据
export const learningData = {
  // 学习行为数据
  studyBehavior: {
    // 学习时长与互动数据
    timeAndInteraction: {
      title: {
        text: '学习时长与互动趋势',
        subtext: '最近12周数据'
      },
      legend: ['学习时长', '互动参与度'],
      xAxis: [{
        type: 'category',
        data: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', 
               '第7周', '第8周', '第9周', '第10周', '第11周', '第12周']
      }],
      series: [
        {
          name: '学习时长',
          type: 'bar',
          unit: 'h',
          color: '#627aff',
          data: [18, 22, 15, 20, 25, 16, 21, 23, 19, 17, 20, 24],
          markLine: {
            data: [{ type: 'average', name: '平均值' }]
          }
        },
        {
          name: '互动参与度',
          type: 'line',
          unit: '%',
          color: '#36c6d3',
          data: [85, 90, 82, 88, 92, 86, 89, 91, 87, 85, 88, 90],
          markPoint: {
            symbolSize: 8,
            data: [
              { type: 'max', name: '最大值' },
              { type: 'min', name: '最小值' }
            ]
          }
        }
      ]
    },

    // 专注度分析
    focusAnalysis: {
      title: {
        text: '学习专注度分布',
        subtext: '当前学期数据'
      },
      series: [
        {
          name: '专注度分布',
          type: 'pie',
          radius: ['50%', '70%'],
          data: [
            { value: 60, name: '高度专注(>90%)', itemStyle: { color: '#67C23A' } },
            { value: 25, name: '中度专注(70-90%)', itemStyle: { color: '#E6A23C' } },
            { value: 15, name: '注意力分散(<70%)', itemStyle: { color: '#F56C6C' } }
          ]
        }
      ]
    }
  },

  // 学业表现数据
  performance: {
    // 成绩分析
    scoreAnalysis: {
      title: {
        text: '作业与测验成绩趋势',
        subtext: '最近7次评估'
      },
      legend: ['作业成绩', '测验成绩'],
      xAxis: [{
        type: 'category',
        data: ['指针基础', '内存管理', '结构体', '文件操作', '函数', '数组', '字符串']
      }],
      series: [
        {
          name: '作业成绩',
          type: 'line',
          color: '#627aff',
          data: [85, 92, 88, 95, 90, 87, 93],
          markLine: {
            data: [{ type: 'average', name: '平均值' }]
          }
        },
        {
          name: '测验成绩',
          type: 'line',
          color: '#ff9f43',
          data: [80, 85, 82, 88, 86, 84, 89],
          markPoint: {
            data: [
              { type: 'max', name: '最高分' },
              { type: 'min', name: '最低分' }
            ]
          }
        }
      ]
    },

    // 知识点掌握雷达图
    knowledgeRadar: {
      title: {
        text: '知识点掌握情况',
        subtext: '核心知识点评估'
      },
      radar: {
        indicator: [
          { name: '变量与数据类型', max: 100 },
          { name: '控制结构', max: 100 },
          { name: '函数', max: 100 },
          { name: '数组', max: 100 },
          { name: '指针', max: 100 },
          { name: '结构体', max: 100 },
          { name: '文件操作', max: 100 }
        ]
      },
      series: [{
        type: 'radar',
        data: [{
          value: [92, 88, 85, 82, 75, 80, 78],
          name: '掌握程度',
          itemStyle: { color: '#627aff' },
          areaStyle: {
            color: 'rgba(98, 122, 255, 0.3)'
          }
        }]
      }]
    }
  },

  // 学习习惯数据
  studyHabits: {
    // 时间分布
    timeDistribution: {
      title: {
        text: '学习时段分布',
        subtext: '当前学期统计'
      },
      series: [{
        name: '学习时长',
        type: 'pie',
        radius: '60%',
        data: [
          { value: 40, name: '上午(8:00-12:00)', itemStyle: { color: '#91d5ff' } },
          { value: 35, name: '下午(14:00-18:00)', itemStyle: { color: '#adc6ff' } },
          { value: 25, name: '晚上(19:00-22:00)', itemStyle: { color: '#d6e4ff' } }
        ]
      }]
    },

    // 任务完成情况
    taskCompletion: {
      title: {
        text: '任务完成效率',
        subtext: '作业与实验完成情况'
      },
      series: [{
        name: '完成情况',
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 85, name: '按时完成', itemStyle: { color: '#67C23A' } },
          { value: 12, name: '延迟完成', itemStyle: { color: '#E6A23C' } },
          { value: 3, name: '未完成', itemStyle: { color: '#F56C6C' } }
        ]
      }]
    }
  }
}

// 学情总结数据
export const aiSummary = {
    // 情况分析
    analysis: {
      content: [
        {
          type: 'progress',
          text: '学习进度：目前已完成80%的课程内容，整体进度良好。'
        },
        {
          type: 'knowledge',
          text: '知识掌握：在函数和数组操作方面表现优秀，但指针和内存管理需要加强。'
        },
        {
          type: 'habit',
          text: '学习习惯：每周学习时长稳定，但晚间学习效率有待提高。'
        }
      ]
    },
  
    // 资源推荐
    resources: {
      list: [
        {
          type: '视频',
          name: '指针与内存管理精讲',
          link: '#'
        },
        {
          type: '文档',
          name: 'C语言内存管理最佳实践',
          link: '#'
        },
        {
          type: '实验',
          name: '指针操作实战演练',
          link: '#'
        }
      ]
    },
  
    // 题目推荐
    exercises: {
      list: [
        {
          difficulty: 'easy',
          difficultyText: '简单',
          title: '指针数组基础操作',
          link: '#'
        },
        {
          difficulty: 'medium',
          difficultyText: '中等',
          title: '动态内存分配应用',
          link: '#'
        },
        {
          difficulty: 'hard',
          difficultyText: '困难',
          title: '复杂数据结构内存管理',
          link: '#'
        }
      ]
    }
  }
  
  // 获取总结数据的方法
  export const getSummaryData = (type) => {
    return aiSummary[type] || {}
  }