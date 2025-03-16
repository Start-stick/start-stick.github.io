<script setup>
import AiTeachPlan from './AiTeachPlan.vue'
import {ref} from 'vue'
import {
    Plus,
    Delete,
    Edit,
    Document,
    Clock,
    Search
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router=useRouter()
const searchText = ref('')

const history=ref([
    {
        title:'软工经济学',
        time:'2025-2-06 17:35:34'
    },
    {
        title:'高数',
        time:'2025-2-06 17:37:28'
    },
    {
        title:'语文',
        time:'2025-2-06 17:39:56'
    },
    {
        title:'课程体系中，JSP基础入门是一个重要的实践环节。它不仅是连接理论知识与实践操作',
        time:'2025-2-06 17:41:44'
    },
])

const handleDelete = (index) => {
    // 阻止事件冒泡，防止触发行点击
    event.stopPropagation()
    history.value.splice(index, 1)
}
const handleEdit=(index)=>{
    window.open(`/edit?index=${index}`)
}

// 处理行点击
const handleRowClick = (row, column, event) => {
    // 如果点击的是操作列，不进行跳转
    if (column.label === '操作') return
    // 获取当前行的索引
    const index = history.value.findIndex(item => item.title === row.title)
    handleEdit(index)
}

const goToGenerate=()=>{
    router.push('/layout/teachplan/generate')
}
</script>

<template>
    <div class="set">
        <div class="set-header">
            <div class="header-title">
                <el-icon class="icon"><Document /></el-icon>
                <h2>教案生成集合</h2>
            </div>
            <el-button type="primary" @click="goToGenerate" class="button">
                <span>创建</span>
                <el-icon><Plus /></el-icon>
            </el-button>
        </div>
        <div class="set-body">
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
.set{
    padding: 20px 40px;
    display: grid;
    gap: 20px;
    background-color: #f6f8fc;
}

.set-header{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    
    .header-title {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .icon {
            font-size: 24px;
            color: #4e6ef2;
        }
        
        h2 {
            font-size: 22px;
            color: #1a1a1a;
            margin: 0;
            font-weight: 600;
        }
    }
}

.set-body{
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    .body-title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 4px;
        
        .title-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
            
            .el-icon {
                font-size: 18px;
                color: #4e6ef2;
            }
            
            h3 {
                font-size: 16px;
                color: #606266;
                margin: 0;
                font-weight: 500;
            }
        }
        
    }
    
    .body-main{
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
    color: #fff;
    border-radius: 6px;
    background-color: #4e6ef2;
    border: none;
    transition: all 0.3s ease;
    padding: 15px 8px;
    font-size: 14px;
    
    &:hover {
        background-color: #627aff;
        transform: translateY(-1px);
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
