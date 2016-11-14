/* 获得OCX控件 */
var parPhone = document.getElementById("Phone");
// alert("parPhone----->" + parPhone);
var fso =null;
CCcommonTool = function() {
	//是否已签入
	this.isSignIn = false;
	//是否已注册
	this.isRegcti = false;
	//是否打印日志
	this.isLog = true;
	//日志级别 0：debug 1：error
	this.logLevel = 0;
	this.state = -1;//坐席状态
	this.op_code = '';
	this.show_code = '';
	//呼出时的出局号
	this.outCallPre = '9';
	//记录上次状态发布事件中获取到的数据信息
	this.lastCallInfo = null;
	this.callerNo = '';
	this.calledNo = '';
	this.showBar = false; //是否已展示呼叫按钮
	this.verified = false; //是否密码验证通过
	this.baseCallId = '';//基本话路的ID
	this.exCallId = '';//拓展话路ID
	this.extendFlag = false;//拓展话路标志
	this.isConsultConference = false;//二次确认标志
}
CCcommonTool.prototype.LOGInit = function() {
	try {
		fso = new ActiveXObject("Scripting.FileSystemObject");
	} catch (ex) {
       
	}
}
function addZero (temp,digit) 
{
    while (String(temp).length < digit)
    {
       temp = "0" + temp; 
    }
    return String(temp);
}
CCcommonTool.prototype.LOGIt = function(sLog,level) {
	var filePath = "C:\\CtiOcxLog";
	var fileName = "jsdebug.txt";
	var d = new Date();
	
	var sDateTime = d.getYear() + "-" + addZero((d.getMonth() + 1), 2) + "-"
			+ addZero(d.getDate(), 2) + " " + addZero(d.getHours(), 2) + ":"
			+ addZero(d.getMinutes(), 2) + ":" + addZero(d.getSeconds(), 2)
			+ "." + addZero(d.getMilliseconds(), 3);
	/*
	 * if(typeof fileName == "undefined") { fileName = "jsdebug.txt"; }
	 */
	var ForReading = 1, ForWriting = 2, ForAppending = 8;
	var f;
	// fso = new ActiveXObject("Scripting.FileSystemObject");
	if (!fso.FolderExists(filePath)) {
		fso.CreateFolder(filePath);
	}
	if (!fso.FileExists(filePath + "\\" + fileName)) {
		fso.CreateTextFile(filePath + "\\" + fileName, true);
	}
	f = fso.GetFile(filePath + "\\" + fileName);
	// 文件超长判断
	if (f.size > 5 * 1024 * 1024) {
		var backupName = fileName.substr(0, fileName.length - 4) + d.getYear()
				+ addZero((d.getMonth() + 1), 2) + addZero(d.getDate(), 2)
				+ addZero(d.getHours(), 2) + addZero(d.getMinutes(), 2)
				+ addZero(d.getSeconds(), 2) + ".log";
		// 拷贝到备份文件
		f.Copy(filePath + "\\" + backupName);
		// 删除原来文件
		f.Delete(true);
		// 创建新文件
		fso.CreateTextFile(filePath + "\\" + fileName, true);
		// 再次打开新创建的文件
		f = fso.OpenTextFile(filePath + "\\" + fileName, ForAppending, true);
	} else {
		f = fso.OpenTextFile(filePath + "\\" + fileName, ForAppending, true);
	}
	var logLevel = "";
	if(level==0){
		logLevel = "<DEBUG>";
	}else{
		logLevel = "<ERROR>";
	}
	f.WriteLine("【" + sDateTime + "】" +logLevel+ "[" + this.getStaffID() + "]"
			+ " " + sLog);
	f.Close();
	f = null;
	filePath = null;
	fileName = null;
	d = null;
	sDateTime = null;
	ForReading = null;
	ForWriting = null;
	ForAppending = null;
	backupName = null;
}

// 记录日志
CCcommonTool.prototype.DebugLog = function(value) {
	if(this.isLog&&this.logLevel==0){
		try {
			this.LOGIt(value,0);
		} catch (e) {
			//similarMSNPop( "LOGIt记录日志失败!");
		}
	}
}

