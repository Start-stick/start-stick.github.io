(function () {
    'use strict';
    var global = tinymce.util.Tools.resolve('tinymce.PluginManager');
    function selectLocalImages(editor) {        
      WordPaster.getInstance().SetEditor(editor);
      WordPaster.getInstance().importWordToImg()
    }

    var register$1 = function (editor) {
      editor.ui.registry.addButton('importwordtoimg', {
        text: '<img src="/static/WordPaster/plugin/word1.png"/>',
        tooltip: 'Word转图片',
        onAction: function () {
          selectLocalImages(editor)
        }
      });
      editor.ui.registry.addMenuItem('importwordtoimg', {
        text: '<img src="/static/WordPaster/plugin/word1.png"/>',
        tooltip: 'Word转图片',
        onAction: function () {
          selectLocalImages(editor)
        }
      });
    };
    var Buttons = { register: register$1 };
    function Plugin () {
      global.add('importwordtoimg', function (editor) {        
        Buttons.register(editor);
      });
    }
    Plugin();
}());