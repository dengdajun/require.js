/*******************************************************************************
 * 文件名： sitechcallcenter.js 修改人： 姜冰 修改时间： 2010-02-22 修改内容： 亚信平台修改
 ******************************************************************************/
/**
 * 坐席状态，
 * 0：空闲 
 * 1：通话 
 * 2：忙状态 
 * 3：CTI占用 
 * 4：通话保持 
 * 5：挂起转IVR 
 * 6：等待应答 
 * 7：等待播报工号  
 * 9：整理态
 * 10：三方态
 */
var CurState = 0;
// 延时操作记录
var delyOpcode = '';
var user_hung = 1;
var outFlag = 0;//呼叫标记 0：人工接入 2：外呼 3：内部呼叫
var lastUcid = '';
var relaxTime = 20;
var relaxTimer = null;
var busyAlertTimer = null;
var busyEndTimer = null;
var busyAlertCount = 0;
var busyAlertJG = 120;
var autoEndBusyTime = 300;
var autoEndBusyTimer = null;
var doAfterCheckCode = '';
var doAfterCheckTitle = '';
var doAfterCheckUrl = '';
var specialCode = '';//Play : 放音  Verified ：密码验证 Confirmed ：二次确认
var callIsUpdateCall = true;//是否更新通话成功状态
var isPhoneCalling = false;
var intervalScanCom = null;//心跳timer
var ocxLock = false;
var needLoginDelay = false;
var succ_flag_0 = false;
var is_showDialog_ = false;//通话成功的提示框是否已显示
var is_showUserTab = false;//一通电话中是否自动打开过用户tab
/**
 * 
 * 座席签入
 */
function LoginPhoneInit() {
	cCcommonTool.DebugLog("javascript Login 签入开始");
	buttonType("K006");
	cCcommonTool.setStaffID(document.getElementById("workNo").value);
	//cCcommonTool.setStaffID('aagh03');
	cCcommonTool.setWrkType(1);
	cCcommonTool.setBActive(true);
	intervalScanCom = setInterval("scanCom()",500*1000);
	//注册接口
	if(ocxLock){
		return;	
	}
	ocxLock =true;
	var ret = cCcommonTool.Regcti();
	if(!ret){
		ocxLock =false;
		similarMSNPop("初始化注册话务接口失败！");
		cCcommonTool.ErrorLog("初始化注册话务接口cCcommonTool.Regcti失败 ret：" + ret);
	}
	cCcommonTool.DebugLog("javascript Login 签入结束ret：");
}

/**
 * * * 点击退出或者IE关闭按钮
 */

function signOutFromIE() {
	try {
		cCcommonTool.DebugLog("javascript  坐席签出开始FromIE");
		if(cCcommonTool.getIsSignIn()){
			var ret = cCcommonTool.Logout();
			cCcommonTool.DebugLog("javascript  坐席签出 Logout ret" + ret);
			//签出成功数据插入，删除坐席状态
			if (ret == true)
				singnInUpdate();
		}
		var ret1 = cCcommonTool.Unregcti();	
		chgStatus(-1,'签出');
		cCcommonTool.DebugLog("javascript  坐席签出结束 Unregcti ret1" + ret1);
	}catch (e) {
			//similarMSNPop( "LOGIt记录日志失败!");
	}
}

/**
 * 
 * 为座席按钮添加事件 
 */
 
