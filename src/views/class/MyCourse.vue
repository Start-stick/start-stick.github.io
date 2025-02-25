<script setup>
import { ref } from 'vue'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  Expand,
  Fold,
} from '@element-plus/icons-vue'

//定义变量 控制左侧菜单是否折叠
const isCollapse = ref(false)
// 添加鼠标悬停状态
const isHovering = ref(false)
// 当前选中菜单项
const activeMenu = ref('2')

// 菜单数据
// 标题映射表
// const menuTitles = {
//   '1': '导航一相关标题',
//   '2': '导航二相关标题',
//   '4': '系统设置'
// }
// const handleMenuSelect = (index) => {
//   activeMenu.value = index
//   // 如果需要根据子菜单更新，可以在这里处理
// }


const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}

</script>

<template>
    <div class="course-layout">
        <el-container>
            
          <el-aside 
              :width="isCollapse?'64px':'180px'"
              class="aside-transition"
          >
              <div 
                  class="toggle-button" 
              >
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
                  </div>
              </div>
              <dl class="classDl">
                <dt>
                  <a href="javascript:void(0);" onclick="$('#tpsubmit').submit();">
                      <img width="100%" height="100%" src="@/assets/course_img.png">
                      <span style="cursor: pointer;">课程门户<i class="left_join"></i></span>
                  </a>
                 
                </dt>
                <dd class="textHidden colorDeep" title="软件需求分析">
                  软件需求分析
                </dd>
              </dl>
              <dl class="classDl">
                <dt>
                  <a href="javascript:void(0);" onclick="$('#tpsubmit').submit();">
                      <img width="100%" height="100%" src="@/assets/course_img.png">
                      <span style="cursor: pointer;">课程门户<i class="left_join"></i></span>
                  </a>
                 
                </dt>
                <dd class="textHidden colorDeep" title="软件需求分析">
                  软件需求分析
                </dd>
              </dl>
              <el-menu
                  default-active="activeMenu"
                  class="course-menu-vertical"
                  :collapse="isCollapse"
                  @select="handleOpen"
                  @close="handleClose"
                  show-timeout="30"
                  hide-timeout="300000"
              >
                
                <el-sub-menu index="1">
                <template #title>
                    <el-icon><location /></el-icon>
                    <span>Navigator One</span>
                </template>
                <el-menu-item-group>
                    <template #title><span>Group One</span></template>
                    <el-menu-item index="1-1">item one</el-menu-item>
                    <el-menu-item index="1-2">item two</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="Group Two">
                    <el-menu-item index="1-3">item three</el-menu-item>
                </el-menu-item-group>
                <el-sub-menu index="1-4">
                    <template #title><span>item four</span></template>
                    <el-menu-item index="1-4-1">item one</el-menu-item>
                </el-sub-menu>
                </el-sub-menu>
                <el-menu-item index="2">
                <el-icon><icon-menu /></el-icon>
                <template #title>Navigator Two</template>
                </el-menu-item>
                <el-menu-item index="3" disabled>
                <el-icon><document /></el-icon>
                <template #title>Navigator Three</template>
                </el-menu-item>
                <el-menu-item index="4">
                <el-icon><setting /></el-icon>
                <template #title>Navigator Four</template>
                </el-menu-item>
              </el-menu>
          </el-aside>
          <el-main>

            <div class="course-container-layout">
              <el-container>
                <el-header>
                  <div class="title-user">
                    <div class="title">xxxxxxx</div>

                    <div class="user">
                      <el-dropdown>
                        <el-avatar :size="32" :src="userAvatar" />
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item>个人中心</el-dropdown-item>
                            <el-dropdown-item>退出登录</el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                      <p>moumou</p>
                    </div>
                  </div>
                </el-header>
                <el-main>
                  <div class="course-container">
                    Main
                    <router-view></router-view>
                  </div>
                </el-main>
              </el-container>
            </div>

          </el-main>
        </el-container>
    </div>
</template>

