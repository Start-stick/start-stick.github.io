import './json2.min'
import './jquery-1.8.3.min'
import '../layer-v3.1.1/layer/layer'
/*
	版权所有 2009-2021 荆门泽优软件有限公司
	保留所有权利
	官方网站：http://www.ncmem.com
	产品首页：http://www.ncmem.com/webapp/scp2/index.aspx
	控件下载：http://www.ncmem.com/webapp/scp2/pack.aspx
	示例下载：http://www.ncmem.com/webapp/scp2/versions.aspx
	联系邮箱：1085617561@qq.com
	联系QQ：1085617561
	版本：2.1.2
*/
function debugMsg(txt){$("#msg").append(txt+"<br/>");}

export function zyCaptureManager()
{
    var _this = this;
    this.data={
        browser:{name:navigator.userAgent.toLowerCase(),ie:true,ie64:false,chrome:false,firefox:false,edge:false,arm64:false,mips64:false,platform:window.navigator.platform.toLowerCase()},
        editor:null,opened:false,parter:null,socket:null,tryConnect:true,inited:false,
        error:{
            "0": "就绪"
          , "1": "发送数据错误"
          , "2": "接收数据错误"
          , "3": "域名未授权或为空"
          , "4": "公司未授权或为空"
          , "5": "nat app error"
      },
        language:{
            en:{
                "CapForm": "Capture Form Selecter"
              , "CapFormTitle": "Choose Capture Form"
              , "CapFormTip": "Please set the window to the front which you want to intercept resize"
              , "BtnOk": "Ok"
              , "BtnCancel": "Cancel"
              , "RectSuze": "Rect Size"
              , "CurRGB": "Current RGB"
              , "QuckCap": "Double-click can be quickly completed Screenshot"
          },
            zh_cn:{
                "CapForm": "截屏选择窗口"
              , "CapFormTitle": "选择截屏窗口"
              , "CapFormTip": "请将您想要截取的窗口调整到最前"
              , "BtnOk": "确定"
              , "BtnCancel": "取消"
              , "RectSuze": "区域大小"
              , "CurRGB": "当前RGB"
              , "QuckCap": "双击可以快速完成截图"
          },
            zh_tw:{
                "CapForm": "截屏選擇視窗"
              , "CapFormTitle": "選擇截屏視窗"
              , "CapFormTip": "請將您想要截取的視窗調整到最前"
              , "BtnOk": "確定"
              , "BtnCancel": "取消"
              , "RectSuze": "區域大小"
              , "CurRGB": "當前RGB"
              , "QuckCap": "雙擊可以快速完成截圖"
          }
        },
        state:{
            Ready : 0,
            Posting : 1,
            Stop : 2,
            Error : 3,
            GetNewID : 4,
            Complete : 5,
            WaitContinueUpload	: 6,
            None : 7,
            Waiting : 8
        }
    };
    _this.State = _this.data.state.None;
	this.scpFF = null;
    this.scpIE = null;
    this.ui = { panel: null, ico: null, img: null, msg: null, per: null ,setup:null,dlg:0};
    this.event = {
        postComplete: function (src) { 
            var html = "<img src='"+src+'?t=' + new Date().getTime()+"'/>";
            tinyMCE.activeEditor.execCommand('mceInsertRawHTML', false, html)
        }, 
        webSocketClose:function(){
            _this.data.inited = false;
        },
        hotKey: function (e) { 
            setTimeout(function () {
                e.Capture2()
            }, 100)
        }
    };
    
    this.api={
        run:function(){
            if (typeof navigator.msLaunchUri != 'undefined')
            {
                console.log(_this.Config.edge.protocol + "://" + _this.Config.edge.port);
                //up6://9006
                navigator.msLaunchUri(_this.Config.edge.protocol+"://"+_this.Config.edge.port, function ()
                {
                    console.log('应用打开成功');
                }, function ()
                {
                    console.log('启动失败');
                });
            }
        },
        runChr:function(){
            var protocol = _this.Config.edge.protocol + "://" + _this.Config.edge.port;
            var html = "<iframe id='scp-uri-fra' width=1 height=1 src='" + protocol + "'></iframe>";
            $("#scp-uri-fra").remove();
            $(document.body).append(html);
        },
        connect:function(){
            if (!_this.data.tryConnect) return;
            var con = new WebSocket('ws://127.0.0.1:' + _this.Config.edge.port);
            console.log("开始连接服务:" + 'ws://127.0.0.1:' + _this.Config.edge.port);
    
            // 打开Socket 
            con.onopen = function (event)
            {
                _this.data.socket = con;
                _this.data.tryConnect = false;
                console.log("服务连接成功");
    
                // 监听消息
                con.onmessage = function (event)
                {
                    _this.recvMessage(event.data);
                };
    
                // 监听Socket的关闭
                con.onclose = function (event)
                {
                    console.log("连接关闭");
                    _this.data.tryConnect=true;
                    _this.event.webSocketClose();//
                };
            };
            con.onerror = function (event)
            {
                _this.api.run();
                console.log("连接失败");
            };
        },
        close:function(){
            if (_this.data.socket) { _this.data.socket.close(1000,"close");}
        },
        send:function(p){
            if(_this.data.socket)_this.data.socket.send(JSON.stringify(p));
        },
        init:function(){
            var param = { name: "init", config: _this.Config,fields:_this.Config.Fields };
            _this.api.postMessage(param);
        },
        capture: function (opt) {
            var param = $.extend({}, opt,{ name: "capture" });
            _this.api.postMessage(param);
        },
        captureScreen: function (opt) {
            var param = $.extend({},opt,{ name: "capture_screen" });
            _this.api.postMessage(param);
        },
        captureRect: function (left, top, width, height) {
            var param = { name: "capture_rect" ,x: left, y: top, w: width, h: height };
            _this.api.postMessage(param);
        },
        paste: function () {
            var param = { name: "paste" };
            _this.api.postMessage(param);
        },
        postMessage:function(json){
            _this.data.parter.postMessage(JSON.stringify(json));
        },
        postMessage2:function(json){
            _this.api.send(json);
        },
        loadCss:function(url,callback){
            var css = document.createElement("link");
            css.setAttribute("rel", "stylesheet");
            css.setAttribute("type", "text/css");
            css.setAttribute("href", url);
            if(callback){
                css.onreadystatechange = function () {
                    if (css.readyState === "loaded" || css.readyState === "complete") {
                        // no need to be notified again
                        css.onreadystatechange = null;
                        // notify user
                        callback();
                    }
                };
    
                // other browsers
                css.onload = function () {
                    callback();
                };
            }
            css.onerror=function(){
                console.log("加载CSS错误，"+url);
            }
            document.head.appendChild(css);
        },
        loadJs:function(js,callback){
            var script = document.createElement("script");
            script.src = js;
    
            // monitor script loading
            // IE < 7, does not support onload
            if (callback) {
                script.onreadystatechange = function () {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        // no need to be notified again
                        script.onreadystatechange = null;
                        // notify user
                        callback();
                    }
                };
    
                // other browsers
                script.onload = function () {
                    callback();
                };
            }
    
            // append and execute script
            document.head.appendChild(script);
        }
    };

	//全局配置信息
	this.Config = {
        event:{},
		  "PostUrl"		: "http://www.ncmem.com/upload.aspx"
		, "EncodeType"	: "utf-8"
		, "Version"		: "1,4,74,5817"
		, "Company"		: "荆门泽优软件有限公司"
		, "License2"	: ""
        , "Debug"       : false//是否打开调试模式
        , "LogFile"     : "F:\\log.txt"//日志文件路径
        , "FileFieldName": "img"//自定义图片文件字段名称。
        , "ImageMatch"  : ""//服务器返回数据匹配模式，正则表达式，提取括号中的地址
        , "ImageUrl"    : ""//自定义图片地址，格式"{url}"，{url}为固定变量，在此变量前后拼接图片路径，此变量的值为posturl返回的图片地址
		, "LanCur"	    : this.data.language.zh_cn//语言设置
		, "Quality"     : 100//jpg图片质量，仅对jpg格式有效
		, "ShowForm"	: true//是否显示截屏提示窗口
		, "ImageType"	: "png"//图片上传格式。png,jpg,bmp
		, "NameCrypto"	: "crc"//名称生成算法。crc,md5,sha1,uuid
		, "IcoPath"		: "./static/zyCapture/uploading.gif"
        , "Cookie"      : ""
        , "HotKey"      : "Ctrl+Alt+Q"
        , "Authenticate": { "type": "ntlm", "name": "", "pass": "" }//域环境信息
        , "UI": {
            selector: {
                border: "#DC143C"//选框边框
            },
            font:["21","22","23","24"]
        }
        , Fields: {"uname": "test","upass": "test","uid":"0","fid":"0"}
        //x86
        , ie: {
              part: { clsid: "9767D337-E10A-4319-8854-E4B0FB635274", name: "Xproer.ScreenCapturePro2" }
            , path: "http://res2.ncmem.com/download/scp2/pack/2.1.8/scp.cab"
        }
        //x64
        , ie64: {
            part: { clsid: "399B59CE-646E-4430-9000-138DF6515306", name: "Xproer.ScreenCapturePro2x64" }
            , path: "http://res2.ncmem.com/download/scp2/pack/2.1.8/scp64.cab"
        }
        , firefox: { name: "", type: "application/npScpPro2", path: "http://res2.ncmem.com/download/scp2/pack/2.1.8/scp.xpi" }
        , chrome: { name: "npScpPro2", type: "application/npScpPro2", path: "http://res2.ncmem.com/download/scp2/pack/2.1.8/scp.crx" }
	    //Chrome 45
        , chrome45: { name: "com.xproer.down2", path: "http://res2.ncmem.com/download/scp2/pack/2.1.8/scp.crx" }
        , exe: { path: "http://res2.ncmem.com/download/scp2/pack/2.1.8/scp.exe" }
        , edge: {protocol:"zycapture",port:18092,visible:false}
        , mac: { path: "http://res2.ncmem.com/download/scp2/mac/1.0.36/zyCapture.pkg" }
        , linux: { path: "http://res2.ncmem.com/download/scp2/linux/1.0.25/com.ncmem.capture_2020.12.3-1_amd64.deb" }
        , arm64: { path: "http://res2.ncmem.com/download/scp2/arm64/1.0.22/com.ncmem.capture_2020.12.3-1_arm64.deb" }
        , mips64: { path: "http://res2.ncmem.com/download/scp2/mips64/1.0.19/com.ncmem.wordpaster_2020.12.3-1_mips64el.deb" }
    };

    if (arguments.length > 0) {
        var par = arguments[0];
        if (typeof (par.config) != "undefined") $.extend(true, this.Config, par.config);
        if (typeof (par.event) != "undefined") $.extend(true, this.event, par.event);
        if (typeof (par.ui) != "undefined") $.extend(true, this.ui, par.ui);
    }

	this.postError = function (json)
	{
        this.OpenMsg();
	    this.ui.msg.html(
            this.data.error[json.value]+"<br/>"+
            "PostUrl:"+this.Config["PostUrl"]+"<br/>"+
            "License2:"+this.Config["License2"]+"<br/>"+
            "当前Url:"+window.location.href);
	    this.ui.per.text("");
	};
	this.postProcess = function (json)
	{
        this.OpenMsg();
	    this.ui.per.text(json.percent);
	};
	this.postComplete = function (json)
	{
	    this.ui.per.text("100%");
	    this.ui.msg.text("上传完成");
	    this.CloseMsg(); //隐藏信息层
        this.event.postComplete(json.value);
	};
	this.runComplete = function (json)
	{
	    this.Browser.exitCheck();
	};
    this.loadComplete = function (json) {
        this.data.inited = true;
	    var needUpdate = true;
	    if (typeof (json.version) != "undefined") {
	        if (json.version == this.Config.Version) {
	            needUpdate = false;
	        }
	    }
        if (needUpdate) this.need_update();
        else { this.CloseMsg(); }
	};
    this.load_complete_edge = function (json) {
        this.data.inited = true;
        this.SafeCheck();
        this.CloseMsg();
	    _this.api.init();
	};
    this.afterCapture = function (json) { this.OpenMsg();/*打开信息面板*/ };
    this.hotKey = function (json) { this.event.hotKey(this); }
    this.state_message = function (json) { alert(json.msg); }
	this.recvMessage = function (str)
	{
	    var json = JSON.parse(str);
	    if      (json.name == "AfterCapture") { _this.afterCapture(json); }
        else if (json.name == "HotKey") { _this.hotKey(json); }
        else if (json.name == "state_message") { _this.state_message(json); }
        else if (json.name == "post_process") { _this.postProcess(json); }
	    else if (json.name == "post_error") { _this.postError(json); }
	    else if (json.name == "post_complete") { _this.postComplete(json); }
	    else if (json.name == "run_complete") { _this.runComplete(json); }
	    else if (json.name == "run_error") { _this.postError(json); }
	    else if (json.name == "load_complete") { _this.loadComplete(json); }
	    else if (json.name == "load_complete_edge") { _this.load_complete_edge(json); }
	};

    this.pluginLoad = function () {
        if (!this.data.inited) {
            if (this.data.browser.edge) {
                this.api.connect();
            }
        }
    };
    this.pluginCheck = function () {
        if (!this.data.inited) {
            this.setup_tip();
            this.pluginLoad();
            return false;
        }
        return true;
    };
    this.checkBrowser = function () {
        this.data.browser.ie = this.data.browser.name.indexOf("msie") > 0;
        //IE11
        this.data.browser.ie = this.data.browser.ie ? this.data.browser.ie : this.data.browser.name.search(/(msie\s|trident.*rv:)([\w.]+)/) != -1;
        this.data.browser.firefox = this.data.browser.name.indexOf("firefox") > 0;
        this.data.browser.chrome = this.data.browser.name.indexOf("chrome") > 0;    
        this.data.browser.chrome45 = false;
        this.data.browser.edge = this.data.browser.name.indexOf("Edge") > 0;
        this.data.browser.arm64 = this.data.browser.platform.indexOf("aarch64")>0;
        this.data.browser.mips64 = this.data.browser.platform.indexOf("mips64")>0;
        this.chrVer = navigator.appVersion.match(/Chrome\/(\d+)/);
        this.ffVer = this.data.browser.name.match(/Firefox\/(\d+)/);
        if (this.data.browser.edge) { this.data.browser.ie = this.data.browser.firefox = this.data.browser.chrome = this.data.browser.chrome45 = false; }

        //Win64
        if (window.navigator.platform == "Win64")
        {
            $.extend(this.Config.ie,this.Config.ie64);
        }
        else if (this.data.browser.ie) {
    
        }//macOS
        else if (window.navigator.platform == "MacIntel") {
            this.data.browser.edge = true;
            this.api.postMessage = this.api.postMessage2;
            this.api.run = this.api.runChr;
            this.Config.ExePath = this.Config.mac.path;
        }
        else if (window.navigator.platform == "Linux x86_64") {
            this.data.browser.edge = true;
            this.api.postMessage = this.api.postMessageEdge;
            this.api.run = this.api.runChr;
            this.Config.ExePath = this.Config.linux.path;
        }
        else if (this.data.browser.arm64) {
            this.data.browser.edge = true;
            this.api.postMessage = this.api.postMessage2;
            this.api.run = this.api.runChr;
            this.Config.ExePath = this.Config.arm64.path;
        }
        else if (this.data.browser.mips64) {
            this.data.browser.edge = true;
            this.api.postMessage = this.api.postMessage2;
            this.api.run = this.api.runChr;
            this.Config.ExePath = this.Config.mips64.path;
        }//Firefox
        else if (this.data.browser.firefox)
        {
            this.api.postMessage = this.api.postMessage2;
            this.api.run = this.api.runChr;
            this.data.browser.edge = true;
        } //chrome
        else if (this.data.browser.chrome)
        {
            _this.Config["XpiPath"] = _this.Config["CrxPath"];
            _this.Config["XpiType"] = _this.Config["CrxType"];
            
            this.data.browser.edge = true;
            this.api.postMessage = this.api.postMessage2;
            this.api.run = this.api.runChr;
        }
        else if (this.data.browser.edge)
        {
            this.api.postMessage = this.api.postMessage2;
        }
    }

	this.GetHtml = function ()
	{
        //ff
        var html = "";
        //ie
	    //html += '<div style="display: none">';
	    html += '<object name="scpIE" classid="clsid:' + this.Config.ie.part.clsid + '"';
	    html += ' codebase="' + this.Config.ie.path + '#version=' + this.Config["Version"] + '" width="1" height="1"></object>';
        if (this.edge) html = '';
	    //html += '</div>';
	    //
        html += '<div name="ui-scp" class="panel-scp" style="display:none;">\
	                <img name="ico" alt="进度图标"/><span name="msg">图片上传中...</span><span name="per">10%</span>\
	            </div>';
        //安装提示
        html += '<div name="scp-ui-setup" class="panel-scp panel-setup"><div style="padding:10px;"></div></div>';
	    return html;
	};

    //安全检查，在用户关闭网页时自动停止所有上传任务。
    this.SafeCheck = function (event) {
        //$(window).bind("beforeunload", function (event) {});
        $(window).bind("unload", function () {
            if (this.data.browser.edge) _this.api.close();
        });
    };
	this.setup_tip = function ()
    {
        var dom = this.ui.setup.html("控件加载中，如果未加载成功请先<a name='w-exe'>安装控件</a>");
        var lnk = dom.find('a[name="w-exe"]');
        lnk.attr("href", this.Config.exe.path);

        this.ui.dlg= layer.open({
            type: 1,
            title: "提示信息",
            closeBtn: 1,
            area: ['170px', '113px'],
            content: this.ui.setup,
            shadeClose: false,
            end: function () {
                this.ui.setup.css("display", "none");
            }
        });
    };
    this.need_update = function () {
        var dom = this.ui.setup.html("发现新版本，请<a name='w-exe' href='#'>更新</a>");
        var lnk = dom.find('a[name="w-exe"]');
        lnk.attr("href", this.Config.exe.path);
    };

    //加载到document.body中
	this.loadAuto= function()
	{
        if(!zyCapture.inited)
        {
            var ui = $(document.body).append(this.GetHtml());
            this.initUI(ui);
        }
        zyCapture.inited=true;
    };
	
	//加截到指定对象内部
	this.load_to = function(oid)
	{
        if(!zyCapture.inited)
        {
            var ui = $("#" + oid).append(this.GetHtml());
            this.initUI(ui);
        }
        zyCapture.inited=true;
    };

    this.initUI = function (ui)
    {
        this.data.parter = ui.find('embed[name="scpFF"]').get(0);
        this.scpIE = ui.find('object[name="scpIE"]').get(0);
        this.ui.panel = ui.find('div[name="ui-scp"]');
        this.ui.ico = ui.find('img[name="ico"]').attr("src", this.Config["IcoPath"]);
        this.ui.msg = ui.find('span[name="msg"]');
        this.ui.per = ui.find('span[name="per"]');
        this.ui.setup = ui.find('div[name="scp-ui-setup"]');

        this.checkBrowser();
        if (!_this.data.browser.edge) {
            if (_this.data.browser.ie) {
                _this.data.parter = _this.scpIE;
            }
            _this.data.parter.recvMessage = _this.recvMessage;
        }
        if (_this.data.browser.edge) {
            _this.api.connect();
        }
        else {
            _this.api.init();
        }
    };
    this.setEditor=function(e){
        this.data.editor=e;
        return this;
    };

	//截屏函数
    this.Capture = function () {
        if (!this.pluginCheck()) return;
        var opt = { autoHide: false};//自动隐藏当前窗口
        this.api.capture(opt);
    };
    this.Capture2 = function () {
        if (!this.pluginCheck()) return;
        var opt = { form: this.Config.ShowForm };//不显示提示窗口
        this.api.capture(opt);
    };
    //自动隐藏当前窗口
    this.CaptureHide = function () {        
        if (!this.pluginCheck()) return;
        var opt = { autoHide: true };//自动隐藏当前窗口
        this.api.capture(opt);};

    /**
     * 截取整个屏幕
     * @param bool edit 是否启动编辑
     */
    this.CaptureScreen = function (edit)
    {
        if (!this.pluginCheck()) return;
        this.api.captureScreen({"edit":edit});
    };
	//截取指定区域
    this.CaptureRect = function (x, y, w, h)
    {
        if (!this.pluginCheck()) return;
        this.api.captureRect(x, y, w, h);
    };
    this.OpenMsg = function () {
        if(_this.data.opened) return;
        var cfg={width:"371px",height:"169px",title:"截屏图片上传进度"};
        if (arguments.length > 0) {
            var par = arguments[0];
            $.extend(true,cfg,par);
        }
        this.ui.dlg = layer.open({
            type: 1,
            title: cfg.title,
            closeBtn: 1,
            area: [cfg.width, cfg.height],
            content: _this.ui.panel,
            shadeClose: false,
            success: function(layero){
                _this.ui.msg.text("图片上传中...");
                layer.setTop(layero);
            },
            end: function () {
                _this.ui.panel.hide();
                _this.ui.dlg=0;
                _this.data.opened=false;
            }
        });
        _this.data.opened=true;
    };
    this.Paste = function () {
        if (!this.pluginCheck()) return;
        this.api.paste();
    };
	this.CloseMsg = function(){
        layer.closeAll();
        layer.close(_this.ui.dlg);
        _this.ui.dlg=0;
        _this.data.opened=false;
    };

    this.loadAuto();
}
//用法：
/**
 * zyCapture.getInstance()
 */
export var zyCapture={
    instance:null,
    inited:false,
    getInstance:function(cfg){
        if (this.instance == null) {
            this.instance = new zyCaptureManager(cfg);
            window.zyCapture = this.instance;
        }
        return this.instance;
    }
};