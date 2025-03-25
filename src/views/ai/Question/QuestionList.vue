<script setup>
import { onMounted, ref ,watch} from 'vue'
import { useRouter } from 'vue-router'
import { Search, Edit, Delete, View, Plus,Download, MagicStick ,Close, Document, Setting} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'

const router = useRouter()
const route=useRoute()

//预览按钮是否可用
const PreviewDisable=ref(false)

//获取查询参数from
const from_query=route.query.from
// 弹框
const dialogVisible = ref(from_query!=='list'?true:false)

// 题型选择
const selectedTypes = ref([])
// 表单数据
const formData = ref({
  subject: '',
  teachingGoal: '',    // 教学目标
})

// 题型选项
const questionTypes = [
  { label: '取消全选', value: 'all' },
  { label: '单选题', value: 'single' },
  { label: '多选题', value: 'multiple' },
//   { label: '填空题', value: 'blank' },
//   { label: '判断题', value: 'judge' },
//   { label: '简答题', value: 'short' },
//   { label: '名词解释', value: 'term' }
]
const checkAll = ref(false)
const indeterminate = ref(false)
const value = ref([])

watch(value, (val) => {
  if (val.length === 0) {
    checkAll.value = false
    indeterminate.value = false
  } else if (val.length === questionTypes.length - 1) { // 排除"取消全选"选项
    checkAll.value = true
    indeterminate.value = false
  } else {
    indeterminate.value = true
  }
})

const handleCheckAll = (val) => {
  indeterminate.value = false
  if (val) {
    value.value = questionTypes
      .filter(type => type.value !== 'all') // 排除"取消全选"选项
      .map(type => type.value)
  } else {
    value.value = []
  }
}
//默认全选
onMounted(()=>{
    handleCheckAll(1)
})


// 题目列表数据
const questionList = ref([
  {
    id: 1,
    title: '下列函数数在其定义域内是连续的?',
    type: '单选题',
    difficulty: 0.8,
    usage: 1,
    accuracy: '-',
    creator: '刘芳雪',
    createTime: '03-11'
  },
  {
    id: 2, 
    title: '设 ( lim_{x \\to 2} f(x) = 4 )，则 f(2) 的值可能是:',
    type: '单选题',
    difficulty: 0.8,
    usage: 1,
    accuracy: '-',
    creator: '刘芳雪',
    createTime: '03-11'
  }
])
// 删除题目
const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除这道题目吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 从列表中移除
    const index = questionList.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      questionList.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  })
}

//查看
const clickForView=(row)=>{
  router.push({
    path: '/view-question',
    query: { id: row.id }
  })

}

//生成习题集按钮
const handleGenerate=()=>{
    console.log('点击生成');
    
}

// 更多操作菜单
const moreMenuVisible = ref(false)

// 菜单选项
const menuOptions = [
//   { 
//     label: 'Import 导入',
//     icon: Document,
//     handler: () => {
//       console.log('导入')
//       moreMenuVisible.value = false
//     }
//   },
//   {
//     label: 'Edit Settings 编辑设置',
//     icon: Setting,
//     handler: () => {
//       console.log('编辑设置')
//       moreMenuVisible.value = false
//     }
//   },
//   {
//     label: 'Send a Copy 发送副本',
//     icon: Document,
//     handler: () => {
//       console.log('发送副本')
//       moreMenuVisible.value = false
//     }
//   },
//   {
//     label: 'Duplicate Set 重复集',
//     icon: Document,
//     handler: () => {
//       console.log('复制集合')
//       moreMenuVisible.value = false
//     }
//   },
  {
    label: '删除集',
    icon: Delete,
    danger: true,
    handler: () => {
      console.log('删除集合')
      moreMenuVisible.value = false
    }
  }
]

</script>

