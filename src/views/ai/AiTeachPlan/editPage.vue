<script setup>
import Editor from '@/components/Editor.vue';
import {ref,watchEffect,computed} from 'vue'
import { marked } from 'marked';
import down from '@/components/button/down.vue';

const title=ref('软工经济学')
// 编辑器内容
const editorContent = ref('')
editorContent.value='当然可以！为了更好地生成符合您需求的教学大纲，请提供以下详细信息： 1. **课程名称**：具体的课程名称是什么？ 2. **教学目标**：希望通过这门课程达到哪些具体的教学目标？ 3. **年级**：这门课程面向哪个年级的学生？ 4. **学科**：这门课程属于哪个学科领域？ 此外，如果您有特定的知识库内容需要整合，请提供这些内容的概要或关键点。这将有助于我更准确地设计教学大纲。 以下是一个示例格式，您可以根据这个格式提供信息： ``` 课程名称：科学探索与实验 教学目标： 1. 掌握基本的科学实验方法和步骤。 2. 能够独立设计和完成简单的科学实验。 3. 培养学生的科学探究精神和团队合作能力。 年级：五年级 学科：科学 知识库内容： 1. 基本实验器材的使用方法 2. 常见科学实验的原理和步骤 3. 科学探究的基本流程 ``` 请提供上述信息，我将根据您的需求生成详细的教学大纲 ChatDialog.vue:114 当然可以！为了更好地生成符合您需求的教学大纲，请提供以下详细信息： 1. **课程名称**：具体的课程名称是什么？ 2. **教学目标**：希望通过这门课程达到哪些具体的教学目标？ 3. **年级**：这门课程面向哪个年级的学生？ 4. **学科**：这门课程属于哪个学科领域？ 此外，如果您有特定的知识库内容需要整合，请提供这些内容的概要或关键点。这将有助于我更准确地设计教学大纲。 以下是一个示例格式，您可以根据这个格式提供信息： ``` 课程名称：科学探索与实验 教学目标： 1. 掌握基本的科学实验方法和步骤。 2. 能够独立设计和完成简单的科学实验。 3. 培养学生的科学探究精神和团队合作能力。 年级：五年级 学科：科学 知识库内容： 1. 基本实验器材的使用方法 2. 常见科学实验的原理和步骤 3. 科学探究的基本流程 ``` 请提供上述信息，我将根据您的需求生成详细的教学大纲。 当然可以！为了更好地生成符合您需求的教学大纲，请提供以下详细信息：1. **课程名称**：具体的课程名称是什么？2. **教学目标**：希望通过这门课程达到的具体目标有哪些？3. **年级**：针对哪个年级的学生'
const mdContentToHtml =ref('')
watchEffect(() => {
    mdContentToHtml.value = marked(editorContent.value); // 将 Markdown 转换为 HTML
});
// 编辑器是否禁用
const editorDisabled = ref(false)

</script>

<template>
    <div class="edit">
        <div class="edit-header">
            <div class="title">
                <span>{{ title }}</span>
            </div>
            <div class="button-sets">
                <Down 
                :editorContent="editorContent"
                :title="title"
                />
            </div>
        </div>
        <div class="edit-body">
            <Editor  
            v-model="mdContentToHtml"
            :height="editorHeight"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.edit{
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #fff;
}
.edit-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    width: 100%;
    height: 42px;
    gap: 30px;
}
::v-deep .w-e-toolbar{
    background-color: #fff !important;
    border: none;
}
::v-deep .editor-container{
    border: none !important;
}


</style>