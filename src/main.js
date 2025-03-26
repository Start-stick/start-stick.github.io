// import '@/assets/main.scss'
import '@/style/base.css'
import '@/style/common.css'
import '@/style/button.css'
import '@/utils/elemtntui.js'

import { createApp } from 'vue'
import { createPinia } from 'pinia'


import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
