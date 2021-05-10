var g_Wfs = null, g_Video = null
var s_stDevAttr = null;
var bScale = 0, bZoom = 0, b3dZoom = 0, bRecord = 0, bPreview = false, bOcxInit = false, bAuto = false, bAutoScan = false, bRaino = false, bStreamType = 0, bTalk = false, bVoice = false;
var LoginIPC = null;
var s_stStreamName = null;


/******************************************
 * function: PTZ Control
 * pthis:	Button
 * isUp:		(mouse status)0-Down,1-Up,2-Out
 *******************************************/

function ptzControl(pthis,isUp){
    $obj=$(pthis);
    var nSpeed = $("#ptzSpeed").slider("getValue");
    var szPtzID=$obj.attr("id");
    if(isUp==1)
    {
        ptzStop(szPtzID, nSpeed);
    }
    else if(isUp==2){}
    else if(isUp == 3){}
    else if(isUp == 0)
    {
        switch(szPtzID){
            case "ptzUp":
                postPTZCtrl("up_start", nSpeed);
                break;
            case "ptzDown":
                postPTZCtrl("down_start", nSpeed);
                break;
            case "ptzLeft":
                postPTZCtrl("left_start", nSpeed);
                break;
            case "ptzRight":
                postPTZCtrl("right_start", nSpeed);
                break;
            case "ptzLeftUp":
                postPTZCtrl("leftup_start", nSpeed);
                break;
            case "ptzRightUp":
                postPTZCtrl("rightup_start", nSpeed);
                break;
            case "ptzLeftDown":
                postPTZCtrl("leftdown_start", nSpeed);
                break;
            case "ptzRightDown":
                postPTZCtrl("rightdown_start", nSpeed);
                break;
            case "ptzFocusIn":
                postPTZCtrl("focusadd_start", 0);
                break;
            case "ptzFocusOut":
                postPTZCtrl("focusdec_start", 0);
                break;
            case "ptzIrisPlus":
                postPTZCtrl("irisadd_start", 0);
                break;
            case "ptzIrisMinus":
                postPTZCtrl("irisdec_start", 0);
                break;
            case "ptzZoomIn":
                postPTZCtrl("zoomadd_start", 0);
                break;
            case "ptzZoomOut":
                postPTZCtrl("zoomdec_start", 0);
                break;
            case "ptzAutoId":

                break;
        }
    }
}

function ptzStop(szPtzID, nSpeed){
    switch(szPtzID){
        case "ptzUp":
            postPTZCtrl("up_stop", nSpeed);
            break;
        case "ptzDown":
            postPTZCtrl("down_stop", nSpeed);
            break;
        case "ptzLeft":
            postPTZCtrl("left_stop", nSpeed);
            break;
        case "ptzRight":
            postPTZCtrl("right_stop", nSpeed);
            break;
        case "ptzLeftUp":
            postPTZCtrl("leftup_stop", nSpeed);
            break;
        case "ptzRightUp":
            postPTZCtrl("rightup_stop", nSpeed);
            break;
        case "ptzLeftDown":
            postPTZCtrl("leftdown_stop", nSpeed);
            break;
        case "ptzRightDown":
            postPTZCtrl("rightdown_stop", nSpeed);
            break;
        case "ptzFocusIn":
            postPTZCtrl("focusadd_stop", 0);
            break;
        case "ptzFocusOut":
            postPTZCtrl("focusdec_stop", 0);
            break;
        case "ptzIrisPlus":
            postPTZCtrl("irisadd_stop", 0);
            break;
        case "ptzIrisMinus":
            postPTZCtrl("irisdec_stop", 0);
            break;
        case "ptzZoomIn":
            postPTZCtrl("zoomadd_stop", 0);
            break;
        case "ptzZoomOut":
            postPTZCtrl("zoomdec_stop", 0);
            break;
        //case "ptzAutoId":
        //postPTZCtrl("autoscan_stop", 0);
        //break;
    }
}

