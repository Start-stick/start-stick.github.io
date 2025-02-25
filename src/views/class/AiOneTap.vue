<script setup>
import { ref } from 'vue'
import { Fold, Expand } from '@element-plus/icons-vue'

const isCollapse = ref(false)
const courseInfo = ref({
  name: 'Vue 3 高级开发实战',
  image: '/images/course-thumbnail.png'
})

// 网站LOGO配置
const logoConfig = ref({
  full: '/images/logo-full.png',    // 展开状态LOGO
  mini: '/images/logo-mini.png'    // 折叠状态LOGO
})
</script>

<template>
  <el-container class="h-screen">
    <el-aside 
      :width="isCollapse ? '64px' : '240px'"
      class="sidebar-container transition-all duration-300"
    >
      <!-- 顶部信息区域 -->
      <div class="sidebar-header">
        <!-- 展开状态 -->
        <transition name="slide-fade">
          <div v-if="!isCollapse" class="expanded-view">
            <img 
              :src="logoConfig.full" 
              class="logo-expanded"
              alt="网站Logo"
            />
            <div class="course-card">
              <el-avatar 
                :size="64" 
                :src="courseInfo.image"
                shape="square"
              />
              <h4 class="course-name">{{ courseInfo.name }}</h4>
            </div>
          </div>
        </transition>

        <!-- 折叠状态 -->
        <transition name="fade">
          <div v-if="isCollapse" class="collapsed-view">
            <img 
              :src="logoConfig.mini" 
              class="logo-collapsed"
              alt="简版Logo"
            />
            <el-tooltip
              placement="right"
              :content="courseInfo.name"
            >
              <el-avatar
                :size="36"
                :src="courseInfo.image"
                class="course-thumbnail"
              />
            </el-tooltip>
          </div>
        </transition>
      </div>

      <!-- 折叠按钮 -->
      <div class="toggle-button">
        <el-icon @click="isCollapse = !isCollapse">
          <component :is="isCollapse ? Expand : Fold" />
        </el-icon>
      </div>

      <!-- 菜单区域（保持原有代码） -->
      <el-menu
        :collapse="isCollapse"
        class="border-none"
      >
        <!-- 菜单项... -->
      </el-menu>
    </el-aside>

    <!-- 主内容区域 -->
    <el-main>
      <!-- 原有内容... -->
    </el-main>
  </el-container>
</template>

<style scoped>
.sidebar-container {
  background: #fff;
  box-shadow: 2px 0 8px rgba(0,0,0,0.05);
}

.sidebar-header {
  position: relative;
  height: 160px;
  overflow: hidden;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

/* 展开状态样式 */
.expanded-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  .logo-expanded {
    width: 120px;
    height: auto;
    object-fit: contain;
  }

  .course-card {
    text-align: center;
    
    .course-name {
      margin-top: 8px;
      font-size: 14px;
      color: #333;
      white-space: normal;
      line-height: 1.4;
    }
  }
}

/* 折叠状态样式 */
.collapsed-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  .logo-collapsed {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }

  .course-thumbnail {
    border: 2px solid #e8e8e8;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.1);
    }
  }
}

/* 过渡动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: 
    opacity 0.3s ease,
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.toggle-button {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.9);
  border-top: 1px solid #f0f0f0;
  
  .el-icon {
    padding: 8px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      background: #f5f7fa;
      transform: rotate(180deg);
    }
  }
}
</style>