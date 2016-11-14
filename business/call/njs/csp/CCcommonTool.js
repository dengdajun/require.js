/* ���OCX�ؼ� */
var parPhone = document.getElementById("Phone");
// alert("parPhone----->" + parPhone);
var fso =null;
CCcommonTool = function() {
	//�Ƿ���ǩ��
	this.isSignIn = false;
	//�Ƿ���ע��
	this.isRegcti = false;
	//�Ƿ��ӡ��־
	this.isLog = true;
	//��־���� 0��debug 1��error
	this.logLevel = 0;
	this.state = -1;//��ϯ״̬
	this.op_code = '';
	this.show_code = '';
	//����ʱ�ĳ��ֺ�
	this.outCallPre = '9';
	//��¼�ϴ�״̬�����¼��л�ȡ����������Ϣ
	this.lastCallInfo = null;
	this.callerNo = '';
	this.calledNo = '';
	this.showBar = false; //�Ƿ���չʾ���а�ť
	this.verified = false; //�Ƿ�������֤ͨ��
	this.baseCallId = '';//������·��ID
	this.exCallId = '';//��չ��·ID
	this.extendFlag = false;//��չ��·��־
	this.isConsultConference = false;//����ȷ�ϱ�־
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
	// �ļ������ж�
	if (f.size > 5 * 1024 * 1024) {
		var backupName = fileName.substr(0, fileName.length - 4) + d.getYear()
				+ addZero((d.getMonth() + 1), 2) + addZero(d.getDate(), 2)
				+ addZero(d.getHours(), 2) + addZero(d.getMinutes(), 2)
				+ addZero(d.getSeconds(), 2) + ".log";
		// �����������ļ�
		f.Copy(filePath + "\\" + backupName);
		// ɾ��ԭ���ļ�
		f.Delete(true);
		// �������ļ�
		fso.CreateTextFile(filePath + "\\" + fileName, true);
		// �ٴδ��´������ļ�
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
	f.WriteLine("��" + sDateTime + "��" +logLevel+ "[" + this.getStaffID() + "]"
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

// ��¼��־
CCcommonTool.prototype.DebugLog = function(value) {
	if(this.isLog&&this.logLevel==0){
		try {
			this.LOGIt(value,0);
		} catch (e) {
			//similarMSNPop( "LOGIt��¼��־ʧ��!");
		}
	}
}

// ��¼��־
CCcommonTool.prototype.ErrorLog = function(value) {
	if(this.isLog){
		try {
			this.LOGIt(value,1);
		} catch (e) {
			//similarMSNPop( "LOGIt��¼��־ʧ��!");
		}
	}
}
// ���õ�¼����
CCcommonTool.prototype.setStaffID = function(value) {
	this.DebugLog("javascript  ����CCcommonTool.prototype.setStaffID ��ʼ"); 
	parPhone.StaffID = value;
	this.DebugLog("javascript  ����CCcommonTool.prototype.setStaffID ����"); 
}
CCcommonTool.prototype.getStaffID = function() {
	this.DebugLog("javascript  ����CCcommonTool.prototype.getStaffID ��ʼ"); 
	var ret = parPhone.StaffID;
	this.DebugLog("javascript  ����CCcommonTool.prototype.getStaffID ����,staffID:"+ret); 
	return ret;
}
// ���ù���ģʽ,0:��ȷ�� 1:��ͨ���� 2:Ԥ��ʽ���
CCcommonTool.prototype.setWrkType = function(value) {
	this.DebugLog("javascript  ����CCcommonTool.prototype.setWrkType ��ʼ"); 
	parPhone.WrkType = value;
	this.DebugLog("javascript  ����CCcommonTool.prototype.setWrkType ����"); 
}
CCcommonTool.prototype.getWrkType = function() {
	this.DebugLog("javascript  ����CCcommonTool.prototype.getWrkType ��ʼ"); 
	var ret = parPhone.WrkType;
	this.DebugLog("javascript  ����CCcommonTool.prototype.getWrkType ����,WrkType:"+ret);
	return ret;
}
// �����Ƿ���뻰��
CCcommonTool.prototype.setBActive = function(value) {
	this.DebugLog("javascript  ����CCcommonTool.prototype.setBActive ��ʼ"); 
	parPhone.BActive = value;
	this.DebugLog("javascript  ����CCcommonTool.prototype.setBActive ����"); 
}
CCcommonTool.prototype.getBActive = function() {
	this.DebugLog("javascript  ����CCcommonTool.prototype.getBActive ��ʼ"); 
	var ret = parPhone.BActive;
	this.DebugLog("javascript  ����CCcommonTool.prototype.getBActive ����,BActive:"+ret); 
	return ret;
}
CCcommonTool.prototype.setIsSignIn = function(value) {
	this.isSignIn = value;
}
CCcommonTool.prototype.getIsSignIn = function() {
	return this.isSignIn;
}
// �����Ƿ�ע��ɹ�
CCcommonTool.prototype.setIsRegcti = function(value) {
	this.DebugLog("javascript  ����CCcommonTool.prototype.setIsRegcti ��ʼ value��"+value); 
	this.isRegcti = value;
	this.DebugLog("javascript  ����CCcommonTool.prototype.setIsRegcti ����"); 
}
CCcommonTool.prototype.getIsRegcti = function() {
	this.DebugLog("javascript  ����CCcommonTool.prototype.getIsRegcti ��ʼ"); 
	var ret = this.isRegcti;
	this.DebugLog("javascript  ����CCcommonTool.prototype.getIsRegcti ����,isRegcti:"+ret); 
	return ret;
}
CCcommonTool.prototype.setState = function(value) {
	this.state = value;
}
CCcommonTool.prototype.getState = function() {
	return this.state;
}
// �����Ƿ���ʾ������
CCcommonTool.prototype.setShowBar = function(value) {
	this.DebugLog("javascript  ����CCcommonTool.prototype.setShowBar ��ʼ value��"+value); 
	this.showBar = value;
	this.DebugLog("javascript  ����CCcommonTool.prototype.setShowBar ����"); 
}
CCcommonTool.prototype.getShowBar = function() {
	this.DebugLog("javascript  ����CCcommonTool.prototype.getShowBar ��ʼ"); 
	var ret = this.showBar;
	this.DebugLog("javascript  ����CCcommonTool.prototype.getShowBar ����,showBar:"+ret); 
	return ret;
}
// ���ò�����
CCcommonTool.prototype.setOp_code = function(value) {
	this.DebugLog("javascript  ����CCcommonTool.prototype.setOp_code ��ʼ value��"+value); 
	this.op_code = value;
	this.DebugLog("javascript  ����CCcommonTool.prototype.setOp_code ����"); 
}
CCcommonTool.prototype.getOp_code = function() {
	this.DebugLog("javascript  ����CCcommonTool.prototype.getOp_code ��ʼ"); 
	var ret = this.op_code;
	this.DebugLog("javascript  ����CCcommonTool.prototype.getOp_code ����,op_code:"+ret); 
	return ret;
}
// ����view��
CCcommonTool.prototype.setView_code = function(value) {
	this.DebugLog("javascript  ����CCcommonTool.prototype.setView_code ��ʼ value��"+value); 
	this.view_code = value;
	this.DebugLog("javascript  ����CCcommonTool.prototype.setView_code ����"); 
}
CCcommonTool.prototype.getView_code = function() {
	this.DebugLog("javascript  ����CCcommonTool.prototype.getView_code ��ʼ"); 
	var ret = this.view_code;
	this.DebugLog("javascript  ����CCcommonTool.prototype.getView_code ����,view_code:"+ret); 
	return ret;
}
//�������º�����Ϣ
CCcommonTool.prototype.setCallerNo = function(value) {
	this.callerNo = value;
}
CCcommonTool.prototype.getCallerNo = function() {
	return this.callerNo;
}
//�������º�����Ϣ
CCcommonTool.prototype.setCalledNo = function(value) {
	this.calledNo = value;
}
CCcommonTool.prototype.getCalledNo = function() {
	return this.calledNo;
}
//�������º�����Ϣ
CCcommonTool.prototype.setLastCallInfo = function(value) {
	this.lastCallInfo = value;
}
CCcommonTool.prototype.getLastCallInfo = function() {
	return this.lastCallInfo;
}
//�����Ƿ�ͨ��������֤
CCcommonTool.prototype.setVerified = function(value) {
	this.verified = value;
}
CCcommonTool.prototype.getVerified = function() {
	return this.verified;
}
//�绰UCID
CCcommonTool.prototype.getUcid = function() {
	this.DebugLog("javascript  ����CCcommonTool.prototype.getUcid ��ʼ"); 
	var ret = parPhone.Ucid;
	this.DebugLog("javascript  ����CCcommonTool.prototype.getUcid ����,Ucid:"+ret); 
	return ret;
}
//���к���
CCcommonTool.prototype.getCallingNumber = function() {
	this.DebugLog("javascript  ����CCcommonTool.prototype.getCallingNumber ��ʼ"); 
	var ret = parPhone.CallingNumber;
	this.DebugLog("javascript  ����CCcommonTool.prototype.getCallingNumber ����,CallingNumber:"+ret); 
	return ret;
}
//���к���
CCcommonTool.prototype.getCalledNumber = function() {
	this.DebugLog("javascript  ����CCcommonTool.prototype.getCalledNumber ��ʼ"); 
	var ret = parPhone.CalledNumber;
	this.DebugLog("javascript  ����CCcommonTool.prototype.getCalledNumber ����,CalledNumber:"+ret); 
	return ret;
}
//ԭʼ����
CCcommonTool.prototype.getOrgCalledNumber = function() {
	this.DebugLog("javascript  ����CCcommonTool.prototype.getOrgCalledNumber ��ʼ"); 
	var ret = parPhone.OrgCalledNumber;
	this.DebugLog("javascript  ����CCcommonTool.prototype.getOrgCalledNumber ����,OrgCalledNumber:"+ret); 
	return ret;
}
//ע��
CCcommonTool.prototype.Regcti = function() {
	this.DebugLog("javascript  ����CCcommonTool.prototype.Regcti ��ʼ"); 
	var ret = parPhone.Regcti();
	this.DebugLog("javascript  ����CCcommonTool.prototype.Regcti ����,ret:"+ret); 
	return ret;
}
//ע��
CCcommonTool.prototype.Unregcti = function() {
	this.DebugLog("javascript  ����CCcommonTool.prototype.Unregcti ��ʼ"); 
	var ret = parPhone.Unregcti();
	this.DebugLog("javascript  ����CCcommonTool.prototype.Unregcti ����,ret:"+ret); 
	return ret;
}
//ǿ��ע��
CCcommonTool.prototype.doUnregCTI = function(serviceNo) {
	this.DebugLog("javascript  ����CCcommonTool.prototype.doUnregCTI ��ʼ"); 
	var ret = parPhone.doUnregCTI(serviceNo);
	this.DebugLog("javascript  ����CCcommonTool.prototype.doUnregCTI ����,ret:"+ret); 
	return ret;
}
//ǩ��
CCcommonTool.prototype.Login = function() {
	this.DebugLog("javascript  ����CCcommonTool.prototype.Login ��ʼ"); 
	var ret = parPhone.Login();
	this.DebugLog("javascript  ����CCcommonTool.prototype.Login ����,ret:"+ret); 
	return ret;
}
//ǩ��
CCcommonTool.prototype.Logout = function() {
	this.DebugLog("javascript  ����CCcommonTool.prototype.Logout ��ʼ"); 
	var ret = parPhone.Logout();
	this.DebugLog("javascript  ����CCcommonTool.prototype.Logout ����,ret:"+ret); 
	return ret;
}
//���б���
CCcommonTool.prototype.Hold = function() {
	this.DebugLog("javascript  ����CCcommonTool.prototype.Hold ��ʼ"); 
	var ret = parPhone.Hold();
	this.DebugLog("javascript  ����CCcommonTool.prototype.Hold ����,ret:"+ret); 
	return ret;
}
//�����ؽ�
CCcommonTool.prototype.Retrieve = function() {
	this.DebugLog("javascript  ����CCcommonTool.prototype.Retrieve ��ʼ"); 
	var ret = parPhone.Retrieve();
	this.DebugLog("javascript  ����CCcommonTool.prototype.Retrieve ����,ret:"+ret); 
	return ret;
}
//�Ҷ�
CCcommonTool.prototype.ClearConnection = function(ATargetStaffID) {
	this.DebugLog("javascript  ����CCcommonTool.prototype.ClearConnection ��ʼ"); 
	this.isConsultConference = false;
	var ret = parPhone.ClearConnection();
	this.DebugLog("javascript  ����CCcommonTool.prototype.ClearConnection ����,ret:"+ret); 
	return ret;
}
//ʾæ
CCcommonTool.prototype.Pausee = function() {
	this.DebugLog("javascript  ����CCcommonTool.prototype.Pausee ��ʼ"); 
	var ret = parPhone.Pausee();
	this.DebugLog("javascript  ����CCcommonTool.prototype.Pausee ����,ret:"+ret); 
	return ret;
}
//ʾ��
CCcommonTool.prototype.Ready = function() {
	this.DebugLog("javascript  ����CCcommonTool.prototype.Ready ��ʼ"); 
	var ret = parPhone.Ready();
	this.DebugLog("javascript  ����CCcommonTool.prototype.Ready ����,ret:"+ret); 
	return ret;
}
//����
CCcommonTool.prototype.Make = function(ANumber,AStaffID,AInfo) {
	this.DebugLog("javascript  ����CCcommonTool.prototype.Make ��ʼ"); 
	clearAllTimer_0();
	var ret = parPhone.Make(ANumber,AStaffID,AInfo);
	this.DebugLog("javascript  ����CCcommonTool.prototype.Make ����,ret:"+ret); 
	return ret;
}
//���ӳ��ֺŵĺ���
CCcommonTool.prototype.directCall = function(ANumber) {
	this.DebugLog("javascript  ����CCcommonTool.prototype.directCall ��ʼ"); 
	if(this.getState()!=0&&this.getState()!=2){
		//similarMSNPop("��ǰ״̬���������!");
		//return false;
	}
	clearAllTimer_0();
	var ret = parPhone.Make(this.outCallPre+ANumber,'','');
	this.DebugLog("javascript  ����CCcommonTool.prototype.directCall ����,ret:"+ret); 
	return ret;
}
//����
CCcommonTool.prototype.Lock = function(ASecond) {
	this.DebugLog("javascript  ����CCcommonTool.prototype.Lock ��ʼ"); 
	var ret = parPhone.Lock(ASecond);
	this.DebugLog("javascript  ����CCcommonTool.prototype.Lock ����,ret:"+ret); 
	return ret;
}
//�������
CCcommonTool.prototype.ReleaseLock = function(ATargetStaffID) {
	this.DebugLog("javascript  ����CCcommonTool.prototype.ReleaseLock ��ʼ"); 
	var ret = parPhone.ReleaseLock();
	this.DebugLog("javascript  ����CCcommonTool.prototype.ReleaseLock ����,ret:"+ret); 
	return ret;
}
//��������̬
CCcommonTool.prototype.WrkLock = function(ASecond) {
	this.DebugLog("javascript  ����CCcommonTool.prototype.WrkLock ��ʼ"); 
	var ret = parPhone.WrkLock(ASecond);
	this.DebugLog("javascript  ����CCcommonTool.prototype.WrkLock ����,ret:"+ret); 
	return ret;
}
//��������̬
CCcommonTool.prototype.WrkRelease = function(ATargetStaffID) {
	this.DebugLog("javascript  ����CCcommonTool.prototype.WrkRelease ��ʼ"); 
	var ret = parPhone.WrkRelease();
	this.DebugLog("javascript  ����CCcommonTool.prototype.WrkRelease ����,ret:"+ret); 
	return ret;
}
//����ͨ��
CCcommonTool.prototype.Conference = function(AStaffID) {
	this.DebugLog("javascript  ����CCcommonTool.prototype.Conference ��ʼ"); 
	var ret = parPhone.Conference(AStaffID);
	this.DebugLog("javascript  ����CCcommonTool.prototype.Conference ����,ret:"+ret); 
	return ret;
}
//����ת��
CCcommonTool.prototype.TransferToIVR = function(AAction,AInfo,AFlow,AMessage,ACause) {
	this.DebugLog("javascript  ����CCcommonTool.prototype.TransferToIVR ��ʼ"); 
	var ret = parPhone.TransferToIVR(AAction,AInfo,AFlow,AMessage,ACause);
	this.DebugLog("javascript  ����CCcommonTool.prototype.TransferToIVR ����,ret:"+ret); 
	return ret;
}
//������֤
CCcommonTool.prototype.ConferenceToIVR = function(AAction,AInfo) {
	this.DebugLog("javascript  ����CCcommonTool.prototype.ConferenceToIVR ��ʼ"); 
	this.DebugLog(AAction+":"+AInfo); 
	var ret = parPhone.ConferenceToIVR(AAction,AInfo);
	this.DebugLog("javascript  ����CCcommonTool.prototype.ConferenceToIVR ����,ret:"+ret); 
	return ret;
}
//��������ͨ��(����ȷ��)
CCcommonTool.prototype.ConsultConference = function(ANumber,AStaffID,AInfo) {
	this.DebugLog("javascript  ����CCcommonTool.prototype.ConsultConference ��ʼ"); 
	this.DebugLog(ANumber+":"+AStaffID+":"+AInfo); 
	var ret = parPhone.ConsultConference(ANumber,AStaffID,AInfo);
	if(ret){
		this.isConsultConference = true;//����ȷ�ϱ�־
	}
	this.DebugLog("javascript  ����CCcommonTool.prototype.ConsultConference ����,ret:"+ret); 
	return ret;
}
//��ʱ��Ϣ
CCcommonTool.prototype.ShowSmsFrm = function() {
	this.DebugLog("javascript  ����CCcommonTool.prototype.ShowSmsFrm ��ʼ"); 
	var ret = parPhone.ShowSmsFrm();
	this.DebugLog("javascript  ����CCcommonTool.prototype.ShowSmsFrm ����,ret:"+ret); 
	return ret;
}
var cCcommonTool = new CCcommonTool();
cCcommonTool.LOGInit();