function barControl(pthis){
    var ret, msg;

    $obj=$(pthis);
    var szPtzID=$obj.attr("id");
    switch(szPtzID){
        case "streamType":
                bStreamType = !bStreamType;
		getVideoEncodeParam();
            break;
        case "snap":
            ret = m_livePlayOcx.capturejpeg();
            if(ret == 0){
                msg = getNodeValue('jsSnapSuccess')
            }
            else{
                msg = getNodeValue('jsSnapFailed')
            }
            $.messager.show({
                width: '210px',
                title: getNodeValue('jsTips'),
                msg: msg,
                showType:'show'
            });
            break;
        case "record":
            if(!bRecord){
                ret = m_livePlayOcx.localrecord(1);
                if(ret != 0){
                    $.messager.show({
                        width: '210px',
                        title: getNodeValue('jsTips'),
                        msg: getNodeValue('jsRecordFailed'),
                        showType:'show'
                    });
                    return;
                }
                bRecord = 1;
                $('#record').addClass("record-enable");
                $('#record').attr('title', getNodeValue('jsRecording'));
            }else{
                stopRecord();
            }
            break;
        case "talk":
            if(bTalk){
                bTalk = 0;
                $("#talk").removeClass("talk-enable");
                $("#talk").attr("title", getNodeValue("laTalk"));
            }else{
                bTalk = 1;
                $("#talk").addClass("talk-enable");
                $("#talk").attr("title", getNodeValue("jsTalking"));
            }
            break;
        case "voice":
            if(bVoice){
                stopVoice();
            }else{
                bVoice = 1;
                ret = m_livePlayOcx.soundplay(1);
                if(ret != 0){
                    $.messager.show({
                        width: '210px',
                        title: getNodeValue('jsTips'),
                        msg: getNodeValue('jsVoiceFailed'),
                        showType:'show'
                    });
                    return;
                }
                $("#voice").addClass("voice-enable");
                $("#voice").attr("title", getNodeValue("jsVoicing"));
            }
            break;
        case "zoom":
            if(!bZoom){
                if(b3dZoom){
                    m_livePlayOcx.liveptz3dlocal(0);
                    $("#3dZoom").removeClass("zoom-enable");
                }
                m_livePlayOcx.zoomimage(1);
                $('#zoom').addClass("zoom-enable");
                //$('#3dZoom').css('background-image', "url(../img/ptz.gif)");
                bZoom = 1;
            }else{
                stopZoom();
            }
            break;
        case "full":
            m_livePlayOcx.fullscreenset(1);
            break;
        case "scale":
            if(!bScale){
                //if(RIGHT_BAR_SHOW || RIGHT_PTZ_SHOW) funImageCtrl($("b_image"), 1);
                $('#scale').addClass("scale-enable");
                bScale	= 1;
                m_livePlayOcx.imagesizescanset(1);
            }else{
                stopScale();
            }
            break;
        case "3dZoom":
            if(!b3dZoom){
                if(bZoom){
                    m_livePlayOcx.zoomimage(0);
                    $('#zoom').removeClass("zoom-enable");
                }
                if(bAuto){
                    //postPTZCtrl("autoscan_stop", 0);
                    bAuto = false;
                    $("#ptzAutoId").removeClass("enable");
                }
                m_livePlayOcx.liveptz3dlocal(1);
                //$('#3dZoom').css('background-image', "url(../img/ptzon.gif)");
                $("#3dZoom").addClass("zoom-enable");
                b3dZoom = 1;
            }else{
                m_livePlayOcx.liveptz3dlocal(0);
                //$('#3dZoom').css('background-image', "url(../img/ptz.gif)");
                $("#3dZoom").removeClass("zoom-enable");
                b3dZoom = 0;
            }
            break;
        case "preset":
            postPTZCtrl('preset_set', eval($("#presetNum").combobox("getValue")));
            break;
        case "preclear":
            postPTZCtrl('preset_clean', eval($("#presetNum").combobox("getValue")));
            break;
        case "prerun":
            postPTZCtrl('preset_call', eval($("#presetNum").combobox("getValue")));
            break;
    }

}

function initPTZ()
{
    // direction
    $(".ptz").each(function(){
        var $obj=$(this);
        $obj.mouseup(function(){ ptzControl(this,1); })
        //.mouseout(function(){ ptzControl(this,2); })
            .mousedown(function(){ ptzControl(this,0); })
        //.click(function(){ ptzControl(this,3); });
    });
    $("#ptzAutoId").click(function(){
		/*if(!bAuto){
		 postPTZCtrl("autoscan_start", 0);
		 bAuto = true;
		 $("#ptzAutoId").addClass("enable");
		 }else{
		 postPTZCtrl("autoscan_stop", 0);
		 bAuto = false;
		 $("#ptzAutoId").removeClass("enable");
		 }*/
        postPTZCtrl("go_home", 0);
    });
}

function initMenuBar()
{
    $(".toolbar").each(function(){
        var $obj=$(this);
        $obj.click(function(){ barControl(this); });
    });
	/*$(".aid").each(function(){
	 var $obj=$(this);
	 $obj.click(function(){ barControl(this); });
	 });*/
    $(".trackbtn").each(function(){
        var $obj=$(this);
        $obj.click(function(){ barControl(this); });
    })
}