// 记录日志
CCcommonTool.prototype.ErrorLog = function(value) {
	if(this.isLog){
		try {
			this.LOGIt(value,1);
		} catch (e) {
			//similarMSNPop( "LOGIt记录日志失败!");
		}
	}
}
// 设置登录工号
CCcommonTool.prototype.setStaffID = function(value) {
	this.DebugLog("javascript  调用CCcommonTool.prototype.setStaffID 开始"); 
	parPhone.StaffID = value;
	this.DebugLog("javascript  调用CCcommonTool.prototype.setStaffID 结束"); 
}
CCcommonTool.prototype.getStaffID = function() {
	this.DebugLog("javascript  调用CCcommonTool.prototype.getStaffID 开始"); 
	var ret = parPhone.StaffID;
	this.DebugLog("javascript  调用CCcommonTool.prototype.getStaffID 结束,staffID:"+ret); 
	return ret;
}
// 设置工作模式,0:不确定 1:普通话务 2:预测式外呼
CCcommonTool.prototype.setWrkType = function(value) {
	this.DebugLog("javascript  调用CCcommonTool.prototype.setWrkType 开始"); 
	parPhone.WrkType = value;
	this.DebugLog("javascript  调用CCcommonTool.prototype.setWrkType 结束"); 
}
CCcommonTool.prototype.getWrkType = function() {
	this.DebugLog("javascript  调用CCcommonTool.prototype.getWrkType 开始"); 
	var ret = parPhone.WrkType;
	this.DebugLog("javascript  调用CCcommonTool.prototype.getWrkType 结束,WrkType:"+ret);
	return ret;
}
// 设置是否接入话务
CCcommonTool.prototype.setBActive = function(value) {
	this.DebugLog("javascript  调用CCcommonTool.prototype.setBActive 开始"); 
	parPhone.BActive = value;
	this.DebugLog("javascript  调用CCcommonTool.prototype.setBActive 结束"); 
}
CCcommonTool.prototype.getBActive = function() {
	this.DebugLog("javascript  调用CCcommonTool.prototype.getBActive 开始"); 
	var ret = parPhone.BActive;
	this.DebugLog("javascript  调用CCcommonTool.prototype.getBActive 结束,BActive:"+ret); 
	return ret;
}
CCcommonTool.prototype.setIsSignIn = function(value) {
	this.isSignIn = value;
}
CCcommonTool.prototype.getIsSignIn = function() {
	return this.isSignIn;
}
// 设置是否注册成功
CCcommonTool.prototype.setIsRegcti = function(value) {
	this.DebugLog("javascript  调用CCcommonTool.prototype.setIsRegcti 开始 value："+value); 
	this.isRegcti = value;
	this.DebugLog("javascript  调用CCcommonTool.prototype.setIsRegcti 结束"); 
}
CCcommonTool.prototype.getIsRegcti = function() {
	this.DebugLog("javascript  调用CCcommonTool.prototype.getIsRegcti 开始"); 
	var ret = this.isRegcti;
	this.DebugLog("javascript  调用CCcommonTool.prototype.getIsRegcti 结束,isRegcti:"+ret); 
	return ret;
}
CCcommonTool.prototype.setState = function(value) {
	this.state = value;
}
CCcommonTool.prototype.getState = function() {
	return this.state;
}
// 设置是否显示接续条
CCcommonTool.prototype.setShowBar = function(value) {
	this.DebugLog("javascript  调用CCcommonTool.prototype.setShowBar 开始 value："+value); 
	this.showBar = value;
	this.DebugLog("javascript  调用CCcommonTool.prototype.setShowBar 结束"); 
}
CCcommonTool.prototype.getShowBar = function() {
	this.DebugLog("javascript  调用CCcommonTool.prototype.getShowBar 开始"); 
	var ret = this.showBar;
	this.DebugLog("javascript  调用CCcommonTool.prototype.getShowBar 结束,showBar:"+ret); 
	return ret;
}
// 设置操作码
CCcommonTool.prototype.setOp_code = function(value) {
	this.DebugLog("javascript  调用CCcommonTool.prototype.setOp_code 开始 value："+value); 
	this.op_code = value;
	this.DebugLog("javascript  调用CCcommonTool.prototype.setOp_code 结束"); 
}
CCcommonTool.prototype.getOp_code = function() {
	this.DebugLog("javascript  调用CCcommonTool.prototype.getOp_code 开始"); 
	var ret = this.op_code;
	this.DebugLog("javascript  调用CCcommonTool.prototype.getOp_code 结束,op_code:"+ret); 
	return ret;
}
// 设置view码
CCcommonTool.prototype.setView_code = function(value) {
	this.DebugLog("javascript  调用CCcommonTool.prototype.setView_code 开始 value："+value); 
	this.view_code = value;
	this.DebugLog("javascript  调用CCcommonTool.prototype.setView_code 结束"); 
}
CCcommonTool.prototype.getView_code = function() {
	this.DebugLog("javascript  调用CCcommonTool.prototype.getView_code 开始"); 
	var ret = this.view_code;
	this.DebugLog("javascript  调用CCcommonTool.prototype.getView_code 结束,view_code:"+ret); 
	return ret;
}
//设置最新呼叫信息
CCcommonTool.prototype.setCallerNo = function(value) {
	this.callerNo = value;
}
CCcommonTool.prototype.getCallerNo = function() {
	return this.callerNo;
}
//设置最新呼叫信息
CCcommonTool.prototype.setCalledNo = function(value) {
	this.calledNo = value;
}
CCcommonTool.prototype.getCalledNo = function() {
	return this.calledNo;
}
//设置最新呼叫信息
CCcommonTool.prototype.setLastCallInfo = function(value) {
	this.lastCallInfo = value;
}
CCcommonTool.prototype.getLastCallInfo = function() {
	return this.lastCallInfo;
}
//设置是否通过密码验证
CCcommonTool.prototype.setVerified = function(value) {
	this.verified = value;
}
CCcommonTool.prototype.getVerified = function() {
	return this.verified;
}
//电话UCID
CCcommonTool.prototype.getUcid = function() {
	this.DebugLog("javascript  调用CCcommonTool.prototype.getUcid 开始"); 
	var ret = parPhone.Ucid;
	this.DebugLog("javascript  调用CCcommonTool.prototype.getUcid 结束,Ucid:"+ret); 
	return ret;
}
//主叫号码
CCcommonTool.prototype.getCallingNumber = function() {
	this.DebugLog("javascript  调用CCcommonTool.prototype.getCallingNumber 开始"); 
	var ret = parPhone.CallingNumber;
	this.DebugLog("javascript  调用CCcommonTool.prototype.getCallingNumber 结束,CallingNumber:"+ret); 
	return ret;
}
//被叫号码
CCcommonTool.prototype.getCalledNumber = function() {
	this.DebugLog("javascript  调用CCcommonTool.prototype.getCalledNumber 开始"); 
	var ret = parPhone.CalledNumber;
	this.DebugLog("javascript  调用CCcommonTool.prototype.getCalledNumber 结束,CalledNumber:"+ret); 
	return ret;
}
//原始被叫
CCcommonTool.prototype.getOrgCalledNumber = function() {
	this.DebugLog("javascript  调用CCcommonTool.prototype.getOrgCalledNumber 开始"); 
	var ret = parPhone.OrgCalledNumber;
	this.DebugLog("javascript  调用CCcommonTool.prototype.getOrgCalledNumber 结束,OrgCalledNumber:"+ret); 
	return ret;
}
//注册
CCcommonTool.prototype.Regcti = function() {
	this.DebugLog("javascript  调用CCcommonTool.prototype.Regcti 开始"); 
	var ret = parPhone.Regcti();
	this.DebugLog("javascript  调用CCcommonTool.prototype.Regcti 结束,ret:"+ret); 
	return ret;
}
//注销
CCcommonTool.prototype.Unregcti = function() {
	this.DebugLog("javascript  调用CCcommonTool.prototype.Unregcti 开始"); 
	var ret = parPhone.Unregcti();
	this.DebugLog("javascript  调用CCcommonTool.prototype.Unregcti 结束,ret:"+ret); 
	return ret;
}
//强制注销
CCcommonTool.prototype.doUnregCTI = function(serviceNo) {
	this.DebugLog("javascript  调用CCcommonTool.prototype.doUnregCTI 开始"); 
	var ret = parPhone.doUnregCTI(serviceNo);
	this.DebugLog("javascript  调用CCcommonTool.prototype.doUnregCTI 结束,ret:"+ret); 
	return ret;
}
//签入
CCcommonTool.prototype.Login = function() {
	this.DebugLog("javascript  调用CCcommonTool.prototype.Login 开始"); 
	var ret = parPhone.Login();
	this.DebugLog("javascript  调用CCcommonTool.prototype.Login 结束,ret:"+ret); 
	return ret;
}
//签出
CCcommonTool.prototype.Logout = function() {
	this.DebugLog("javascript  调用CCcommonTool.prototype.Logout 开始"); 
	var ret = parPhone.Logout();
	this.DebugLog("javascript  调用CCcommonTool.prototype.Logout 结束,ret:"+ret); 
	return ret;
}
//呼叫保持
CCcommonTool.prototype.Hold = function() {
	this.DebugLog("javascript  调用CCcommonTool.prototype.Hold 开始"); 
	var ret = parPhone.Hold();
	this.DebugLog("javascript  调用CCcommonTool.prototype.Hold 结束,ret:"+ret); 
	return ret;
}
//呼叫重建
CCcommonTool.prototype.Retrieve = function() {
	this.DebugLog("javascript  调用CCcommonTool.prototype.Retrieve 开始"); 
	var ret = parPhone.Retrieve();
	this.DebugLog("javascript  调用CCcommonTool.prototype.Retrieve 结束,ret:"+ret); 
	return ret;
}
//挂断
CCcommonTool.prototype.ClearConnection = function(ATargetStaffID) {
	this.DebugLog("javascript  调用CCcommonTool.prototype.ClearConnection 开始"); 
	this.isConsultConference = false;
	var ret = parPhone.ClearConnection();
	this.DebugLog("javascript  调用CCcommonTool.prototype.ClearConnection 结束,ret:"+ret); 
	return ret;
}
//示忙
CCcommonTool.prototype.Pausee = function() {
	this.DebugLog("javascript  调用CCcommonTool.prototype.Pausee 开始"); 
	var ret = parPhone.Pausee();
	this.DebugLog("javascript  调用CCcommonTool.prototype.Pausee 结束,ret:"+ret); 
	return ret;
}
//示闲
CCcommonTool.prototype.Ready = function() {
	this.DebugLog("javascript  调用CCcommonTool.prototype.Ready 开始"); 
	var ret = parPhone.Ready();
	this.DebugLog("javascript  调用CCcommonTool.prototype.Ready 结束,ret:"+ret); 
	return ret;
}
//呼叫
CCcommonTool.prototype.Make = function(ANumber,AStaffID,AInfo) {
	this.DebugLog("javascript  调用CCcommonTool.prototype.Make 开始"); 
	clearAllTimer_0();
	var ret = parPhone.Make(ANumber,AStaffID,AInfo);
	this.DebugLog("javascript  调用CCcommonTool.prototype.Make 结束,ret:"+ret); 
	return ret;
}
//不加出局号的呼叫
CCcommonTool.prototype.directCall = function(ANumber) {
	this.DebugLog("javascript  调用CCcommonTool.prototype.directCall 开始"); 
	if(this.getState()!=0&&this.getState()!=2){
		//similarMSNPop("当前状态不允许外呼!");
		//return false;
	}
	clearAllTimer_0();
	var ret = parPhone.Make(this.outCallPre+ANumber,'','');
	this.DebugLog("javascript  调用CCcommonTool.prototype.directCall 结束,ret:"+ret); 
	return ret;
}
//锁定
CCcommonTool.prototype.Lock = function(ASecond) {
	this.DebugLog("javascript  调用CCcommonTool.prototype.Lock 开始"); 
	var ret = parPhone.Lock(ASecond);
	this.DebugLog("javascript  调用CCcommonTool.prototype.Lock 结束,ret:"+ret); 
	return ret;
}
//解除锁定
CCcommonTool.prototype.ReleaseLock = function(ATargetStaffID) {
	this.DebugLog("javascript  调用CCcommonTool.prototype.ReleaseLock 开始"); 
	var ret = parPhone.ReleaseLock();
	this.DebugLog("javascript  调用CCcommonTool.prototype.ReleaseLock 结束,ret:"+ret); 
	return ret;
}
//进入整理态
CCcommonTool.prototype.WrkLock = function(ASecond) {
	this.DebugLog("javascript  调用CCcommonTool.prototype.WrkLock 开始"); 
	var ret = parPhone.WrkLock(ASecond);
	this.DebugLog("javascript  调用CCcommonTool.prototype.WrkLock 结束,ret:"+ret); 
	return ret;
}
//结束整理态
CCcommonTool.prototype.WrkRelease = function(ATargetStaffID) {
	this.DebugLog("javascript  调用CCcommonTool.prototype.WrkRelease 开始"); 
	var ret = parPhone.WrkRelease();
	this.DebugLog("javascript  调用CCcommonTool.prototype.WrkRelease 结束,ret:"+ret); 
	return ret;
}
//三方通话
CCcommonTool.prototype.Conference = function(AStaffID) {
	this.DebugLog("javascript  调用CCcommonTool.prototype.Conference 开始"); 
	var ret = parPhone.Conference(AStaffID);
	this.DebugLog("javascript  调用CCcommonTool.prototype.Conference 结束,ret:"+ret); 
	return ret;
}
//呼叫转移
CCcommonTool.prototype.TransferToIVR = function(AAction,AInfo,AFlow,AMessage,ACause) {
	this.DebugLog("javascript  调用CCcommonTool.prototype.TransferToIVR 开始"); 
	var ret = parPhone.TransferToIVR(AAction,AInfo,AFlow,AMessage,ACause);
	this.DebugLog("javascript  调用CCcommonTool.prototype.TransferToIVR 结束,ret:"+ret); 
	return ret;
}
//密码验证
CCcommonTool.prototype.ConferenceToIVR = function(AAction,AInfo) {
	this.DebugLog("javascript  调用CCcommonTool.prototype.ConferenceToIVR 开始"); 
	this.DebugLog(AAction+":"+AInfo); 
	var ret = parPhone.ConferenceToIVR(AAction,AInfo);
	this.DebugLog("javascript  调用CCcommonTool.prototype.ConferenceToIVR 结束,ret:"+ret); 
	return ret;
}
//单步三方通话(二次确认)
CCcommonTool.prototype.ConsultConference = function(ANumber,AStaffID,AInfo) {
	this.DebugLog("javascript  调用CCcommonTool.prototype.ConsultConference 开始"); 
	this.DebugLog(ANumber+":"+AStaffID+":"+AInfo); 
	var ret = parPhone.ConsultConference(ANumber,AStaffID,AInfo);
	if(ret){
		this.isConsultConference = true;//二次确认标志
	}
	this.DebugLog("javascript  调用CCcommonTool.prototype.ConsultConference 结束,ret:"+ret); 
	return ret;
}
//即时消息
CCcommonTool.prototype.ShowSmsFrm = function() {
	this.DebugLog("javascript  调用CCcommonTool.prototype.ShowSmsFrm 开始"); 
	var ret = parPhone.ShowSmsFrm();
	this.DebugLog("javascript  调用CCcommonTool.prototype.ShowSmsFrm 结束,ret:"+ret); 
	return ret;
}
var cCcommonTool = new CCcommonTool();
cCcommonTool.LOGInit();