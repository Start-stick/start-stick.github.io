<template>
    <div>
        <Editor api-key="n84rpcpk3u22bnr0oy1q9s8w78975r67ivfdosf04jwv6pn2" :id="tinymceId" :init="init"
            :disabled="disabled" v-model="edtValue"></Editor>
    </div>
</template>
  
<script>
// 引入tinymce-vue
import Editor from '@tinymce/tinymce-vue'
import { WordPaster} from '../../public/WordPaster/js/w'
// import '../../public/WordPaster/js/w'
// import '../../public/layer-v3.1.1/layer/layer.js'
// import '../../public/layer-v3.1.1/layer/theme/default/layer.css'
// import { zyOffice } from '../../public/zyOffice/js/o'
// import { zyCapture } from '../../public/zyCapture/z'

export default {
    components: {
        Editor
    },
    props: {
        // 编号
        id: {
            type: String
        },
        // 内容
        value: {
            type: String,
            default: '<p>泽优全平台内容发布解决方案 for vue2 cli tinymce5</p><p>泽优Word一键粘贴控件（WordPaster）</p><p>泽优全平台截屏控件（zyCapture）</p><p>泽优Office文档转换服务（zyOffice）</p>'
        },
        // 是否禁用
        disabled: {
            type: Boolean,
            default: false
        },
        // 插件
        plugins: {
            type: [String, Array],
            // default: 'advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars'
            default: 'autoresize code autolink autosave image imagetools paste preview '
        },

        // 工具栏
        toolbar: {
            type: [String, Array],
            default: 'code bold italic underline forecolor fontselect fontsizeselect | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry | image | zycapture | wordpaster importwordtoimg netpaster wordimport excelimport pptimport pdfimport | zyoffice zywordexport zyofficepdf'
        },

        images_upload_url: '/demo/upimg.php',
        images_upload_base_path: '/demo',
        keep_styles: true
    },
    mounted: function () {
        // 初始化
        WordPaster.getInstance({
            // 上传接口：http://www.ncmem.com/doc/view.aspx?id=d88b60a2b0204af1ba62fa66288203ed
            PostUrl: 'http://www.ncmem.com/doc/view.aspx?id=d88b60a2b0204af1ba62fa66288203ed',
            // 为图片地址增加域名：http://www.ncmem.com/doc/view.aspx?id=704cd302ebd346b486adf39cf4553936
            ImageUrl: 'http://www.ncmem.com/doc/view.aspx?id=704cd302ebd346b486adf39cf4553936',
            // 设置文件字段名称：http://www.ncmem.com/doc/view.aspx?id=c3ad06c2ae31454cb418ceb2b8da7c45
            FileFieldName: 'http://www.ncmem.com/doc/view.aspx?id=c3ad06c2ae31454cb418ceb2b8da7c45',
            // 提取图片地址：http://www.ncmem.com/doc/view.aspx?id=07e3f323d22d4571ad213441ab8530d1
            ImageMatch: 'http://www.ncmem.com/doc/view.aspx?id=07e3f323d22d4571ad213441ab8530d1',
            ui:{render:'div'}
        })
        

        
    },
    data() {
        return {
            tinymceId: this.id || 'vue-tinymce' + Date.parse(new Date()),
            edtValue: this.value,
            init: {
                selector: 'textarea',
                // 汉化,路径是自定义的，一般放在public或static里面，汉化文件要自己去下载
                language_url: '/tinymce/zh_CN.js',
                language: 'zh_CN',
                // 皮肤
                skin: 'oxide',
                // 隐藏技术支持
                branding: false,
                // 隐藏底栏的元素路径
                elementpath: false,
                // 关闭菜单
                menubar: false,
                // 隐藏状态栏
                statusbar: false,
                // 公式插件
                external_plugins: {
                    // zycapture: 'zyCapture/plugin.min.js',

                    // wordpaster: 'WordPaster/plugin/wordpaster.js',
                    // importwordtoimg: 'WordPaster/plugin/importwordtoimg.js',
                    // netpaster: 'WordPaster/plugin/netpaster.js',
                    // wordimport: 'WordPaster/plugin/wordimport.js',
                    // excelimport: 'WordPaster/plugin/excelimport.js',
                    // pptimport: 'WordPaster/plugin/pptimport.js',
                    // pdfimport: 'WordPaster/plugin/pdfimport.js',

                    wordpaster:'../../public/WordPaster/plugin/wordpaster.js',
                    pptimport:'../../public/WordPaster/plugin/pptimport.js',
                    pdfimport:'../../public/WordPaster/plugin/pdfimport.js',
                    netpaster:'../../public/WordPaster/plugin/netpaster.js',
                    // zyoffice: 'zyOffice/plugin/zyoffice.js',
                    // zywordexport: 'zyOffice/plugin/zywordexport.js',
                    // zyofficepdf: 'zyOffice/plugin/zyofficepdf.js'
                },
                // 插件
                plugins: this.plugins,
                // 工具栏
                toolbar: this.toolbar,
                // 高度
                height: 200,
                // 粘贴data格式的图像
                paste_data_images: true,
                paste_webkit_styles: true,
                // https://www.tiny.cloud/docs/tinymce/latest/content-filtering/#valid_elements
                valid_elements: '*,table[*],td[*],img[*],strong/b,span[*],div,p[*],h1[*],h2[*],h3[*],h4[*],h5[*],h6[*]',
                invalid_elements: '',
                width: '100%',
                setup: function (edt) {
                    edt.on('paste', function (e) {
                        WordPaster.getInstance().SetEditor(edt).PasteManual()
                        e.preventDefault()
                    })
                }
            }
        }
    },
    methods: {

    },
    watch: {
        // 监听内容变化
        value(newValue) {
            this.edtValue = newValue
        },
        edtValue(newValue) {
            this.$emit('input', newValue)
        }
    }
}
</script>
<style>
.tox-notifications-container {
    display: none;
}

.tox-tinymce-aux {
    z-index: 5000 !important;
}
</style>