function initPage(){
    var stData = new Array();

    $('#ptzLeftUp').attr('title', getNodeValue('laLeftUp'));
    $('#ptzUp').attr('title', getNodeValue('laUp'));
    $('#ptzRightUp').attr('title', getNodeValue('laRightUp'));
    $('#ptzZoomOut').attr('title', getNodeValue('laZoomOut'));
    //$('#laZoom').attr('title', getNodeValue('laZoomTip'));
    $('#ptzZoomIn').attr('title', getNodeValue('laZoomIn'));
    $('#ptzLeft').attr('title', getNodeValue('laLeft'));
    $('#ptzAutoId').attr('title', getNodeValue('jsAutoScan'));
    $('#ptzRight').attr('title', getNodeValue('laRight'));
    $('#ptzFocusOut').attr('title', getNodeValue('laFocusOut'));
    //$('#laFocus').attr('title', getNodeValue('laFocusTip'));
    $('#ptzFocusIn').attr('title', getNodeValue('laFocusIn'));
    $('#ptzLeftDown').attr('title', getNodeValue('laLeftDown'));
    $('#ptzDown').attr('title', getNodeValue('laDown'));
    $('#ptzRightDown').attr('title', getNodeValue('laRightDown'));
    $('#ptzIrisPlus').attr('title', getNodeValue('laIrisPlus'));
    $('#laIris').attr('title', getNodeValue('laIrisTip'));
    $('#ptzIrisMinus').attr('title', getNodeValue('laIrisMinus'));
    $('#speedTip').attr('title', getNodeValue('laSpeed'));
    $('#streamType').attr('title', getNodeValue('laMainStream'));

    stData = [];
    for(var i = 0; i < 255; i++){
        stData.push({'value': i, 'text': i.toString()});
    }
    $("#presetNum").combobox({
        //require: true,
        //min: 0,
        //max: 254,
        //missingMessage: getNodeValue('jsmissingMessage'),
        panelMaxHeight: 200,
        panelHeight:'auto',
        invalidMessage: getNodeValue('jspresetNum'),
        tipPosition: 'right',
        validType: 'numRange[0, 254]',
        textField: 'text',
        valueField: 'value',
        data: stData,
        value: 0
    });

    stData = [];
    stData.push({'value': 2, 'text': getNodeValue('laAuto')}, {'value': 3, 'text': getNodeValue('laManual')}, {'value': 4, 'text': getNodeValue('laOnePush')});
    $('#emAFMode').combobox({
        valueField: 'value',
        textField: 'text',
        editable:false,
        data: stData,
        panelHeight:'auto',
        value: 2,
        onSelect: function(record){
            changeAFMode(record.value);
            setVParam({
                setType:'"stAF": {"emAFMode"',
                arg: [record.value],
                key: "}"
            });
        }
    });

    $("#presetNum").combobox('textbox').keypress(function (e) {
        if (e.which == 45) {
            return ($(this).val().indexOf("-") == -1 ? true : false);
        }
        var c = String.fromCharCode(e.which);

        if ((e.which >= 48 && e.which <= 57 && e.ctrlKey == false && e.shiftKey == false) || e.which == 0 || e.which == 8) {
            return true;
        } else {
            if (e.ctrlKey == true && (e.which == 99 || e.which == 118)) {
                return true;
            } else {
                return false;
            }
        }
    }).blur(function (e){
        var value = parseInt($("#presetNum").combobox('getValue'));
        if(isNaN(value) || (value > 254 || value < 0)){
            $("#presetNum").combobox('setValue', 0)	;
        }
    });

	g_Video = document.getElementById("preview");
	g_Video.addEventListener('contextmenu', function (e) { e.preventDefault(); });
	g_Video.muted = true;
	
    setDisplay("ptzFocusInDisable", 0);
    setDisplay("ptzFocusOutDisable", 0);
}

function changeAFMode(mode){
    if(mode == '3'){
        setDisplay("ptzFocusInDisable", 0);
        setDisplay("ptzFocusIn", 1);
        setDisplay("ptzFocusOutDisable", 0);
        setDisplay("ptzFocusOut", 1);
    }
    else{
        setDisplay("ptzFocusInDisable", 1);
        setDisplay("ptzFocusIn", 0);
        setDisplay("ptzFocusOutDisable", 1);
        setDisplay("ptzFocusOut", 0);
    }
}

function resetAFMode(value){
    $('#emAFMode').combobox('setValue', value);
    changeAFMode(value);
}

function InitMsg(){
    $.extend($.fn.validatebox.defaults.rules,{
        numRange: {
            validator: function(value, param){
                if((param[1] < value || value < param[0]))
                    return false;
                else
                    return true;
            },
            message: 'Please input the range'
        }
    });
}

