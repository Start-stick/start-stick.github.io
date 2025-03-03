<script setup>
import { ref, watch } from 'vue'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  Expand,
  Fold,
  Reading,
  Calendar,
  Collection
} from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
// import { useRouter } from 'vue-router'
//定义变量 控制左侧菜单是否折叠
const isCollapse = ref(false)
// 添加鼠标悬停状态
const isHovering = ref(false)
// 当前选中菜单项
const route=useRoute()
const activeMenu = ref(route.path)
// const activeMenu = ref('/mycourse/outline')
// const router=useRouter()
// router.push('/mycourse/outline')


// 添加课程信息数据
const courseInfo = {
  name: '软件需求分析',
  image: new URL('@/assets/course_img.png', import.meta.url).href,
  icon: new URL('@/assets/course_icon.png', import.meta.url).href
}

// 添加用户信息
const userInfo = {
  name: '芳雪 刘',
  avatar: new URL('@/assets/avatar.png', import.meta.url).href
}

// 修改菜单数据，添加自定义图标
const menuItems = [
  {
    index: '1',
    iconUrl: new URL('@/assets/images/ai_icon.png', import.meta.url).href,
    title: 'Ai助教',
    children: [
      { index: '/mycourse/outline', title: '大纲助手' },
      { index: '/mycourse/tachplan', title: '教案助手' },
      { index: '/mycourse/resource', title: '资源助手' },
      { index: '/mycourse/question', title: '习题通' },
      { index: '/mycourse/learntrack', title: '学情看板' },
      { index: '/mycourse/onetap', title: '一键通' },
    ]
  },
  {
    index: '2',
    icon: Reading,
    title: '教学大纲',
    children: [
      { index: '2-1', title: '教学目标' },
      { index: '2-2', title: '考核方式' }
    ]
  },
  {
    index: '3',
    icon: Calendar,
    title: '历史记录'
  },
  {
    index: '4',
    icon: Collection,
    title: '教学资源',
    children: [
      { index: '4-1', title: '课件资料' },
      { index: '4-2', title: '实验资料' }
    ]
  }
]
const firstTitle=()=>{
  for(let item of menuItems){
    if(item.index===route.path) return item.title
    if(item.children){
      for(let child of item.children){
        if(child.index===route.path) return child.title
      }
    }
  }

}
// 当前选中的菜单标题
const currentTitle = ref('')

const handleSelect = (index) => {
  // 更新当前标题
  const findTitle = (items) => {
    for (const item of items) {
      if (item.index === index) return item.title
      if (item.children) {
        const title = findTitle(item.children)
        if (title) return title
      }
    }
    return null
  }
  const title = findTitle(menuItems)
  if (title) currentTitle.value = title
}

// 处理用户操作
const handleCommand = (command) => {
  if (command === 'profile') {
    // 跳转到个人中心
    // router.push('/profile')
  } else if (command === 'logout') {
    // 处理退出登录
  }
}

</script>

<template>
    <div class="course-layout">
        <el-container class="layout-container">
            
        <el-aside 
          :width="isCollapse?'65px':'200px'"
          class="aside-transition"
        >
          <div class="toggle-header" >
            <el-tooltip
              effect="dark"
              :content="isCollapse ? '展开菜单' : '折叠菜单'"
              placement="right"
            >
            <el-icon 
            class="toggle-icon"
            :class="{ 'hover-effect': isHovering }"
            @mouseenter="isHovering = true"
            @mouseleave="isHovering = false"
            @click="isCollapse = !isCollapse"
            >
            <component :is="isCollapse ? Expand : Fold" />
            </el-icon>
            </el-tooltip>
            <div class="logo" v-show="!isCollapse">
              <img src="@/assets/qifeng.png" alt="logo">
            </div>
          </div>
          <div class="line"></div>

          <!-- <div class="course-card" :class="{ 'collapsed': isCollapse }">
            <template v-if="!isCollapse">
              <el-image 
                :src="courseInfo.image"
                fit="cover"
                class="course-image"
              />
              <div class="course-info">
                <h3>{{ courseInfo.name }}</h3>
                <p>1 class</p>
              </div>
            </template>
            <template v-else>
              <el-avatar 
                :size="40"
                shape="square"
                :src="courseInfo.image"
                class="course-icon"
              />
            </template>
          </div> -->
            <el-menu
                :default-active="activeMenu"
                class="course-menu"
                :collapse="isCollapse"
                @select="handleSelect"
                unique-opened
                router
            >
              <template v-for="item in menuItems" :key="item.index">
                <!-- 有子菜单的情况 -->
                <el-sub-menu v-if="item.children" :index="item.index">
                  <template #title>
                    <div class="menu-icon-wrapper">
                      <img 
                        v-if="item.iconUrl" 
                        :src="item.iconUrl" 
                        class="custom-menu-icon"
                        :class="{'is-active': activeMenu.startsWith(item.index)}"
                      />
                      <el-icon v-else><component :is="item.icon" /></el-icon>
                    </div>
                    <span>{{ item.title }}</span>
                  </template>
                  <el-menu-item 
                    v-for="child in item.children"
                    :key="child.index"
                    :index="child.index"
                  >
                    {{ child.title }}
                  </el-menu-item>
                </el-sub-menu>
                <!-- 没有子菜单的情况 -->
                <el-menu-item v-else :index="item.index">
                  <div class="menu-icon-wrapper">
                      <img 
                        v-if="item.iconUrl" 
                        :src="item.iconUrl" 
                        class="custom-menu-icon"
                        :class="{'is-active': activeMenu.startsWith(item.index)}"
                      />
                      <el-icon v-else><component :is="item.icon" /></el-icon>
                    </div>
                  <template #title>{{ item.title }}</template>
                </el-menu-item>
              </template>
            </el-menu>
        </el-aside>
          <el-container class="main-container">
            <el-header height="52px">
              <div class="title-user">
                <div class="title">{{ currentTitle||firstTitle() }}</div>
                <div class="user">
                  <el-dropdown @command="handleCommand" trigger="click">
                    <div class="user-info">
                      <el-avatar :size="32" :src="userInfo.avatar" />
                      <div class="user-detail">
                        <span class="username">{{ userInfo.name }}</span>
                        <i class="arrow-icon"></i>
                      </div>
                    </div>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                        <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
              <div class="line"></div>
            </el-header>
            <el-main>
              <div class="course-container">
                <router-view></router-view>
              </div>
            </el-main>
          </el-container>
        </el-container>
    </div>
