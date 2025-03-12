<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FullScreen } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const classId = ref(route.query.classId)
const classInfo = ref({
  className: 'test',
  teacherName: '芳雪 刘'
})

// 加载课程信息
const loadClassInfo = () => {
  // TODO: 调用API获取课程信息
}

// 全屏切换
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

onMounted(() => {
  if (classId.value) {
    loadClassInfo()
  } else {
    router.push('/layout/myclass')
  }
})
</script>

<template>
  <div class="class-begin">
    <div class="classroom">
      <div class="screen">
        <div class="screen-content">
          <h1>{{ classInfo.className }}</h1>
          <p class="subtitle">已开启手机控制，课堂活动、课程内容及资料可显示大屏</p>
          <p class="enter-text">扫码进班</p>
        </div>
      </div>
      <div class="classroom-seats"></div>
    </div>
    
    <!-- 右侧工具栏 -->
    <div class="side-toolbar">
      <div class="tool-item">资源</div>
      <div class="tool-item">活动</div>
      <div class="tool-item">更多</div>
    </div>

    <!-- 底部控制栏 -->
    <div class="bottom-bar">
      <div class="left">
        <span>返回</span>
      </div>
      <div class="right">
        <span class="fullscreen" @click="toggleFullScreen">全屏</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.class-begin {
  height: 100vh;
  width: 100vw;
  position: relative;
  background-color: #f5e6d3;
  overflow: hidden;
}

.classroom {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 40px;
  box-sizing: border-box;
}

.screen {
  background-color: #2d4356;
  border-radius: 8px;
  height: 45%;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);

  .screen-content {
    text-align: center;
    color: white;

    h1 {
      font-size: 48px;
      margin: 0 0 24px;
      font-family: monospace;
    }

    .subtitle {
      font-size: 16px;
      margin: 0 0 16px;
      opacity: 0.8;
    }

    .enter-text {
      font-size: 14px;
      opacity: 0.6;
    }
  }
}

.classroom-seats {
  flex: 1;
  background: linear-gradient(
    to bottom,
    #deb887 0%,
    #cd853f 100%
  );
  border-radius: 8px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.side-toolbar {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  padding: 16px;
  border-radius: 8px 0 0 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .tool-item {
    color: white;
    font-size: 14px;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 48px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  color: white;

  .left, .right {
    span {
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
      transition: all 0.3s;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
}
</style> 