function changeView(stEnvEncode){
	var uri = null, nPort, szProtocol;
	
	releasePlayer();
	if (bStreamType) {
		$("#streamType").removeClass("mstream");
		$("#streamType").addClass("sstream");
	} else {
		$("#streamType").removeClass("sstream");
		$("#streamType").addClass("mstream");
	}
	
	$('#streamType').attr('title', "");
	
	if (!stEnvEncode.hasOwnProperty("stMaster") && !stEnvEncode.hasOwnProperty("stSlave")) {
		return;
	}
	
	if ((bStreamType == 0 && stEnvEncode.stMaster && stEnvEncode.stMaster.emVideoCodec != 5)) {
		$.messager.alert(getNodeValue('jsWarning'), getNodeValue('jsOnlyPreviewMsg'), 'error');
		return;
	}
	
	if (bStreamType == 1 && stEnvEncode.stSlave && stEnvEncode.stSlave.emVideoCodec != 5) {
		$.messager.alert(getNodeValue('jsWarning'), getNodeValue('jsOnlyPreviewMsg'), 'error');
		return;
	}
	
	nPort = 8088;
	if (window.parent.g_stNetWork != null && window.parent.g_stNetWork.stNetPort != null && window.parent.g_stNetWork.stNetPort.wPortWs != null) {
		nPort = window.parent.g_stNetWork.stNetPort.wPortWs;
	}
	
	if (g_webprotocol == "https:") {
		szProtocol = "wss://";
		nPort -= 1;
	} else {
		szProtocol = "ws://";
	}
	
	g_Wfs = new Wfs();
	if(bStreamType){
		uri = szProtocol + g_hosturl + ":" + nPort + "/" + s_stStreamName.stSlave.szStreamName;
		//$("#streamType").removeClass("mstream");
		//$("#streamType").addClass("sstream");
		$('#streamType').attr('title', getNodeValue('laSubStream'));
	}else{
		uri = szProtocol + g_hosturl + ":" + nPort + "/" + s_stStreamName.stMaster.szStreamName;
		//$("#streamType").removeClass("sstream");
		//$("#streamType").addClass("mstream");
		$('#streamType').attr('title', getNodeValue('laMainStream'));
	}
	
	g_Wfs.attachMedia(g_Video, uri);
}


function pageload(){
    ChangeLanguage("../../xml/new_cfg/control.xml", window.parent.m_szLanguage);
    $.messager.defaults = {ok: getNodeValue('jsConfirm'), cancel: getNodeValue('jsCancel')};
    initPage();
    initPTZ();
    initMenuBar();
    InitMsg();
    s_stDevAttr = window.parent.parent.g_stDevAttr;
    s_stStreamName = window.parent.parent.g_stStreamName;
    //document.getElementById('preview').style.display = '';

    updateAFMode();

    if (isSupportedMediaSource()) {
		$("#jsMSNotSupport").hide();
	} else {
		//$("#jsMSNotSupport").show();
		$("#preview").hide();
		$("#trToolbar").hide();
		alert(getNodeValue("jsMSNotSupport"));
		return 0;
	}
	
	bStreamType = 0;
	getVideoEncodeParam();
}

function updateAFMode(){
    $.ajax({
        url: "/ajaxcom",
        dataType: "json",
        cache : false,
        data: {szCmd:'{"GetEnv":{"VideoParam":{"nChannel":-1}}}'},
        success: function(data){
            if(data.nRetVal == 0)
            {
                var value = data.stValue[0].stAF.emAFMode;
                $('#emAFMode').combobox('setValue', value);
                changeAFMode(value);
            }
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){
            $.messager.show({
                title: getNodeValue('jsLoadParam'),
                msg: getNodeValue('jsLoadParamErr'),
                showType:'show'
            });
        }
    });
}

function getVideoEncodeParam(){
	var stEnvEncode;
	
	$.ajax({
		type: "post",
		url: "/ajaxcom", 
		dataType: "json",
		cache : false,
		data: {szCmd:'{"GetEnv":{"VideoEncode":{"nChannel":-1}}}'}, 
		success: function(data){
			if(data.nRetVal != 0)
			{
				return;
			}
			
			stEnvEncode = data.stValue[0];
			changeView(stEnvEncode);
		},
		error : function(XMLHttpRequest, textStatus, errorThrown){
		}
	});
}

function pageUnload(){
    releasePlayer();
}
function releasePlayer(){	
	if(g_Wfs != null)
	{		
		g_Wfs.destroy();
		g_Wfs = null;
	}
}