</template>

<style lang="scss" scoped>
/* 整体框架容器样式 */

.el-main ,.el-header,el-container{
  padding: 0;
}

/* 折叠按钮悬停效果 */
.toggle-icon {
  font-size: 20px;
  color: #666;

  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
}


/* 左侧菜单整体样式 */
.el-aside {
  background-color: #fff;
  border-right: 1px solid #e6e6e6;
  transition: width 0.3s;
  scroll:none;
}

/* 折叠按钮和Logo容器 */
.toggle-header {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  cursor: pointer;
  // border-bottom: 1px solid #e6e6e6;
}
.line{
  margin-left: 8px;
  height:1px;
  width: calc(100% - 16px);
  background-color:#e6e6e6;
}
.logo {
  margin-left: 12px;
  height: 32px;
  img {
    height: 100%;
    object-fit: contain;
  }
}

/* 课程卡片样式 */
.course-card {
  padding: 16px;
  transition: all 0.3s;

  &.collapsed {
    padding: 8px;
    display: flex;
    justify-content: center;
  }
}

.course-image {
  width: 100%;
  height: 120px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.course-info {
  h3 {
    margin: 0;
    font-size: 16px;
    color: #303133;
  }
  p {
    margin: 4px 0 0;
    font-size: 12px;
    color: #909399;
  }
}

.course-icon {
  margin: 8px 0;
}

/* 功能菜单样式 */
.course-menu {
  border-right: none;
  
  :deep(.el-menu-item) {
    height: 50px;
    line-height: 50px;
    
    &.is-active {
      background-color: #f0f6ff;
      border-left: 2px solid #6f94f4;
      color: #3B90FF;
    }
  }
  .el-menu-item.is-active {
    background-color: #f0f6ff;
      color: #648bff;
    .el-icon{
      color:#627aff;
    }
  }

}

/* 修改整体布局样式 */
.course-layout {
  height: 100vh;
  overflow: hidden;
}

.layout-container {
  height: 100%;
}

.main-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f7fa;
  /* #f4f8ff */
  /* #f4f7ff */
}

/* 修改头部用户信息样式 */
.main-container .el-header{
  height:45px;
  .line{
    margin-left: 20px;
    justify-content: center;
    height:1px;
    
    width: calc(100% - 40px);
    background-color:#e6e6e6;
  }
}
.title-user {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 20px;
  /* background-color: #fff; */
  /* border-bottom: 1px solid #e6e6e6; */

  .title {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
    flex: 1;
  }

  .user {
    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 6px 12px;
      border-radius: 4px;
      transition: all 0.3s ease;

      &:hover {
        background-color: #f5f7fa;
        
        .arrow-icon {
          transform: rotate(180deg);
        }
      }

      .el-avatar {
        flex-shrink: 0;
      }

      .user-detail {
        display: flex;
        align-items: center;
        margin-left: 8px;

        .username {
          font-size: 14px;
          color: #606266;
          margin-right: 4px;
        }

        .arrow-icon {
          width: 12px;
          height: 12px;
          background: url('@/assets/arrowDown.png') no-repeat center;
          background-size: contain;
          transition: transform 0.3s ease;
        }
      }
    }
  }
}


/* 内容区域样式 */
.el-main {
  padding: 20px;
  overflow-x: hidden;
}

/* 修改菜单样式 */
.course-menu {
  /* 减去头部和课程卡片的高度 */
  border-right: none;
}

:deep(.el-sub-menu .el-menu-item) {
  min-width: auto;
  padding-left: 50px !important;
}

.menu-icon-wrapper {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.custom-menu-icon {
  width: 25px;
  height: 25px;
  object-fit: contain;
  opacity: 0.7;
  transition: all 0.3s;
}

/* 激活状态的图标样式 */
:deep(.el-sub-menu.is-active) .custom-menu-icon {
  opacity: 1;
}

/* 菜单项激活时的图标样式 */
.custom-menu-icon.is-active {
  opacity: 1;
  filter: brightness(1.2);
}

/* 折叠状态下的图标样式调整 */
.el-menu--collapse .menu-icon-wrapper {
  margin-right: 0;
}

/* 确保图标在折叠状态下居中 */
.el-menu--collapse .custom-menu-icon {
  margin: 0 auto;
}
</style>

<style>
.user .el-dropdown-menu__item:not(.is-disabled):focus, .el-dropdown-menu__item:not(.is-disabled):hover{
  color:#627aff;
  background-color: #f0f6ff;
}
</style>