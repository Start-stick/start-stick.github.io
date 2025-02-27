(function () {
    'use strict';
    var global = tinymce.util.Tools.resolve('tinymce.PluginManager');
    var ico = "http://localhost:8080/static/zyoffice/plugin/pdf.png"
    function selectLocalImages(editor) {
      zyOffice.getInstance().SetEditor(editor).api.openPdf()
    }

    var register$1 = function (editor) {
      editor.ui.registry.addButton('zyofficepdf', {
        text: '<img src="./static/zyOffice/plugin/pdf.png"/>',
        tooltip: '导入PDF文档',
        onAction: function () {
          selectLocalImages(editor)
        }
      });
      editor.ui.registry.addMenuItem('zyofficepdf', {
        text: '<img src="./static/zyOffice/plugin/pdf.png"/>',
        tooltip: '导入PDF文档',
        onAction: function () {
          selectLocalImages(editor)
        }
      });
    };
    var Buttons = { register: register$1 };
    function Plugin () {
      global.add('zyofficepdf', function (editor) {        
        Buttons.register(editor);
      });
    }
    Plugin();
}());