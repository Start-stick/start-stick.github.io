import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', redirect:'/mycourse'},
    {
      path: '/mycourse',
      component: () => import('@/views/class/MyCourse.vue'),
      children:[
        { path: '/mycourse/outline', component: () => import('@/views/class/AiOutline.vue') },
        { path: '/mycourse/tachplan', component: () => import('@/views/class/AiTeachPlan.vue') },
        { path: '/mycourse/resource', component: () => import('@/views/class/AiResource.vue') },
        { path: '/mycourse/question', component: () => import('@/views/class/AiQuestion.vue') },
        { path: '/mycourse/learntrack', component: () => import('@/views/class/AiLearnTracker.vue') },
        { path: '/mycourse/onetap', component: () => import('@/views/class/AiOneTap.vue') },
      ]
    }
  ],
})

export default router