function iniOnclick1() {
	//cCcommonTool.DebugLog("javascript iniOnclick 坐席初始化开始");
	/* 按钮签入 */
	var v_bn_sign = document.getElementById("K005");
	if (v_bn_sign != null) {
		v_bn_sign.onclick = function() {
		btn_able();
	  $('#callSearch').css('display','block');
	  $('.r2 .frame-tool').animate({width:'660px'},'slow');
	  //document.getElementById('K006').className="show";
	  //btn_disable_singleButton("K005");
	  document.getElementById('K005').className="grey_hidden";
	 // socket.go_ready(ola_extn);
		  /*		  
			cCcommonTool.DebugLog("javascript 坐席签入开始");
			if(!cCcommonTool.getIsRegcti()){
				if(ocxLock){
					return;	
				}
				ocxLock = true;
				var ret = cCcommonTool.Regcti();
				cCcommonTool.DebugLog("javascript  坐席签入 Regcti ret：" + ret);
				if(!ret){
					ocxLock =false;
					similarMSNPop("初始化注册话务接口失败！");
					cCcommonTool.ErrorLog("初始化注册话务接口cCcommonTool.Regcti失败 ret：" + ret);
					return;
	    		}
	    	needLoginDelay = true;
	    	return;
			}
			
			var ret1 = cCcommonTool.Login();
			cCcommonTool.DebugLog("javascript  坐席签入结束 ret1：" + ret1);
			*/
		}
	}
	v_bn_sign = null;

	/* 签出 */
	var v_bn_sign_out = document.getElementById('K006');
	if (v_bn_sign_out != null) {
		v_bn_sign_out.onclick = function() {
			$('#callSearch').css('display','none');
			$('.r2 .frame-tool').animate({width:'220px'},'slow');
			document.getElementById('K006').className="grey_hidden";
			document.getElementById('K005').className="show";
			var HCI_OCX = document.getElementById("IPCC");
			HCI_OCX.HCI_OCX_Logout();
			/*
			cCcommonTool.DebugLog("javascript  坐席签出开始");
			if (cCcommonTool.getState() == 4 || cCcommonTool.getState() == 1) {
				similarMSNPop("有新电话接入，无法签出!");
			}
			var ret = '';
			if(rdShowConfirmDialog("是否确定签出？")==1){
				doSignOut();
			}
			//showDialog('是否确定签出？',3,'retT=doSignOut()')
			cCcommonTool.DebugLog("javascript  坐席签出结束");
			*/
		}
	}
	v_bn_sign_out = null;

	/* 呼出 */
	var v_bn_callOutEx = document.getElementById("K025");
	if (v_bn_callOutEx != null) {
		v_bn_callOutEx.onclick = function() {
			//cCcommonTool.DebugLog("javascript  坐席呼出开始");
			showCallOutWin('');
			//window.open("../../npage/callbosspage/index.html");
			//cCcommonTool.DebugLog("javascript  坐席呼出结束");
		}
	}
	v_bn_callOutEx = null;

	/* 示忙 */
	var v_bn_SayBusy = document.getElementById("K004");
	if (v_bn_SayBusy != null) {
		v_bn_SayBusy.onclick = function() {
			doSayBusy();
		}
	}
	v_bn_SayBusy = null;

	/* 示闲 */
	var v_bn_SayFree = document.getElementById("K003");
	if (v_bn_SayFree != null) {
		v_bn_SayFree.onclick = function() {
			doSayFree();
		}
	}
	v_bn_SayFree = null;

	/* 挂机释放 */
	var v_bn_notAutoAnswer = document.getElementById('K013');
	if (v_bn_notAutoAnswer != null) {
		v_bn_notAutoAnswer.onclick = function() {
			cCcommonTool.DebugLog("javascript 开始挂机释放");
			var ret = cCcommonTool.ClearConnection('');
			if(!ret){
				similarMSNPop("调用挂机释放接口失败！");
				cCcommonTool.ErrorLog("挂机释放 cCcommonTool.Logout ret：" + ret);
				return;
	    	}
			cCcommonTool.DebugLog("javascript 结束挂机释放");
		}
	}
	v_bn_notAutoAnswer = null;
	
	/*通话保持*/
	var v_bn_holdEx = document.getElementById('K026');
	if(v_bn_holdEx != null){
		v_bn_holdEx.onclick = function(){
			cCcommonTool.DebugLog("javascript 通话保持开始");
			var ret = cCcommonTool.Hold();
			if(!ret){
				similarMSNPop("调用通话保持接口失败！");
				cCcommonTool.ErrorLog("通话保持 cCcommonTool.Logout ret：" + ret);
				return;
	    	}
			cCcommonTool.DebugLog("javascript 通话保持结束");
		}
	}
	v_bn_holdEx = null;

	/*取保持*/
	var v_bn_getHoldEx = document.getElementById('K027');
	if(v_bn_getHoldEx != null){
		v_bn_getHoldEx.onclick = function(){
			cCcommonTool.DebugLog("javascript 取保持开始");
			var ret = cCcommonTool.Retrieve();
			if(!ret){
				similarMSNPop("调用取保持接口失败！");
				cCcommonTool.ErrorLog("取保持 cCcommonTool.Retrieve ret：" + ret);
				return;
	    	}
			cCcommonTool.DebugLog("javascript 取保持结束");
		}
	}
	v_bn_getHoldEx = null;

	/* 内部呼叫 */
	var v_bn_transOut = document.getElementById('K030');
	if (v_bn_transOut != null) {
		v_bn_transOut.onclick = function() {
			cCcommonTool.DebugLog("javascript 内部呼叫开始");
			showCallInnerWin();
			cCcommonTool.DebugLog("javascript 内部呼叫结束");
		}
	}
	v_bn_transOut = null;
	
	/*
	*密码验证
	*by tancf 20081218
	*/
	var v_bn_password = document.getElementById("K019" );
	if(v_bn_password != null){
		v_bn_password.onclick = function(){
		 cCcommonTool.DebugLog("javascript 密码验证开始");	
		 if(rdShowConfirmDialog("是否确定密码验证？")==1){
		 		checkPasswd('','','');
		 }
		 cCcommonTool.DebugLog("javascript 密码验证结束");
		}
	}
	v_bn_password = null;

	/**
	 * 显示用户历史来电原因明细
	 */
	var v_bn_callCauseList = document.getElementById("K055");
	if (v_bn_callCauseList != null) {
		v_bn_callCauseList.onclick = function() {
			cCcommonTool.DebugLog("javascript 用户信息开始");
			var caller_phone = document.getElementById("acceptPhoneNo").value;
			showUserInfo(caller_phone);	
			cCcommonTool.DebugLog("javascript 用户信息结束");
			caller_phone = null;
		}
	}
	v_bn_callCauseList = null;
	

	function showUserInfo(caller_phone) {
		cCcommonTool.DebugLog("javascript 展示用户信息开始");
		var height = screen.availHeight - 400;
		var width = screen.availWidth - 500;
		var top = screen.availHeight / 2 - height / 2;
		var left = screen.availWidth / 2 - width / 2;
		var winParam = "height="
				+ height
				+ ",width="
				+ width
				+ ",top="
				+ top
				+ ",left= "
				+ left
				+ ",toolbar=no,menubar=no,scrollbars=yes, resizable=yes,location=no, status=yes";
		window.open(
				"../../npage/callbosspage/k055/show_user_call_cause_list.jsp?caller_phone="
						+ caller_phone, "callCauseWin", winParam);
		cCcommonTool.DebugLog("javascript 展示用户信息结束");
		height = null;
		width = null;
		top = null;
		left = null;
		winParam = null;
	}

	/**
	 * 测试功能 tancf 20081105
	 */
	var v_bn_Test = document.getElementById('K101');
	if (v_bn_Test != null) {
		v_bn_Test.onclick = function() {
			cCcommonTool.DebugLog("javascript 测试功能");
			parPhone.closeLogTxt();
			// alert("vdn"+parPhone.AgentInfoEx_VdnID);
			// window.open('../../npage/callbosspage/evaljs.html');
			cCcommonTool.DebugLog("javascript 测试功能");
		}
	}
	v_bn_Test = null;
	
	
	var v_bn_sendMsg = document.getElementById('K084');
	if(v_bn_sendMsg != null){
		v_bn_sendMsg.onclick = function(){
			cCcommonTool.DebugLog("javascript 调用即时消息开始");	
			cCcommonTool.ShowSmsFrm();
			cCcommonTool.DebugLog("javascript 调用即时消息结束");	
		}
	}
	v_bn_sendMsg = null;
	
	var v_bn_endLock = document.getElementById('K103');
	if(v_bn_endLock != null){
		v_bn_endLock.onclick = function(){
			cCcommonTool.DebugLog("javascript 调用结束锁定开始");	
			cCcommonTool.ReleaseLock();
			cCcommonTool.DebugLog("javascript 调用结束锁定结束");	
		}
	}
	v_bn_endLock = null;
	
	var v_bn_endRelax = document.getElementById('K104');
	if(v_bn_endRelax != null){
		v_bn_endRelax.onclick = function(){
			cCcommonTool.DebugLog("javascript 调用结束整理开始");	 
			var callinfoarr = cCcommonTool.getLastCallInfo();
			if(callinfoarr[3]==true){
					cCcommonTool.ReleaseLock();
			}
			cCcommonTool.WrkRelease();
			cCcommonTool.DebugLog("javascript 调用结束整理结束");	
		}
	}
	v_bn_endRelax = null;

	cCcommonTool.DebugLog("javascript iniOnclick 坐席初始化结束");
}

