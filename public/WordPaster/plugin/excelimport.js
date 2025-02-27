(function () {
    'use strict';
    var global = tinymce.util.Tools.resolve('tinymce.PluginManager');
    function selectLocalImages(editor) {        
      WordPaster.getInstance().SetEditor(editor).importExcel()
    }

    var register$1 = function (editor) {
      editor.ui.registry.addButton('excelimport', {
        text: '<img src="/static/WordPaster/plugin/excel.png"/>',
        tooltip: '导入Excel文档',
        onAction: function () {
          selectLocalImages(editor)
        }
      });
      editor.ui.registry.addMenuItem('excelimport', {
        text: '<img src="/static/WordPaster/plugin/excel.png"/>',
        tooltip: '导入Excel文档',
        onAction: function () {
          selectLocalImages(editor)
        }
      });
    };
    var Buttons = { register: register$1 };
    function Plugin () {
      global.add('excelimport', function (editor) {        
        Buttons.register(editor);
      });
    }
    Plugin();
}());