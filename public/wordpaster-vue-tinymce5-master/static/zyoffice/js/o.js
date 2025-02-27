import './json2.min'
import './jquery-1.8.3.min'
import './o.css'
import '../../layer-v3.1.1/layer/layer'
import '../../layer-v3.1.1/layer/theme/default/layer.css'

/*
	版权所有 2009-2024 荆门泽优软件有限公司 保留所有版权。
	产品：http://www.ncmem.com/webapp/zyoffice/index.aspx
    版本：1.0
*/

export function zyOfficeManager()
{
	var _this = this;
    this.Fields = {}; //
    this.event = {
        scriptReady: function () {
            $(function () {
                //加载
                if (typeof (_this.ui.render) == "undefined") {
                    _this.LoadTo($(document.body));
                }
                else if (typeof (_this.ui.render) == "string") {
                    _this.LoadTo($("#" + _this.ui.render));
                }
                else if (typeof (_this.ui.render) == "object") {
                    _this.LoadTo(_this.ui.render);
                }
            });
        },
        doc_sel: function (evt) {
            _this.ui.dlg.panel.css("display", "");
            _this.ui.dlg.msg.text("正在转换中");
            _this.api.openDialog();
            var fs = evt.target.files;
            _this.api.upload_doc(fs[0]);
            evt.target.value = null;
        },
        upload_complete: function (evt) {
            var svr = JSON.parse(evt.target.responseText);
            _this.api.insertHtml(svr.body);
            layer.closeAll();
        },
        upload_failed: function () {
            _this.ui.dlg.ico.attr("src", _this.ui.ico.error);
            _this.ui.dlg.msg.text("服务器连接失败，请检查Office文件转换服务是否启动");
        },
        upload_process: function (evt) { }
    };
    this.ui = { editor:null,setup: null ,
        single: null,
        btn: { up: null,exportWord:null,pdf:null },
        dlg: { panel: null, ico: null, msg: null },
        ico:{
            error:"./static/zyoffice/error.png",
            upload:"./static/zyoffice/upload.gif"
        }
    };
    this.data={
        browser:{name:navigator.userAgent.toLowerCase(),ie:true,ie64:false,chrome:false,firefox:false,edge:false,arm64:false,mips64:false,platform:window.navigator.platform.toLowerCase()},
        error:{
        "0": "连接服务器错误",
        "1": "发送数据错误",
        "2": "接收数据错误"
      },
      type:{local:0/*本地图片*/,network:1/*网络图片*/,word:2/*word图片*/}
    };
    this.api = {
        openDoc: function () {
            _this.Config.api=_this.Config.word;
            _this.ui.btn.up.click();
        },
        exportWord:function(){
            var form = new FormData(); // FormData object
            form.append("html", tinyMCE.activeEditor.getContent()); // File object

            var req = new XMLHttpRequest();
            req.open("POST", _this.Config.wordExport,true);
            req.responseType = "blob"; // 返回类型blob
            req.onload = function() {
                if (this.status === 200) {
                    var blob = this.response;
                    var reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onload = function(e) {
                        var a = document.createElement('a');
                        a.download = "word-export.docx";
                        a.href = e.target.result;
                        $("body").append(a);
                        a.click();
                        $(a).remove();
                    }
                }
            }
            req.send(form);
        },
        openPdf: function () {
            _this.Config.api=_this.Config.pdf;
            _this.ui.btn.pdf.click();
        },
        openDialog: function () {
            layer.open({
                type: 1,
                closeBtn: 1,
                scrollbar: false,
                title: "Office文档转换",
                area: ["550px","160px"],
                content: _this.ui.dlg.panel,
                end: function () {
                    _this.ui.dlg.panel.css("display", "none");
                    _this.ui.dlg.ico.attr("src", _this.ui.ico.upload);
                }
            });
        },
        upload_doc: function (file) {
            var fileObj = file;

            var form = new FormData(); // FormData object
            form.append("file", fileObj); // File object

            var xhr = new XMLHttpRequest();  // XMLHttpRequest object
            xhr.open("post", _this.Config.api, true); //post
            xhr.onload = _this.event.upload_complete;
            xhr.onerror = _this.event.upload_failed;

            xhr.upload.onprogress = _this.event.upload_process;
            xhr.upload.onloadstart = function () {
                //ot = new Date().getTime();
                //oloaded = 0;
            };

            xhr.send(form);
        },
        insertHtml: function (v) {
            //_this.ui.editor.execCommand("insertHtml", v);
            tinyMCE.activeEditor.execCommand('mceInsertRawHTML', false, v);
        }
    };
	this.Config = {
        api:"http://localhost:8080/zyoffice/word/convert",
        word:"http://localhost:8080/zyoffice/word/convert",
        wordExport:"http://localhost:8080/zyoffice/word/export",
        pdf:"http://localhost:8080/zyoffice/pdf/upload",
    };

	if (arguments.length > 0) {
        var cfg = arguments[0];
        if (typeof (cfg) != "undefined") $.extend(true, this.Config, cfg);
        if (typeof (cfg.ui) != "undefined") $.extend(true, this.ui, cfg.ui);
    }

	this.LoadTo = function (o)
    {
        o.append('<input style="display: none" type="file" id="btnUpWord" accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"/>\
        <input style="display: none" type="file" id="btnUpPdf" accept="application/pdf"/>\
<div id="w_dlg" style="display:none">\
            <img id = "w_ico" />\
                    <span id="w_msg"></div>\
</div>');
        this.ui.btn.up = $("#btnUpWord");
        this.ui.btn.pdf = $("#btnUpPdf");
        this.ui.btn.up.change(this.event.doc_sel);
        this.ui.btn.pdf.change(this.event.doc_sel);
        this.ui.dlg.panel = $("#w_dlg");
        this.ui.dlg.ico = $("#w_ico");
        this.ui.dlg.ico.attr("src", this.ui.ico.upload);
        this.ui.dlg.msg = $("#w_msg");
	};
	this.InsertHtml = function (html)
	{
		//tinyMCE.activeEditor.execCommand('mceInsertRawHTML', false, html);
		this.ui.editor.execCommand('mceInsertRawHTML', false, html);
	};

    //在FCKeditor_OnComplete()中调用
	this.SetEditor = function (edt)
	{
		this.ui.editor=edt;
        return this;
	};

    //init
    this.event.scriptReady();
}

export var zyOffice = {
    instance: null,
    inited: false,
    getInstance: function (cfg) {
        if (this.instance == null) {
            this.instance = new zyOfficeManager(cfg);
            window.zyOffice = zyOffice;
        }
        return this.instance;
    }
}