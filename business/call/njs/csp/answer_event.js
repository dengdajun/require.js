// 公共回调函数
function doneProcess(packet) {
	cCcommonTool.DebugLog("javascript  doneProcess");
}
function doProcessNavcomring(packet) {
	cCcommonTool.DebugLog("javascript  doProcessNavcomring");
}
//接触专用回调函数
function doProcessNavtouchId(packet) {
	cCcommonTool.DebugLog("javascript  doProcessNavtouchId begin");
	var retCode = packet.data.findValueByName("retCode");
	var contactId = packet.data.findValueByName("contactId");
	var contactMonth = packet.data.findValueByName("contactMonth");
	document.getElementById("contactId").value = contactId;
	document.getElementById("contactMonth").value = contactMonth;
	cCcommonTool.DebugLog("javascript  doProcessNavtouchId end contact_id:"+contactId);
}
function doneProcessComering(packet) {
	cCcommonTool.DebugLog("javascript  doneProcessComering begin");
	var retCode = packet.data.findValueByName("retCode");
	var grade_code = packet.data.findValueByName("grade_code");
	var fav_code = packet.data.findValueByName("fav_code");
	var outFlag_ = packet.data.findValueByName("outFlag");
	if(outFlag_==3){
		outFlag = 3;
	}
	if (retCode == "000000") {
		retCode = null;
	} else {
		similarMSNPop("记录来电日志处理失败");
		retCode = null;
	}
	cCcommonTool.DebugLog("javascript  doneProcessComering end outFlag_"+outFlag_);

}
function doProcessK013(packet)
{	
	cCcommonTool.DebugLog("javascript  doProcessK013");
	var retType = packet.data.findValueByName("retType");
	var retCode = packet.data.findValueByName("retCode");
	var retMsg = packet.data.findValueByName("retMsg");
}
// 签入对签入表插入一条新的记录
function singnInInsert() {
	// alert('签入写表');
	var packet = new AJAXPacket("/npage/callbosspage/signIn/singnInInsert.jsp",
			"正在处理,请稍后...");
	packet.data.add("retType", "chkExample");
	packet.data.add("localIp", document.getElementById("local_ip").value);
	packet.data.add("kfWorkNo", document.getElementById("kfWorkNo").value);
	packet.data.add("loginNo", document.getElementById("workNo").value);
	core.ajax.sendPacket(packet, doProcessNavcomring, true);
	packet = null;
}
// 状态变更
function chgStatus(status_code, status_name) {
	cCcommonTool.DebugLog("javascript begin chgStatus");
	var lastState_ = cCcommonTool.getState() ;
	if (lastState_!= status_code) {
		cCcommonTool.setState(status_code);

		var loginNo = document.getElementById("workNo").value;
		var ccsWorkNo = document.getElementById("kfWorkNo").value;
		var vdnWork = '';
		var workGroup = '';
		// var regionCode=document.getElementById("regionCode").value;
		var monitorFlag = '否';
		var mainCCS = '';
		var BackCcsIP = '';
		// cCcommonTool.DebugLog("regionCode:"+regionCode+",monitorFlag:"+monitorFlag);
		var packet = new AJAXPacket(
				'/npage/callbosspage/public/pubChgStatus_new.jsp?retType=chgStatus&loginNo='+loginNo+'&ccsWorkNo='+ccsWorkNo+'&status_code='+status_code+'&status_name='+status_name+'&vdnWork='+vdnWork+'&workGroup='+workGroup+'&monitorFlag='+monitorFlag+'&mainCCS='+mainCCS+'&BackCcsIP='+BackCcsIP,
				"正在处理,请稍后...");
		core.ajax.sendPacket(packet, doProcessNavcomring, true);
		var arr=new Array("'3'");
		var oprTypeAll=arr.join(",");
		if(status_code==2){
			recodeTime(oprTypeAll,'3',1,"");
		}else if(lastState_==2){
			recodeTime(oprTypeAll,'',2,"");
		}
	}
	cCcommonTool.DebugLog("javascript end chgStatus");
}
// 签出对签入签出表更新一条新的记录
function singnInUpdate()
{
	cCcommonTool.DebugLog("javascript begin singnInUpdate");
    var packet = new AJAXPacket("/npage/callbosspage/signIn/singnInUpdate.jsp","正在处理,请稍后...");
    packet.data.add("retType" ,  "chkExample");
    packet.data.add("kfWorkNo" ,document.getElementById("kfWorkNo").value);
    //增加传入boss工号，不直接在session中获取，防止session失效后签出日志记录错误
    packet.data.add("loginNo" ,document.getElementById("workNo").value);
    core.ajax.sendPacket(packet,doProcessNavcomring,true);
	packet =null;
	cCcommonTool.DebugLog("javascript end singnInUpdate");
}