<style  scoped>
/* 课程门户 */
.classDl{
  margin: 0 auto;
  width: 138px;
  margin-top: 30px;
  /* background-color: #409EFF; */
  dt{
    width: 100%;
    height: 78px;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    span{
      display: inline-block;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 24px;
      line-height: 24px;
      text-align: center;
      color: #fff;
      font-size: 12px;
      background:rgba(0,0,0,0.3);
    }

  }
  dd{
    padding: 0;
    margin: 0;
    font-size: 16px;
    text-align: center;
    width: 100%;
    line-height: 21px;
    margin-top: 12px;
  }
}



/* 整体框架容器样式 */
.el-main ,.el-header,el-container{
  padding: 0;
}
/*title-user样式*/

.title-user{
  display: flex;

  height: 52px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  width: 100%;
  .title{
    display: flex;
    /* justify-content: center; */
    margin-left: 30px;
    align-items: center;
    flex:1
  }
  .user{
    display: flex;
    justify-content: left;
    align-items: center;
    margin-left: auto;
    width: 130px;
    height: 100%;
    
    background-color: pink;
  }

}
/* el-aside样式设置 */
.course-menu-vertical{
  min-height: 100vh;
}

/* 菜单容器过渡动画 */
.aside-transition {
  /* transition: width 0.2s linear; */
  transition: 
    width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    padding 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.05s; /* 添加延迟实现分段动画 */
}

/* 修改菜单项文字过渡 */
.el-sub-menu__title span {
  display: inline-block;
  /* transition: 
    opacity 0.2s ease,
    width 0.2s ease,
    margin 0.2s ease; */
  transition: 
  opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1),
  width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
  margin 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: width, margin, opacity; /* 提升动画性能 */
}
.el-sub-menu__title .el-icon {
  transition: 
    margin-right 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-right: 16px;
}

.el-menu--collapse .el-sub-menu__title .el-icon {
  margin-right: 0;
  transform: translateX(2px); /* 微调图标位置 */
}

/* 菜单项文字隐藏动画 */
.el-menu--collapse .el-sub-menu__title span {
  opacity: 0;
  width: 0 !important;
  margin-left: -10px;
}

/* 添加父容器overflow限制 */
.el-menu--collapse {
  position: relative;
  overflow: hidden;
}

/* 折叠按钮样式 */
.toggle-button{
    position: relative;
  height: 60px;
  display: flex;
  align-items: center;
  /* justify-content: center; */
  padding-left: 14px;
  cursor: pointer;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e6e6e6;
  /* transition: background-color 0.2s; */
  transition: 
    background-color 0.2s ease;
}

.toggle-button .logo {
  float: left;
  margin-left: 15px;
  background:url(@/assets/qifeng.png) no-repeat center;
  /* background-color: pink; */
  background-size: cover;
  width: 65px;
  height: 22.4px;
}

/* 折叠按钮悬停效果 */
.toggle-icon {
  font-size: 20px;
  color: #666;

  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
}

/* 折叠状态下的位置调整 */
.el-menu--collapse + .toggle-button {
  /* padding-left: 0; */
  justify-content: center; /* 折叠时保持居中 */
}
/* 保持菜单项图标的对齐基准 */
.el-menu-item [class^=el-icon] {
  /* margin-right: 16px; */
  width: 24px;
  text-align: center;
}

/* 精确对齐微调 */
:deep(.el-sub-menu__title) {
  padding-left: 20px !important; /* 保持与折叠按钮一致 */
}


.hover-effect {
  background-color: #f0f0f0;
  transform: scale(1.1);
}

/* 折叠状态下菜单项居中 */
/* .el-menu--collapse {
  padding: 0 5px;
} */


/* 菜单项tooltip样式 */
:deep(.el-tooltip__trigger) {
  outline: none;
}

/* 菜单项hover效果 */
.el-menu-item:hover {
  background-color: #f5f7fa !important;
}
.el-menu-item:active{
  border-left: 2px solid #409EFF;
}
</style>