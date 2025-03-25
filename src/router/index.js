import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/layout/index.vue'
import MyClass from '@/views/class/myclass.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', redirect:'/login',name:'/'},
    {
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue')
    },
    {
      path: '/layout',
      component: Layout,
      children:[
        { path: '/layout/myclass', component: MyClass },
        {path:'/layout/outline/generate',component:()=>import('@/views/ai/AiOutLine/AiOutline.vue')},
        {path:'/layout/outline',component:()=>import('@/views/ai/AiOutLine/index.vue')},
        { path: '/layout/teachplan', component: () => import('@/views/ai/AiTeachPlan/index.vue') },
        { path: '/layout/teachplan/generate', component: () => import('@/views/ai/AiTeachPlan/AiTeachPlan.vue') },
        { path: '/layout/resource', component: () => import('@/views/ai/AiResource.vue') },
        { path: '/layout/question', component: () => import('@/views/ai/Question/AiQuestion.vue') },
        { path: '/layout/learntrack', component: () => import('@/views/ai/AiLearnTracker.vue') },
        { path: '/layout/onetap', component: () => import('@/views/ai/AiOneTap.vue') },
        { path: '/layout/classdetail', component: () => import('@/views/class/ClassDetail.vue') },
      ]
    },
    { path: '/classbegin', component: () => import('@/views/class/ClassBegin.vue') },
    { path: '/edit', component: () => import('@/views/ai/AiTeachPlan/editPage.vue') },
    // 习题集
    { path: '/questionlist/:listId?', component: () => import('@/views/ai/Question/QuestionList.vue') },
    { path: '/view-question', component: () => import('@/views/ai/Question/ViewQuestion.vue') },
    { path: '/edit-question', component: () => import('@/views/ai/Question/EditQuestion.vue') },
    
  ],
})

export default router