function showCallOutWin(phone_no){
	cCcommonTool.DebugLog("javascript 显示外呼弹出窗口开始");	
	var height = 158;
	var width = 241;
	var top = screen.availHeight/2 - height/2;
	var left=screen.availWidth/2 - width/2;
	var winParam = "height=" + height + ",width=" + width + ",top=" + top + ",left= " + left + ",toolbar=no,menubar=no,scrollbars=no, resizable=yes,location=no, status=no";
	window.open("../../npage/callbosspage/k025/caller_phone.jsp?phone_no="+phone_no, "callOutWin", winParam);   
  	cCcommonTool.DebugLog("javascript 显示外呼弹出窗口结束");	
}

function showCallInnerWin(){
	cCcommonTool.DebugLog("javascript  显示内部呼叫弹出窗口开始");
	var height = 460;
	var width = screen.availWidth-400;
	var top = screen.availHeight/2 - height/2;
	var left = screen.availWidth/2 - width/2;
	var winParam = "height=" + height + ",width=" + width + ",top=" + top + ",left= " + left + ",toolbar=no,menubar=no,scrollbars=no, resizable=yes,location=no, status=yes";
	window.open("../../npage/callbosspage/callInner/callinnerMain.jsp", "callInnerWin", winParam);
  	cCcommonTool.DebugLog("javascript  显示内部呼叫弹出窗口结束");
}

