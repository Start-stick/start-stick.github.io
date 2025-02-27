(function () {
    'use strict';
    var global = tinymce.util.Tools.resolve('tinymce.PluginManager');
    var ico = "http://localhost:8080/static/zyoffice/plugin/w.png"
    function selectLocalImages(editor) {
      zyOffice.getInstance().SetEditor(editor).api.openDoc()
    }

    var register$1 = function (editor) {
      editor.ui.registry.addButton('zyoffice', {
        text: '<img src="./static/zyOffice/plugin/w.png"/>',
        tooltip: '导入Word文档（docx格式）',
        onAction: function () {
          selectLocalImages(editor)
        }
      });
      editor.ui.registry.addMenuItem('zyoffice', {
        text: '<img src="./static/zyOffice/plugin/w.png"/>',
        tooltip: '导入Word文档（docx格式）',
        onAction: function () {
          selectLocalImages(editor)
        }
      });
    };
    var Buttons = { register: register$1 };
    function Plugin () {
      global.add('zyoffice', function (editor) {        
        Buttons.register(editor);
      });
    }
    Plugin();
}());