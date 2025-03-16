<script setup>
import { Plus, MoreFilled, Document, Delete, Edit, MagicStick,Clock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'

// 弹框
const dialogVisible = ref(false)
// 表单数据
const formData = ref({
  subject: '',
  teachingGoal: '',    // 教学目标
})
// 习题集列表数据
const questionSets = ref([
  {
    id: 1,
    title: '第一单元习题集1',
    createTime: '2024-01-01',
    questionCount: 20,
    completionRate: '80%'
  },
  {
    id: 2,
    title: '第二单元习题集',
    createTime: '2024-01-05',
    questionCount: 15,
    completionRate: '60%'
  }
])

// 处理分配班级
const handleAssignClass = (item) => {
  // TODO: 实现分配班级的逻辑
  console.log('分配班级:', item.title)
}

// 处理删除习题集
const handleDelete = (item) => {
  ElMessageBox.confirm(
    `确定要删除习题集"${item.title}"吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现删除逻辑
    questionSets.value = questionSets.value.filter(set => set.id !== item.id)
  }).catch(() => {})
}
</script>

<template>
    <div class="ai-question body">
        <div class="ai-question-header header">
            <div class="header-title">
                <el-icon class="icon"><Document /></el-icon>
                <h2>习题通</h2>
            </div>
            <el-button type="primary" @click="dialogVisible = true">
                <el-icon><MagicStick /></el-icon>
                <span>创建</span>
            </el-button>
            <!-- 弹框 -->
            <el-dialog 
            v-model="dialogVisible" 
            class="dialog-box"
            :modal="false">
            <div class="left">
                <!-- 创建习题集 -->
                <div class="create-question-set">
                    <h3>智能创建习题集</h3>
                    <p>请描述您对习题集的期望：</p>
                    <el-form 
                    :model="formData" 
                    label-position="top" 
                    class="generate-form"
                    >
                        <el-form-item label="学科">
                        <el-input v-model="formData.subject" placeholder="请输入学科" />
                        </el-form-item>

                        <el-form-item label="教学目标">
                        <el-input v-model="formData.teachingGoal" type="textarea" class="textarea-input" :rows="3" placeholder="请输入本节课的教学目标" />
                        </el-form-item>

                    </el-form>
                    
                </div>
                <div class="create-question-set-footer">
                    <el-button type="primary" @click="handleGenerate">
                        <el-icon><MagicStick /></el-icon>
                        生成
                    </el-button>
                </div>
            </div>
            <div class="right"></div>
            </el-dialog>

        </div>
        <!-- 近期习题集 -->
        <div class="ai-question-content body-body">
            <div class="body-title">
                <div class="title-wrapper">
                    <el-icon><Clock /></el-icon>
                    <h3>近期习题集</h3>
                </div>
            </div>
            
            <div class="recent-box">
                <div 
                    v-for="item in questionSets" 
                    :key="item.id" 
                    class="recent-item"
                >
                    <div class="recent-item-title">
                        <span class="title-text">{{ item.title }}</span>
                        <div class="item-actions">
                            <el-dropdown trigger="click">
                                <el-icon class="more-icon"><MoreFilled /></el-icon>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="handleAssignClass(item)">
                                            <el-icon><Document /></el-icon>
                                            分配给班级
                                        </el-dropdown-item>
                                        <el-dropdown-item @click="handleDelete(item)">
                                            <el-icon><Delete /></el-icon>
                                            删除
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="item-info">
                        <div class="info-stats">
                            
                            <span class="stat-item">
                                <i class="stat-label">题目数：</i>
                                {{ item.questionCount }}
                            </span>
                            <span class="stat-item">
                                <i class="stat-label">完成率：</i>
                                {{ item.completionRate }}
                            </span>
                        </div>
                        <div class="recent-item-footer">
                            创建时间：{{ item.createTime }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style lang="scss" scoped>

//弹框样式
:deep(.el-dialog) {
    display: flex;
    margin: 40px;
    padding: 0;
    width:  calc(100vw - 80px)  !important;
    height:  calc(var(--vh, 100vh) - 80px) !important;
    border-radius: 12px;
    .el-dialog__body{
        flex:1;
        display: grid;
        grid-template-columns:repeat(2, minmax(0px, 1fr));
        .left {
            padding: 24px;
            width: 100%;
            height: 100%;
            flex:1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            // background-color: pink;
            .create-question-set{
                display: flex;
                flex-direction: column;
                gap: 24px;

                .generate-form{
                    display: flex;
                    flex-direction: column;
                    padding: 24px ;
                    width: 100%;
                    height: 100%;
                    gap: 8px;
                    border-radius: 8px;
                    border: 1px solid #4e6ef2;
                    background-color: #f0f2ff;
                }
                .textarea-input .el-textarea__inner{
                    resize: none;
                    height: 180px;
                }
            }
            .create-question-set-footer{
                display: flex;
                justify-content: flex-end;
                .el-button{
                    width: auto;
                    padding: 20px;
                    border-radius: 8px;
                    background-color: #5e5bff;
                    color: #fff;
                    .el-icon{
                        font-size: 20px;
                        margin-right: 4px;
                    }
                }
            }
            
        }
        .right {
            flex:1;
            padding: 24px;
            width: 100%;
            height: 100%;
            background-color: palegreen;
        }
    }
    .el-dialog__header {
        display: none;
    }
    
    .el-dialog__body {
        padding: 0;
    }

}

.ai-question {
    display: flex;
    flex-direction: column;
    max-width: 1400px;
}
//header
.ai-question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h3 {
        font-size: 20px;
        color: #333;
        display: flex;
        align-items: center;
        gap: 8px;
        
        .el-icon {
            font-size: 24px;
            color: #4e6ef2;
        }
    }
    .el-button {
        padding: 8px 15px;
        font-size: 16px;
        color: #fff;
        border-radius: 6px;
        background-color: #5e5bff;
        border: none;
        transition: all 0.3s ease;
        
        &:hover {
            box-shadow: 0 4px 12px rgba(78, 110, 242, 0.2);
        }
        
        span {
            margin-right: 8px;
        }
    }
}
//content
.ai-question-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    
    .content-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .header-actions {
            width: 300px;
        }
    }
    
    h3 {
        font-size: 18px;
        color: #333;
        margin: 0;
    }
    
    .recent-box {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
        gap: 24px;
        
        .recent-item {
            min-height: 120px;
            border: 1px solid #e4e7ed;
            border-radius: 8px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background-color: #fff;
            transition: all 0.3s ease;
            
            &:hover {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                border-color: #4e6ef2;
            }
            
            .recent-item-title {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
                
                .title-text {
                    font-size: 16px;
                    font-weight: 500;
                    color: #1a1a1a;
                }
                
                .item-actions {
                    display: flex;
                    align-items: center;
                }
            }
            
            .item-info {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            
            .info-stats {
                display: flex;
                gap: 16px;
                
                .stat-item {
                    font-size: 14px;
                    color: #606266;
                    
                    .stat-label {
                        font-style: normal;
                        color: #909399;
                    }
                }
            }
            
            .recent-item-footer {
                font-size: 12px;
                color: #999;
            }
        }
    }
}

.recent-item {
    .recent-item-title {
        .item-actions {
            display: flex;
            align-items: center;
            
            .more-icon {
                font-size: 20px;
                color: #909399;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.3s;
                
                &:hover {
                    background-color: #f5f7fa;
                    color: #4e6ef2;
                }
            }
        }
    }
}

:deep(.el-dropdown-menu__item) {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    
    .el-icon {
        font-size: 16px;
    }
    
    &:hover {
        color: #4e6ef2;
        background-color: #f0f5ff;
    }
}
</style>
