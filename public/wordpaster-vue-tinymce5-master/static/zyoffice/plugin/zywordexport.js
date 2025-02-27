(function () {
    'use strict';
    var global = tinymce.util.Tools.resolve('tinymce.PluginManager');
    var ico = "http://localhost:8080/static/zyoffice/plugin/exword.png"
    function selectLocalImages(editor) {
      zyOffice.getInstance().SetEditor(editor).api.exportWord()
    }

    var register$1 = function (editor) {
      editor.ui.registry.addButton('zywordexport', {
        text: '<img src="./static/zyOffice/plugin/exword.png"/>',
        tooltip: '导出Word文档（docx格式）',
        onAction: function () {
          selectLocalImages(editor)
        }
      });
      editor.ui.registry.addMenuItem('zywordexport', {
        text: '<img src="./static/zyOffice/plugin/exword.png"/>',
        tooltip: '导出Word文档（docx格式）',
        onAction: function () {
          selectLocalImages(editor)
        }
      });
    };
    var Buttons = { register: register$1 };
    function Plugin () {
      global.add('zywordexport', function (editor) {        
        Buttons.register(editor);
      });
    }
    Plugin();
}());