// 得到接触流水
function getContactId(user_phone) {
	cCcommonTool.DebugLog("javascript  getContactId begin");
	var packet = new AJAXPacket(
			"../../npage/callbosspage/k021/getContactId.jsp",
			"\u6b63\u5728\u5904\u7406,\u8bf7\u7a0d\u540e...");
	packet.data.add("user_phone" ,  user_phone);
	core.ajax.sendPacket(packet, doProcessNavtouchId, false);
	packet = null;
	cCcommonTool.DebugLog("javascript  getContactId end");
}


// 客户来电日志
function comering(callInfoArr){
	cCcommonTool.DebugLog("comering  begin ");
	if(isPhoneCalling){
		clrCallTimer();
		sK013insert();
	}
	isPhoneCalling = true;
    var callid="";
	var contactid = document.getElementById("contactId").value;
	if(contactid==null||contactid==''){
		getContactId('');
		contactid = document.getElementById("contactId").value;
	}
	var touch_type = document.getElementById("touch_type").value;
	var login_no = document.getElementById("workNo").value;
	var workNo = document.getElementById("kfWorkNo").value;
	var ipAddress = document.getElementById("local_ip").value;
	var orgCode = '';
	var op_code_id = '';
	var class_id = '';
	var org_id = '';
	var duty = "否";
	var language_call = "1";
    var userType="";
    var callid = callInfoArr[10];
    var caller = cCcommonTool.getCallingNumber();
    var called = cCcommonTool.getCalledNumber();
	outFlag = 0;
	
	if(callInfoArr[6]){
		outFlag = 2;
	}
	
	//TODO 内部呼叫的判断，outFlag = 3
	//内部呼叫的主叫方不进行记录
	if(outFlag == 3&&callInfoArr[6]){
		return;
	}
	
  	var tempurl="/npage/callbosspage/k021/comeRing.jsp";			
	var unionString="?contactId="+contactid+"&outFlag="+outFlag+"&caller="+caller+"&called="+ called+"&login_no="+login_no+
	"&workNo="+workNo+"&ipAddress="+ipAddress+"&orgCode="+orgCode+"&opCode="+op_code_id+"&class_id="+class_id+"&org_id="+org_id+
	+"&duty="+duty+"&language_call="+language_call+"&agentSkill=&userType="+userType+"&callid="+callid+"&touch_type="+touch_type;
	var urlStrl=tempurl+unionString;
	
	var packet = new AJAXPacket(urlStrl,"正在处理,请稍后...");		
	cCcommonTool.DebugLog("urlStrl:"+urlStrl);
	core.ajax.sendPacket(packet, doneProcessComering, true);
	packet = null;
    cCcommonTool.DebugLog("comering end ");
}
function oprateDcallcall(){
	cCcommonTool.DebugLog("javascript oprateDcallcall begin");
	var contactid = document.getElementById("contactId").value;
	var touch_type = document.getElementById("touch_type").value;
	cCcommonTool.DebugLog("javascript oprateDcallcall contactid"+contactid);
	var packet = new AJAXPacket('/npage/callbosspage/k021/updateDcallcall.jsp?contactid='+contactid+"&touch_type="+touch_type,"正在处理,请稍后...");
	core.ajax.sendPacket(packet,doneProcess,true);
	packet =null;
	cCcommonTool.DebugLog("javascript oprateDcallcall end");
}
function sK013insert(){
	cCcommonTool.DebugLog("javascript sK013insert begin");
	if(!isPhoneCalling){
		return;
	}
	var succ_flag = 'N';
	if(succ_flag_0){
		succ_flag = 'Y';
	}
	isPhoneCalling = false;
	var contactid = document.getElementById("contactId").value;
	var touch_type = document.getElementById("touch_type").value;
	var packet = new AJAXPacket("/npage/callbosspage/K013/K013_new.jsp?contact_id="+contactid+"&hang_up="+user_hung+"&succ_flag="+succ_flag+"&touch_type="+touch_type,"正在处理,请稍后...");
	core.ajax.sendPacket(packet,doProcessK013,true);
	packet =null;
	user_hung = 1;
	//document.getElementById("contactId").value = "";
	cCcommonTool.DebugLog("javascript sK013insert end");
}
function recodeTime(oprTypeAll,oprType,sign,staffNo){
		var workNo=document.getElementById("workNo").value;
		var packet = new AJAXPacket("/npage/callbosspage/public/recordLogin.jsp","\u6b63\u5728\u5904\u7406,\u8bf7\u7a0d\u540e...");
		packet.data.add("WorkNo", workNo);
		packet.data.add("oprTypeAll", oprTypeAll);
		packet.data.add("oprType", oprType);
		packet.data.add("sign", sign);
		packet.data.add("staffNo", staffNo);
		core.ajax.sendPacket(packet,doneProcess,true);
		packet =null;
		workNo = null;          
}
// 销毁session phonenum
function destSessionPhone(id) {
	cCcommonTool.DebugLog("javascript  destSessionPhone begin"+id);
	var user_phone = document.getElementById("acceptPhoneNo").value;
	if(user_phone!=id){
		 if(cCcommonTool.getState()==1||cCcommonTool.getState()==4||cCcommonTool.getState()==6||cCcommonTool.getState()==10){
		 	if(/^1\d{10}$/.test(user_phone)){
		 		inputcall(user_phone);
			}
		 	return;
		 }
	}else{
		 if((cCcommonTool.getState()==1||cCcommonTool.getState()==4||cCcommonTool.getState()==6||cCcommonTool.getState()==10)&&!is_showUserTab){
		 	if(cCcommonTool.lastCallInfo!=null&&cCcommonTool.lastCallInfo[6]==false){							 
		 		is_showUserTab = true;
		 		if(/^1\d{10}$/.test(user_phone)){
		 			inputcall(user_phone);
				}		 	
		 		return;
		 	}
		 }		
	}
	if(nextPhoneId!=''){
			if(!(cCcommonTool.getState()==1||cCcommonTool.getState()==4||cCcommonTool.getState()==6||cCcommonTool.getState()==10)){
				var temp_phone = nextPhoneId;
				nextPhoneId = '';
				if(/^1\d{10}$/.test(temp_phone)){
		 			inputcall(temp_phone);
				}		
			}
	}
	var packet = new AJAXPacket(
			"/npage/callbosspage/k021/destSessionPhone.jsp",
			"");
	packet.data.add("phoneNo", id);
	core.ajax.sendPacket(packet, doProcessDestSessionPhone, true);
	packet = null;
	cCcommonTool.DebugLog("javascript  destSessionPhone end");
}
// 得到接触流水
function doProcessDestSessionPhone() {
	
}
//通话计时
var call_nowsll = ""; 
var call_hoursll=0;
var call_minitesll=0;
var call_secondsll=0;
var h_callTimer = null;
function timeCall(){
	h_callTimer = setTimeout("timeCall()",1000);
	var secondVarsl;
	var minitVarsl;
	var hourVarsl;
	call_secondsll++;
	if(call_secondsll<10){
		secondVarsl="0"+call_secondsll;
	}else{
  	if(call_secondsll==60){
  		call_secondsll=0;
  		secondVarsl="00";
  		call_minitesll++;
  	}else{
  		secondVarsl=call_secondsll+"";
  	}
	}
	if(call_minitesll<10){
		minitVarsl="0"+call_minitesll;
	}else{
  	if(call_minitesll==60){
  		call_minitesll=0;
  		minitVarsl="00";
  		call_hoursll++;
		}else{
  		minitVarsl=call_minitesll+"";
		}
	}
	if(call_hoursll<10){
		hourVarsl="0"+call_hoursll;
	}else{
		hourVarsl=call_hoursll+"";
	}
	call_nowsll=hourVarsl+""+":"+minitVarsl+":"+secondVarsl;
	document.getElementById("phoneStatus").innerHTML = "| 通话时长 "+call_nowsll; 
}
function beginTimeCall(){
	clrCallTimer();
	h_callTimer = setTimeout("timeCall()",1000);
}
function clrCallTimer(){
	if(h_callTimer!=null){
		clearTimeout(h_callTimer); 
		h_callTimer = null;
	}
  document.getElementById("phoneStatus").innerHTML = "| 通话时长 00:00:00";
  call_nowsll = ""; 
	call_hoursll=0;
	call_minitesll=0;
	call_secondsll=0;
}
//通讯心跳
function scanCom(){
	var workNo=document.getElementById("workNo").value;
	var isLogin = '0';
	if(cCcommonTool.getIsSignIn()){
		isLogin = '1';
	}
 	var mypacket = new AJAXPacket("/npage/callbosspage/config/K101_scan_rpc.jsp","通讯扫描，请稍候......");
  mypacket.data.add("login_no",workNo);
  mypacket.data.add("isLogin",isLogin);
  core.ajax.sendPacket(mypacket,retScanCom,true);
	mypacket=null;
}
function retScanCom(){

}