<script setup>
import { ref } from 'vue'
import {
    Document,
    Clock,
    Edit,
    Delete,
    MagicStick
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 历史大纲列表
const history = ref([
    {
        title: '高等数学第一章大纲',
        time: '2024-03-15 14:30:00'
    },
    {
        title: 'C语言指针教学大纲',
        time: '2024-03-14 16:20:00'
    },
    {
        title: '软件工程导论课程大纲',
        time: '2024-03-13 09:45:00'
    },
    {
        title: '数据结构与算法分析教学大纲，包含基础数据结构和常见算法的教学内容',
        time: '2024-03-12 15:20:00'
    }
])

// 处理删除
const handleDelete = (index) => {
    // 阻止事件冒泡，防止触发行点击
    event.stopPropagation()
    history.value.splice(index, 1)
    ElMessage.success('删除成功')
}

// 处理编辑
const handleEdit = (index) => {
    window.open(`/edit?index=${index}&type=outline`)
}

// 处理行点击
const handleRowClick = (row, column, event) => {
    // 如果点击的是操作列，不进行跳转
    if (column.label === '操作') return
    // 获取当前行的索引
    const index = history.value.findIndex(item => item.title === row.title)
    handleEdit(index)
}

// 跳转到生成页面
const goToGenerate = () => {
    router.push('/layout/outline/generate')
}
</script>

<template>
    <div class="set body">
        <div class="set-header header">
            <div class="header-title">
                <el-icon class="icon"><Document /></el-icon>
                <h2>大纲助手</h2>
            </div>
            <el-button type="primary" @click="goToGenerate" class="button">
                <el-icon><MagicStick /></el-icon>
                <span>智能生成</span>
            </el-button>
        </div>
        <div class="set-body body-body">
            <div class="body-title">
                <div class="title-wrapper">
                    <el-icon><Clock /></el-icon>
                    <h3>历史记录</h3>
                </div>
            </div>
            <div class="body-main">
                <el-table 
                    :data="history" 
                    style="width: 100%" 
                    @row-click="handleRowClick"
                    :header-cell-style="{
                        background: '#f8faff',
                        color: '#485287',
                        fontWeight: '500',
                        fontSize: '15px',
                        height: '50px'
                    }"
                >
                    <el-table-column label="标题名称" min-width="500">
                        <template #default="{ row }">
                            <div class="title-cell" style="cursor: pointer">
                                {{ row.title }}
                            </div>
                        </template>
                    </el-table-column>
                    
                    <el-table-column label="最后编辑时间" width="180">
                        <template #default="{ row }">
                            <span>{{ row.time }}</span>
                        </template>
                    </el-table-column>
                    
                    <el-table-column label="操作" width="120" fixed="right">
                        <template #default="{ $index }">
                            <div class="operation-cell">
                                <el-button 
                                    type="primary" 
                                    :icon="Edit"
                                    circle
                                    size="small"
                                    @click.stop="handleEdit($index)"
                                />
                                <el-button 
                                    type="danger" 
                                    :icon="Delete"
                                    circle
                                    size="small"
                                    @click.stop="handleDelete($index)"
                                />
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.set-body {
    .body-main {
        border-radius: 16px;
        background-color: #fff;
        padding: 20px 20px 32px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        
        .title-cell {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 500px;
            color: #1a1a1a;
            font-size: 14px;
        }
        
        .operation-cell {
            display: flex;
            gap: 8px;
        }
    }
}

.button {
    margin-right: 20px;
    color: #fff;
    border-radius: 6px;
    background-color: #4e6ef2;
    border: none;
    padding: 15px 8px;
    font-size: 14px;
    
    &:hover {
        background-color: #627aff;
    }
    
    span {
        margin-right: 8px;
    }
}

:deep(.el-table) {
    border-radius: 8px;
    overflow: hidden;
    
    .el-table__row {
        td {
            padding: 16px 0;
            transition: all 0.3s;
        }
        
        &:hover {
            background-color: #f8faff;
            
            .title-cell {
                color: #4e6ef2;
            }
        }
    }
    
    .el-button {
        transition: all 0.3s;
        
        &:hover {
            transform: translateY(-1px);
        }
    }
}
</style>