<template>
  <div class="question-list">
    <!-- 顶部操作栏 -->
    <div class="list-header">
      <div class="header-left">
        <h2>题目列表</h2>
        <div class="list-subheader" >
            <p>这是一个副标题</p>
        </div>
        <span class="total">共 {{ questionList.length }} 题</span>
      </div>
      <div class="header-right">
        <button :disabled="PreviewDisable" class="base-icon-button" :class="{'disabled-button' : PreviewDisable,'able-button':!PreviewDisable}">
            <el-icon><View /></el-icon>
          <span>预览</span>
        </button>
        <span class="divider"></span>
        <button class="base-icon-button assign-button" >
          <span>分配</span>
        </button>
        <span class="divider"></span>
        <div class="more-wrapper" >
          <div class="more" @click="moreMenuVisible = true"></div>
          
          <div class="more-menu" v-show="moreMenuVisible" @mouseleave="moreMenuVisible = false">
            <div 
              v-for="(option, index) in menuOptions" 
              :key="index"
              class="menu-item"
              :class="{ 'danger': option.danger }"
              @click="option.handler"
            >
              <el-icon><component :is="option.icon" /></el-icon>
              <span>{{ option.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 副标题和筛选区 -->
    <div class="list-actions">
        <div class="action-row1">
            <div class="list-subheader" >
                <p contenteditable="true" tabindex="0">这是一个副标题</p>
            </div>
            <div class="action-row2">
                <div class="export-all details-checked">
                    
                  <el-checkbox>显示题目详情</el-checkbox>

                </div>
                <div class="export-all">
                    
                    <el-icon><Download /></el-icon>
                    <div class="export-name">
                        导出全部

                    </div>
                    <div class="export-wrapper">

                    </div>

                </div>

            </div>

        </div>
        <div class="action-row2">
            题型：
            <el-select
                v-model="value"
                multiple
                clearable
                collapse-tags
                placeholder="Select"
                popper-class="custom-header"
                :max-collapse-tags="1"
                style="width: 240px"
            >
                <template #header>
                <el-checkbox
                    v-model="checkAll"
                    :indeterminate="indeterminate"
                    @change="handleCheckAll"
                >
                    All
                </el-checkbox>
                </template>
                <el-option
                v-for="item in questionTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                />
            </el-select>
            <button class="base-icon-button " >
                筛选
            </button>
        </div>
    </div>

    <!-- 题目列表 -->
    <div class="list-content">
      <el-table 
        :data="questionList"
        style="width: 100%;" 
      >
        <el-table-column label="序号" width="80">
          <template #default="{ $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>
        
        <el-table-column label="文件夹/题目" show-overflow-tooltip min-width="200">
          <template #default="{ row }" >
            <div class="question-title" @click="clickForView">{{ row.title }}</div>
          </template>
        </el-table-column>
        
        <el-table-column label="题型" width="80">
          <template #default="{ row }">
            <span class="question-type">{{ row.type }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="难度" width="80">
          <template #default="{ row }">
            <span class="difficulty">{{ row.difficulty }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="使用量" width="80">
          <template #default="{ row }">
            {{ row.usage }}
          </template>
        </el-table-column>
        
        <el-table-column label="正确率" width="80">
          <template #default="{ row }">
            {{ row.accuracy }}
          </template>
        </el-table-column>
        
        <el-table-column label="创建者" width="100">
          <template #default="{ row }">
            {{ row.creator }}
          </template>
        </el-table-column>
        
        <el-table-column label="创建时间" width="100">
          <template #default="{ row }">
            {{ row.createTime }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="{ row }">
            <div class="operations">
              <el-button 
                type="danger" 
                :icon="Delete"
                circle
                @click="handleDelete(row)"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 相对定位生成按钮 -->
    <div class="generate" @click="dialogVisible=true">
        <i class="icon">

        </i>
    </div>

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
    <div class="right">
        <div class="cancle" @click="dialogVisible=false">
            <el-icon><Close /></el-icon>

        </div>
    </div>
    </el-dialog>
    </div>
</template>

<style scoped lang="scss">
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
            position: relative;
            flex:1;
            padding: 24px;
            width: 100%;
            height: 100%;
            background-color: palegreen;

            .cancle{
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                top: 10px;
                right: 10px;
                width: 30px;
                height: 30px;
                font-size: 18px;
                font-weight: 700;
                border-radius: 5px;
                color: #0d64f2;
                transition: all .3s ease;
                &:hover{
                    background-color: #e6f0ff;
                }
            }
        }
    }
    .el-dialog__header {
        display: none;
    }
    
    .el-dialog__body {
        padding: 0;
    }

}

.list-subheader{
    color: #434749;

}
.question-list {
    background-color: #fff;

    .generate{
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 120px;
        right: 20px;
        width: 48px;
        height: 48px;
        border:1px solid #c0c5cf;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 4px 14px;
        border-radius: 50%;
        background-color: #fff;
        cursor: pointer;
        .icon{
            display: inline-block;
            width: 24px;
            height: 24px;
            background: url(@/assets/ic_magic.png) no-repeat center;
            background-size: 24px 24px;
        }
        &:hover{
            background-color: #e6f0ff;
        }
    }

  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 24px;
    border-bottom: 1px solid #c0c5cf;

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;

      h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
      }

      .total {
        color: #909399;
        font-size: 14px;
      }
    }
    .header-right{
        display: flex;
        gap: 12px;
        .divider{
            height: 35px;
            width: 1px;
            background-color: #c0c5cf;
        }
        .assign-button{
            background-color: #0d64f1;
            color: #fff;
        }
        .more-wrapper {
          position: relative;
          
          .more {
            border-radius: 5px;
            height: 35px;
            width: 35px;
            background: url(@/assets/more.png) no-repeat center;
            background-size: 24px 24px;
            transition: background-color .3s ease;
            cursor: pointer;
            
            &:hover {
              background-color: rgba(78, 110, 242, 0.2);
            }
          }
          
          .more-menu {
            position: absolute;
            top: calc(100% + 4px);
            right: 0;
            width: 220px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            padding: 8px 0;
            z-index: 100;
            
            .menu-item {
              display: flex;
              align-items: center;
              padding: 12px 16px;
              cursor: pointer;
              transition: all 0.3s;
              
              .el-icon {
                font-size: 16px;
                margin-right: 12px;
                color: #606266;
              }
              
              span {
                color: #303133;
                font-size: 14px;
              }
              
              &:hover {
                background-color: #f5f7fa;
              }
              
              &.danger {
                border-top: 1px solid #ebeef5;
                margin-top: 4px;
                padding-top: 12px;
                
                .el-icon {
                  color: #f56c6c;
                }
                
                span {
                  color: #f56c6c;
                }
                
                &:hover {
                  background-color: #fef0f0;
                }
              }
            }
          }
        }
    }

    
  }

  .list-actions {
    display: flex;
    flex-direction: column;
    padding: 24px;
    color: #434749;
    gap: 12px;

    .action-row1{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 16px;
        cursor: pointer;
        .list-subheader{

            p[contenteditable="true"]{
                font-size: 18px;
                &:focus{
                    outline: none;
                    border: 1px solid #0d64f1 ;
                    
                }
                &:hover{
                    border:1px dashed #303133;
                }
                
            }

         }

    }
    .action-row2{
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 24px;

        .export-all{
            display: flex;
            flex-direction: row;
            align-items: center;
            color: #9692b3;
            .el-icon{
                margin-right: 6px;
            }

            &:hover{
                color:#0d64f1;
            }
        }

        .details-checked{
            ::v-deep() .el-checkbox__input.is-checked+.el-checkbox__label{
                color:#303133;
            }
        }

        button{
            margin-left: 20px;
            background-color: #6276ff;
            color: #fff;
        }
    }
    

    .search-input {
      width: 300px;
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: 8px;

      .filter-label {
        color: #606266;
        font-size: 14px;
      }

      .separator {
        color: #909399;
      }

      .unit {
        color: #909399;
        margin-left: 4px;
      }
    }
  }

  .list-content {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    height: calc(100vh - 185px);
    margin-right: 20px;

    .question-title {
      color: #303133;
      font-size: 14px;
    }

    .question-type {
      background: #f0f2ff;
      color: #4e6ef2;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 13px;
    }

    .difficulty {
      color: #e6a23c;
    }

    .operations {
      display: flex;
      gap: 8px;
    }
  }
}

:deep(.el-table) {
  .el-table__header {
    background-color: #f8faff;
    
    th {
      background-color: #f8faff;
      color: #485287;
      font-weight: 500;
      font-size: 14px;
      height: 50px;
    }
  }

  .el-table__row {
    td {
      padding: 16px 0;
    }
    // &:hover{
    //     cursor: pointer;
    // }

    .el-tooltip {
        cursor: pointer;
    }
  }
}
</style>