<template>
    <div 
    style="border: 1px solid #ccc"
    class="editor-container"
    >
      <Toolbar
        class="w-e-toolbar"
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        class="w-e-text-editor"
        :disabled="disabled"
        :style="{ height: contentHeight + 'px', overflowY: 'hidden' }"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
        @onChange="handleChange"
      />
    </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, shallowRef, watch, nextTick, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

export default {
  name: 'RichTextEditor',
  components: { Editor, Toolbar },
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '500px'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      contentHeight: 0
    }
  },
  mounted() {
    this.updateEditorHeight()
    // 监听窗口大小变化
    window.addEventListener('resize', this.updateEditorHeight)
  },
  beforeUnmount() {
    // 移除事件监听
    window.removeEventListener('resize', this.updateEditorHeight)
  },
  methods: {
    updateEditorHeight() {
      nextTick(() => {
        const container = document.querySelector('.editor-container')
        const toolbar = document.querySelector('.w-e-toolbar')
        if (container && toolbar) {
          this.contentHeight = container.clientHeight - toolbar.clientHeight
        }
      })
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const editorRef = shallowRef()

    // 内容 HTML
    const valueHtml = ref(props.modelValue)

    // 工具栏配置
    const toolbarConfig = {
      excludeKeys: [
        'uploadImage',
        'insertVideo',
        'uploadVideo',
        'group-video',
        'group-image'
      ]
    }

    // 编辑器配置
    const editorConfig = { 
      placeholder: '请输入内容...',
      MENU_CONF: {}
    }

    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return
      editor.destroy()
    })

    const handleCreated = (editor) => {
      editorRef.value = editor // 记录 editor 实例，重要！
    }

    const handleChange = (editor) => {
      emit('update:modelValue', editor.getHtml())
    }

    // 监听 modelValue 变化
    watch(() => props.modelValue, (newVal) => {
      if (newVal !== valueHtml.value) {
        valueHtml.value = newVal
      }
    })

    return {
      editorRef,
      valueHtml,
      mode: 'default',
      toolbarConfig,
      editorConfig,
      handleCreated,
      handleChange
    }
  }
}
</script>

<style>
.editor-container {
  height: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.w-e-toolbar {
  flex-shrink: 0;
  background-color: #f8f9fa !important;
  border-bottom: 1px solid #dcdfe6 !important;
}

.w-e-text-editor {
  flex: 1;
  background-color: #fff !important;
  border: none !important;
}

.w-e-text-container {
  background-color: #fff !important;
  border: none !important;
}
.w-e-panel-content-emotion{
  width:200px;
}

/* 解决表情包超出容器 */
/* .editor-content[data-v-8c507a66]{
  overflow: visible !important;
} */
/* .editor-section{
  overflow: visible !important;
} */
</style>