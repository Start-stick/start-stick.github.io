<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 是否为注册模式
const isRegister = ref(false)

// 表单数据
const loginForm = ref({
  username: '',
  password: '',
  confirmPassword: '', // 注册时的确认密码
  email: '' // 注册时的邮箱
})

// 记住密码
const rememberPassword = ref(false)

// 表单校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value !== loginForm.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

// 处理登录
const handleLogin = () => {
  // TODO: 实现登录逻辑
  router.push('/layout/myclass')
}

// 处理注册
const handleRegister = () => {
  // TODO: 实现注册逻辑
}

// 切换登录/注册模式
const toggleMode = () => {
  isRegister.value = !isRegister.value
  loginForm.value = {
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 左侧插图 -->
      <div class="login-left">
        <img src="@/assets/login-bg.png" alt="login" />
      </div>

      <!-- 右侧表单 -->
      <div class="login-right">
        <div class="login-header">
          <h2>{{ isRegister ? '注册账号' : '用户登录' }}</h2>
        </div>

        <el-form 
          ref="loginFormRef"
          :model="loginForm"
          :rules="rules"
          class="login-form"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名(3-20个字符)"
            />
          </el-form-item>

          <!-- 注册时显示邮箱输入框 -->
          <el-form-item v-if="isRegister" prop="email">
            <el-input
              v-model="loginForm.email"
              placeholder="请输入邮箱"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码(6-20个字符)"
              show-password
            />
          </el-form-item>

          <!-- 注册时显示确认密码 -->
          <el-form-item v-if="isRegister" prop="confirmPassword">
            <el-input
              v-model="loginForm.confirmPassword"
              type="password"
              placeholder="请确认密码"
              show-password
            />
          </el-form-item>

          <div class="form-options" v-if="!isRegister">
            <el-checkbox v-model="rememberPassword">
              记住密码
            </el-checkbox>
            <el-link type="primary">忘记密码？</el-link>
          </div>

          <el-button 
            type="primary" 
            class="login-btn"
            @click="isRegister ? handleRegister() : handleLogin()"
          >
            {{ isRegister ? '注册' : '登录' }}
          </el-button>

          <div class="register-link">
            {{ isRegister ? '已有账号？' : '还没有账号？' }}
            <el-link type="primary" @click="toggleMode">
              {{ isRegister ? '立即登录' : '立即注册' }}
            </el-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6b73ff 10%, #000dff 100%);
}

.login-box {
  width: 900px;
  height: 500px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
  transition: height 0.3s ease;
}

.login-left {
  flex: 1;
  // background-color: #f5f7fa;
  border: 2px solid #f5f5fa;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;

  img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
}

.login-right {
  width: 400px;
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;

  h2 {
    margin: 0;
    font-size: 24px;
    color: #333;
  }
}

.login-form {
  .el-form-item {
    margin-bottom: 20px;
  }

  :deep(.el-input__wrapper) {
    padding: 0 16px;
    height: 40px;
    box-shadow: 0 0 0 1px #dcdfe6;

    &.is-focus {
      box-shadow: 0 0 0 1px #409eff;
    }

    input {
      height: 100%;
      font-size: 14px;
    }
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  :deep(.el-checkbox__label) {
    color: #606266;
  }
}

.login-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
  background: linear-gradient(135deg, #6b73ff 10%, #000dff 100%);
  border: none;
  margin-bottom: 24px;

  &:hover {
    opacity: 0.9;
  }
}

.register-link {
  text-align: center;
  color: #606266;
  font-size: 14px;
}
</style>