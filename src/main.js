import '@/assets/main.scss'
import 'element-plus/theme-chalk/el-message.css'
import Editor from '@/components/Editor.vue'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Editor)

app.mount('#app')