function checkPasswd(code,title,targetUrl){
	/*
	cCcommonTool.DebugLog("javascript  显示密码验证开始");
	var height = 120;
	var width = 260;
	var top = screen.availHeight/2 - height/2;
	var left = screen.availWidth/2 - width/2;
	var winParam = "height=" + height + ",width=" + width + ",top=" + top + ",left= " + left + ",toolbar=no,menubar=no,scrollbars=no, resizable=yes,location=no, status=yes";
	window.open("../../npage/callbosspage/K086/otherPhoneCheck.jsp", "checkPasswd", winParam);
    cCcommonTool.DebugLog("javascript  显示密码验证结束");*/
	if(cCcommonTool.getState()!=1){
		return;
	}
	doAfterCheckCode = code;
	doAfterCheckTitle = title;
	doAfterCheckUrl = targetUrl;
	if(cCcommonTool.getVerified()){
		doAtferCheck();
		return;	
	}
	var phone_no_ = '';
	if(outFlag==0)
	{
		phone_no_ = cCcommonTool.getCallingNumber();
		specialCode = 'Verified';
		cCcommonTool.ConferenceToIVR("Verify",document.getElementById("kfWorkNo").value+";"+phone_no_+";");
	}else if(outFlag==2)
	{
		phone_no_ = cCcommonTool.getCalledNumber();
		specialCode = 'Confirmed';
		cCcommonTool.ConsultConference("1008","","Confirm|"+document.getElementById("kfWorkNo").value+";00001");
	}else{
		return;
	}
	
}
function doAtferCheck(){
	if(doAfterCheckCode==''){
		doAfterCheckCode = '';
		return;
	}
	else{
		var phoneNo = document.getElementById("acceptPhoneNo").value;
		L_2(doAfterCheckCode,doAfterCheckTitle,doAfterCheckUrl,phoneNo);
	}
}
function doSayBusy() {
	cCcommonTool.DebugLog("javascript  坐席示忙开始 CurState" + CurState);
	/*
	cCcommonTool.DebugLog("javascript  坐席示忙开始 delyOpcode" + delyOpcode);
	if (CurState == 5 || CurState == 4) {
		showDialog("是否确定提交？",3,function(){
			delyOpcode = "K004";
			btn_disable_singleButton("K004");
			btn_enable_singleButton("K003");
			var J = document.getElementById("K003");
			J.onclick = function() {
				doSayFree();
			}		
		});
		return false;
	}
    */
	var lastState = cCcommonTool.getState();
	if(lastState=='9'){
		cCcommonTool.WrkRelease();
	}
	var ret = cCcommonTool.Pausee();
	if (ret) {
		cCcommonTool.setOp_code("K004");
	}else{
		similarMSNPop("调用示忙接口失败！");
		cCcommonTool.ErrorLog("示忙 cCcommonTool.Pausee ret：" + ret);
		return;
	}

	cCcommonTool.DebugLog("javascript  坐席示忙结束"+ret);
}
function doSayFree() {
	cCcommonTool.DebugLog("javascript  坐席示闲开始 CurState" + CurState);
	/*
	cCcommonTool.DebugLog("javascript  坐席示闲开始 delyOpcode" + delyOpcode);	
	if (CurState == 5 || CurState == 4) {
		showDialog("是否确定提交？",3,function(){
			delyOpcode = '';
			btn_disable_singleButton("K003");
			btn_enable_singleButton("K004");
			var J = document.getElementById("K004");
			J.onclick = function() {
				doSayBusy();
			}	
		});
		return false;
	}*/
	var ret = cCcommonTool.Ready();
	if (ret) {
		cCcommonTool.setOp_code("K003");
		clearAllTimer_0();
	}else{
		similarMSNPop("调用示闲接口失败！");
		cCcommonTool.ErrorLog("示闲 cCcommonTool.Ready ret：" + ret);
		return;
	}
	cCcommonTool.DebugLog("javascript  坐席示闲结束"+ret);
}
function doSignOut(){
	cCcommonTool.DebugLog("javascript  坐席签出开始 CurState" + CurState);
	if (cCcommonTool.getState() == 4 || cCcommonTool.getState() == 1) {
		similarMSNPop("有新电话接入，无法签出!");
	} else {
		ret = cCcommonTool.Logout();
		if(!ret){
			similarMSNPop("调用签出接口失败！");
			cCcommonTool.ErrorLog("签出cCcommonTool.Logout ret：" + ret);
			clearAllTimer_0();
			return;
	    }
	}		
}
