<script setup>
import { onMounted, ref } from 'vue'
import { Search, CircleCheckFilled,LocationFilled} from '@element-plus/icons-vue'
import { progressProps } from 'element-plus'
import loading_box from '@/components/loading/loading_box.vue'
// import LoadingBox from '@/components/loading/loading_box.vue'
// 搜索标签页
const searchTabs = [
  { name: '综合', type: 'all' },
  { name: '课程', type: 'course' },
  { name: '资源', type: 'resource' },
  { name: '题目', type: 'question' },
  { name: '论文', type: 'paper' },
  { name: '期刊', type: 'journal' },
  { name: '图书', type: 'book' },
  { name: '互联网资源', type: 'internet' }
]
const stage=ref(2)
onMounted(()=>{

  document.querySelector('#stage_01').style.setProperty('--progress','100%')
})
    // document.querySelector('#stage_02').style.setProperty('--progress',props.progress2)
// 当前激活的标签
const activeTab = ref('all')

// 搜索关键词
const searchKeyword = ref('')

// 搜索结果
const searchResults = ref([])

// 处理标签切换
const handleTabChange = (type) => {
  activeTab.value = type
}

// 处理搜索
const handleSearch = () => {
  if (!searchKeyword.value) {
    searchResults.value = []
    return
  }
  
  // 模拟不同标签页的搜索结果
  switch (activeTab.value) {
    case 'all':
      searchResults.value = [
        { title: '高等数学教程', type: '课程', views: 1200 },
        { title: '高等数学习题集', type: '资源', views: 890 },
        { title: '微积分基础知识', type: '题目', views: 750 }
      ]
      break
    case 'course':
      searchResults.value = [
        { title: '高等数学教程', type: '课程', views: 1200 },
        { title: '线性代数基础', type: '课程', views: 980 }
      ]
      break
    // 可以添加其他类型的搜索结果...
  }
}
</script>

<template>
  <div class="resource-container">
    <!-- 头部标签页 -->
     <div class="tabAndSearch">

      <div class="resource-header">
        <ul class="search-tab">
          <li 
          v-for="tab in searchTabs" 
          :key="tab.type"
          class="search-tab-item"
          :class="{ active: activeTab === tab.type }"
          @click="handleTabChange(tab.type)"
        >
          {{ tab.name }}
        </li>
      </ul>
      </div>

      <!-- 搜索框区域 -->
      <div class="search-container">
        <div class="search-box">
          <div class="search-input">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索..."
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </div>
        </div>
      </div>
      <loading_box
      :stage="stage"
      />
    </div>

    <!-- 搜索结果区域 -->
    <div class="search-results" v-if="searchResults.length > 0">
      <div class="result-left">
        <div class="results-section" id="sectionDocs">
          <h3>文档</h3>
          <div class="results-card-box">
            <div class="results-card-item"></div>
            <div class="results-card-item"></div>
            <div class="results-card-item"></div>
          </div>
        </div>
        <div class="results-section" id="sectionDocs">
          <h3>文档</h3>
          <div class="results-card-box">
            
          </div>
        </div>
        <div class="results-section" id="sectionVideo">
          <h3>视频</h3>
          <div class="results-card-box">
            
          </div>
        </div>
        <div class="results-section" id="sectionBook">
          <h3>图书</h3>
          <div class="results-card-box">
            
          </div>
        </div>
        <div class="results-section" id="sectionCourse">
          <h3>课程</h3>
          <div class="results-card-box">
            
          </div>
        </div>
      </div>
      <div class="result-right">
        
        <div class="results-section" id="sectionRecommend">
          <h3>推荐资源</h3>
          <div class="results-card-box">
            
          </div>
        </div>
      </div>
      
      <!-- <div 
        v-for="(result, index) in searchResults" 
        :key="index"
        class="result-item"
      >
        <div class="result-content">
          <h3>{{ result.title }}</h3>
          <div class="result-meta">
            <span class="type">{{ result.type }}</span>
            <span class="views">{{ result.views }} 浏览</span>
          </div>
        </div>
      </div> -->
    </div>

    <!-- 空状态 -->
    <div v-else-if="searchKeyword" class="empty-state">
      <el-empty description="暂无相关结果" />
    </div>
  </div>
</template>

<style lang="scss" scoped>

//搜索结果模块样式
.search-results{
  display: flex;
  flex-direction: row;
  margin-top: 30px;
  height: 1000px;
  gap: 24px;
  
  h3{
    font-weight: 500;
    font-size: 18px;
    color: #333;
    background: url('@/assets/xueqing1.png') no-repeat 0 center;
    background-size: 30px 30px;
    padding-left: 36px;
    height: 42px;
    line-height: 42px;
  }
  .results-section{
    background-color: #fff;
    .results-card-box{
      display: grid;
      column-gap: 24px;
      grid-template-columns: repeat(2, 1fr);

      .results-card-item{
        margin-top: 16px;
        background-color: #6CC7FF;
        height: 104px;
      }
    }
  }
  .result-left{
    // background-color: #6CC7FF;
    flex: 3;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .result-right{
    background-color: pink;
    flex:2;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
}


//

*{
  box-sizing: border-box;

}
.resource-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 960px;
  max-width: 1200px;
  margin: 0 auto;

}

.resource-header {
}

.search-tab {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  // gap: 32px;
  justify-content: center;

  .search-tab-item {
    padding: 0 24px;
    font-size: 17px;
    height: 44px;
    line-height: 44px;
    color: #606266;
    cursor: pointer;
    position: relative;

    &:hover {
      color: #4e6ef2;
    }

    &.active {
      color: #4e6ef2;
      font-weight: 500;
      background: url('@/assets/li_active.png') no-repeat center 40px;
      background-size: 60px 4px;

    }
  }
}

.search-container {
  border: 1px solid #4e6ef2;
  margin-top: 24px;
  padding: 2px;
  border-radius: 8px;
  width: 900px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image:linear-gradient(322.22deg,#5A33FF -34.58%,#6CC7FF 132%);
  box-sizing: border-box;
}

.search-box {
  // padding-left: 19px;
  padding-right: 6px;
  border-radius:6px ;
  width: 100%;
  height: 100%;
  background-color: #fff;
}

.search-input {
  display: flex;
  gap: 12px;
  width: 100%;
  height: 100%;
  align-items: center;
  outline: none;
  .el-input {
    height: 100%;
    :deep(.el-input__wrapper) {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      padding-left: 16px;
      
    }
  }
  .el-button{
    width: 81px;
    height: 38px;
    background-image:linear-gradient(322.22deg,#5A33FF -34.58%,#6CC7FF 132%);
    border-radius: 6px;
    
  }
}

.search-results {
  width: 100%;
  .result-item {
    padding: 16px;
    border-bottom: 1px solid #e4e7ed;
    transition: all 0.3s;
    cursor: pointer;

    &:hover {
      background-color: #f5f7fa;
    }

    h3 {
      margin: 0 0 8px;
      font-size: 16px;
      color: #1a1a1a;
    }

    .result-meta {
      display: flex;
      gap: 16px;
      font-size: 13px;
      color: #909399;

      .type {
        color: #4e6ef2;
      }
    }
  }
}

.empty-state {
  padding: 48px 0;
  text-align: center;
}
</style> 