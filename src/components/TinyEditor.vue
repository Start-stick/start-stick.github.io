<template>
    <div style="width:100%;height:100%;" v-loading="loading">
      <TinymceVue
        class="myTinymceVue"
        v-model="myValue"
        :init="init"
      />
      <UploadPanel
        uploadType="importProject"
        ref="UploadPanelRef"
        accept="image/gif, image/jpeg, image/jpg, image/png"
        maxLength="1"
        @importProjectUrl="importProjectUrl"
        dir="brief/"
      />
    </div>
  </template>
  <script>
  // http://tinymce.ax-z.cn/more-plugins/axupimgs.php
  import { reactive,toRefs,onMounted, getCurrentInstance, watch } from 'vue';
  import axios from "axios";
  import tinymce from 'tinymce/tinymce';
  import TinymceVue from '@tinymce/tinymce-vue';
  import 'tinymce/themes/silver'
  import 'tinymce/themes/silver/theme'
  import 'tinymce/icons/default'; //引入编辑器图标icon，不引入则不显示对应图标
  import 'tinymce/models/dom' // 这里是个坑 一定要引入
  
  
  //在TinyMce.vue中接着引入相关插件
  import "tinymce/icons/default/icons"
  // import "tinymce/plugins/image" // 插入上传图片插件
  // import "tinymce/plugins/media" // 插入视频插件
  import "tinymce/plugins/table" // 插入表格插件
  import "tinymce/plugins/lists" // 列表插件
  import "tinymce/plugins/wordcount" // 字数统计插件
  // import "tinymce/plugins/code" // 源码
  // import 'tinymce/plugins/codesample'  //代码示例
  import "tinymce/plugins/fullscreen" //全屏
  import 'tinymce/plugins/advlist'  //高级列表
  import 'tinymce/plugins/anchor'  //锚点
  import 'tinymce/plugins/autolink'  //自动链接
  import 'tinymce/plugins/autoresize'  //编辑器高度自适应,注：plugins里引入此插件时，Init里设置的height将失效
  import 'tinymce/plugins/autosave'  //自动存稿
  import 'tinymce/plugins/charmap'  //特殊字符
  import 'tinymce/plugins/directionality'  //文字方向
  import 'tinymce/plugins/emoticons'  //表情
  import 'tinymce/plugins/help'  //帮助
  import 'tinymce/plugins/importcss'  //引入css
  import 'tinymce/plugins/insertdatetime'  //插入日期时间
  import 'tinymce/plugins/link'  //超链接
  import 'tinymce/plugins/nonbreaking' //插入不间断空格
  import 'tinymce/plugins/pagebreak' //插入分页符
  import 'tinymce/plugins/preview'//预览
  import 'tinymce/plugins/quickbars'  //快速工具栏
  import 'tinymce/plugins/save'  //保存
  import 'tinymce/plugins/searchreplace'  //查找替换
  import 'tinymce/plugins/table'  //表格
  // import 'tinymce/plugins/template'  //内容模板
  import 'tinymce/plugins/visualblocks'  //显示元素范围
  import 'tinymce/plugins/visualchars'  //显示不可见字符
  export default {
    name: '',
    components: {TinymceVue},
    props: {
      value: { // 绑定的值
        type: String,
        default: '',
      },
      disabled: { // 是否禁止编辑
        type: Boolean,
        default: false
      },
      plugins: {
        type: [String, Array],
        default: 'table lists wordcount fullscreen advlist anchor autolink charmap directionality emoticons insertdatetime link nonbreaking pagebreak preview save searchreplace table visualblocks visualchars',
        // [表格 列表 全屏]
      },
      toolbar: {
        type: [String, Array],
        default: 'codesample bold italic underline alignleft aligncenter alignright alignjustify | undo redo | formatselect | fontselect | fontsizeselect | forecolor backcolor | bullist numlist outdent indent | lists link table code | removeformat | assignment'
      },
      height: {
        type: [Number, String],
        default: 600
      }
    },
    setup(props) {
      const { proxy } = getCurrentInstance(); // 相当于之前的this
      onMounted(() => { //组件挂载到页面之后执行 
        tinymce.init({}); // 初始化富文本
      });
      const data = reactive({
        loading: false,
        myValue: props.value,
        disabled: props.disabled,
        init: {
          language_url: "/tinymce/langs/zh_CN.js", // 语言包的路径
          language: "zh_CN", //语言
          skin_url: "/tinymce/skins/ui/oxide", // skin路径，
          emoticons_database_url: '/tinymce/emojis.js', // 表情路径
          // height: '600px', //编辑器高度
          branding: false, //是否禁用“Powered by TinyMCE”
          menubar: true, //顶部菜单栏显示
          image_dimensions: false, //去除宽高属性
          plugins: props.plugins,  // 插件
          toolbar: props.toolbar, // 工具栏
          promotion: false, // 隐藏右上角Upgrade 按钮
          font_formats: 'Arial=arial,helvetica,sans-serif; 宋体=SimSun; 微软雅黑=Microsoft Yahei; Impact=impact,chicago;', //字体
          fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px 64px 72px', //文字大小
          // paste_convert_word_fake_lists: false, // 插入word文档需要该属性
          paste_data_images: false,  //图片是否可粘贴
          paste_webkit_styles: "all",  //此选项允许您指定在WebKit中粘贴时要保留的样式
          paste_merge_formats: true, //此选项启用粘贴插件的合并格式功能
          nonbreaking_force_tab: false, // 此选项允许您在用户按下键盘tab键时强制TinyMCE插入三个实体
          paste_auto_cleanup_on_paste: false,
          file_picker_types: 'file', // 此选项允许您通过空格或逗号分隔的类型名称列表指定所需的文件选取器类型。目前有三种有效类型：文件、图像和媒体
          content_css: '/tinymce/skins/content/default/content.css',
          setup: (editor) => {
            let _this = proxy;
            _this.myEditor = editor
            //定义一个名为 assignment 的toolbar
            editor.ui.registry.addButton('assignment', {
              icon: "image",
              tooltip: '上传图片',
              onAction: () => {
                _this.$refs.UploadPanelRef.selectFile();
                _this.Editor = editor;
              },
            })
          },
          imagetools_toolbar: 'editimage',  // 图片控制的工具栏
          content_style:"img {max-width:100%;height:auto}", // 图片最大宽度
        },
      });
      watch(() => props.value,(newVal, oldValue) => {
          data.myValue = newVal;
        }
      );
      watch(()=>data.myValue,(newvalue,oldValue)=>{
        proxy.$emit('changeVal', newvalue);
      });
      const importProjectUrl = (url)=> {
        proxy.myEditor.execCommand('insertImage', false, `${proxy.$storage.getItem('ossDomain') + url}`, );
      };
      return {
        ...toRefs(data),
        importProjectUrl
      };
    }
  }
  </script>
  <style lang='scss' scoped>
  .components_Tinymce{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  </style>
  <style>
  .tox{
    width: 100%;
    height: 100% !important;
  }
  </style>
  