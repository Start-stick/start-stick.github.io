(function () {
    'use strict';
    var global = tinymce.util.Tools.resolve('tinymce.PluginManager');
    function selectLocalImages(editor) {        
      WordPaster.getInstance().SetEditor(editor).importWord()
    }

    var register$1 = function (editor) {
      editor.ui.registry.addButton('wordimport', {
        text: '<img src="/static/WordPaster/plugin/word2.png"/>',
        tooltip: '导入Word文档',
        onAction: function () {
          selectLocalImages(editor)
        }
      });
      editor.ui.registry.addMenuItem('wordimport', {
        text: '<img src="/static/WordPaster/plugin/word2.png"/>',
        tooltip: '导入Word文档',
        onAction: function () {
          selectLocalImages(editor)
        }
      });
    };
    var Buttons = { register: register$1 };
    function Plugin () {
      global.add('wordimport', function (editor) {        
        Buttons.register(editor);
      });
    }
    Plugin();
}());