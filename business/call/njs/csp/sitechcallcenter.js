/*******************************************************************************
 * �ļ����� sitechcallcenter.js �޸��ˣ� ���� �޸�ʱ�䣺 2010-02-22 �޸����ݣ� ����ƽ̨�޸�
 ******************************************************************************/
/**
 * ��ϯ״̬��
 * 0������ 
 * 1��ͨ�� 
 * 2��æ״̬ 
 * 3��CTIռ�� 
 * 4��ͨ������ 
 * 5������תIVR 
 * 6���ȴ�Ӧ�� 
 * 7���ȴ���������  
 * 9������̬
 * 10������̬
 */
var CurState = 0;
// ��ʱ������¼
var delyOpcode = '';
var user_hung = 1;
var outFlag = 0;//���б�� 0���˹����� 2����� 3���ڲ�����
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
var specialCode = '';//Play : ����  Verified ��������֤ Confirmed ������ȷ��
var callIsUpdateCall = true;//�Ƿ����ͨ���ɹ�״̬
var isPhoneCalling = false;
var intervalScanCom = null;//����timer
var ocxLock = false;
var needLoginDelay = false;
var succ_flag_0 = false;
var is_showDialog_ = false;//ͨ���ɹ�����ʾ���Ƿ�����ʾ
var is_showUserTab = false;//һͨ�绰���Ƿ��Զ��򿪹��û�tab
/**
 * 
 * ��ϯǩ��
 */
function LoginPhoneInit() {
	cCcommonTool.DebugLog("javascript Login ǩ�뿪ʼ");
	buttonType("K006");
	cCcommonTool.setStaffID(document.getElementById("workNo").value);
	//cCcommonTool.setStaffID('aagh03');
	cCcommonTool.setWrkType(1);
	cCcommonTool.setBActive(true);
	intervalScanCom = setInterval("scanCom()",500*1000);
	//ע��ӿ�
	if(ocxLock){
		return;	
	}
	ocxLock =true;
	var ret = cCcommonTool.Regcti();
	if(!ret){
		ocxLock =false;
		similarMSNPop("��ʼ��ע�Ự��ӿ�ʧ�ܣ�");
		cCcommonTool.ErrorLog("��ʼ��ע�Ự��ӿ�cCcommonTool.Regctiʧ�� ret��" + ret);
	}
	cCcommonTool.DebugLog("javascript Login ǩ�����ret��");
}

/**
 * * * ����˳�����IE�رհ�ť
 */

function signOutFromIE() {
	try {
		cCcommonTool.DebugLog("javascript  ��ϯǩ����ʼFromIE");
		if(cCcommonTool.getIsSignIn()){
			var ret = cCcommonTool.Logout();
			cCcommonTool.DebugLog("javascript  ��ϯǩ�� Logout ret" + ret);
			//ǩ���ɹ����ݲ��룬ɾ����ϯ״̬
			if (ret == true)
				singnInUpdate();
		}
		var ret1 = cCcommonTool.Unregcti();	
		chgStatus(-1,'ǩ��');
		cCcommonTool.DebugLog("javascript  ��ϯǩ������ Unregcti ret1" + ret1);
	}catch (e) {
			//similarMSNPop( "LOGIt��¼��־ʧ��!");
	}
}

/**
 * 
 * Ϊ��ϯ��ť����¼� 
 */
 
function iniOnclick1() {
	//cCcommonTool.DebugLog("javascript iniOnclick ��ϯ��ʼ����ʼ");
	/* ��ťǩ�� */
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
			cCcommonTool.DebugLog("javascript ��ϯǩ�뿪ʼ");
			if(!cCcommonTool.getIsRegcti()){
				if(ocxLock){
					return;	
				}
				ocxLock = true;
				var ret = cCcommonTool.Regcti();
				cCcommonTool.DebugLog("javascript  ��ϯǩ�� Regcti ret��" + ret);
				if(!ret){
					ocxLock =false;
					similarMSNPop("��ʼ��ע�Ự��ӿ�ʧ�ܣ�");
					cCcommonTool.ErrorLog("��ʼ��ע�Ự��ӿ�cCcommonTool.Regctiʧ�� ret��" + ret);
					return;
	    		}
	    	needLoginDelay = true;
	    	return;
			}
			
			var ret1 = cCcommonTool.Login();
			cCcommonTool.DebugLog("javascript  ��ϯǩ����� ret1��" + ret1);
			*/
		}
	}
	v_bn_sign = null;

	/* ǩ�� */
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
			cCcommonTool.DebugLog("javascript  ��ϯǩ����ʼ");
			if (cCcommonTool.getState() == 4 || cCcommonTool.getState() == 1) {
				similarMSNPop("���µ绰���룬�޷�ǩ��!");
			}
			var ret = '';
			if(rdShowConfirmDialog("�Ƿ�ȷ��ǩ����")==1){
				doSignOut();
			}
			//showDialog('�Ƿ�ȷ��ǩ����',3,'retT=doSignOut()')
			cCcommonTool.DebugLog("javascript  ��ϯǩ������");
			*/
		}
	}
	v_bn_sign_out = null;

	/* ���� */
	var v_bn_callOutEx = document.getElementById("K025");
	if (v_bn_callOutEx != null) {
		v_bn_callOutEx.onclick = function() {
			//cCcommonTool.DebugLog("javascript  ��ϯ������ʼ");
			showCallOutWin('');
			//window.open("../../npage/callbosspage/index.html");
			//cCcommonTool.DebugLog("javascript  ��ϯ��������");
		}
	}
	v_bn_callOutEx = null;

	/* ʾæ */
	var v_bn_SayBusy = document.getElementById("K004");
	if (v_bn_SayBusy != null) {
		v_bn_SayBusy.onclick = function() {
			doSayBusy();
		}
	}
	v_bn_SayBusy = null;

	/* ʾ�� */
	var v_bn_SayFree = document.getElementById("K003");
	if (v_bn_SayFree != null) {
		v_bn_SayFree.onclick = function() {
			doSayFree();
		}
	}
	v_bn_SayFree = null;

	/* �һ��ͷ� */
	var v_bn_notAutoAnswer = document.getElementById('K013');
	if (v_bn_notAutoAnswer != null) {
		v_bn_notAutoAnswer.onclick = function() {
			cCcommonTool.DebugLog("javascript ��ʼ�һ��ͷ�");
			var ret = cCcommonTool.ClearConnection('');
			if(!ret){
				similarMSNPop("���ùһ��ͷŽӿ�ʧ�ܣ�");
				cCcommonTool.ErrorLog("�һ��ͷ� cCcommonTool.Logout ret��" + ret);
				return;
	    	}
			cCcommonTool.DebugLog("javascript �����һ��ͷ�");
		}
	}
	v_bn_notAutoAnswer = null;
	
	/*ͨ������*/
	var v_bn_holdEx = document.getElementById('K026');
	if(v_bn_holdEx != null){
		v_bn_holdEx.onclick = function(){
			cCcommonTool.DebugLog("javascript ͨ�����ֿ�ʼ");
			var ret = cCcommonTool.Hold();
			if(!ret){
				similarMSNPop("����ͨ�����ֽӿ�ʧ�ܣ�");
				cCcommonTool.ErrorLog("ͨ������ cCcommonTool.Logout ret��" + ret);
				return;
	    	}
			cCcommonTool.DebugLog("javascript ͨ�����ֽ���");
		}
	}
	v_bn_holdEx = null;

	/*ȡ����*/
	var v_bn_getHoldEx = document.getElementById('K027');
	if(v_bn_getHoldEx != null){
		v_bn_getHoldEx.onclick = function(){
			cCcommonTool.DebugLog("javascript ȡ���ֿ�ʼ");
			var ret = cCcommonTool.Retrieve();
			if(!ret){
				similarMSNPop("����ȡ���ֽӿ�ʧ�ܣ�");
				cCcommonTool.ErrorLog("ȡ���� cCcommonTool.Retrieve ret��" + ret);
				return;
	    	}
			cCcommonTool.DebugLog("javascript ȡ���ֽ���");
		}
	}
	v_bn_getHoldEx = null;

	/* �ڲ����� */
	var v_bn_transOut = document.getElementById('K030');
	if (v_bn_transOut != null) {
		v_bn_transOut.onclick = function() {
			cCcommonTool.DebugLog("javascript �ڲ����п�ʼ");
			showCallInnerWin();
			cCcommonTool.DebugLog("javascript �ڲ����н���");
		}
	}
	v_bn_transOut = null;
	
	/*
	*������֤
	*by tancf 20081218
	*/
	var v_bn_password = document.getElementById("K019" );
	if(v_bn_password != null){
		v_bn_password.onclick = function(){
		 cCcommonTool.DebugLog("javascript ������֤��ʼ");	
		 if(rdShowConfirmDialog("�Ƿ�ȷ��������֤��")==1){
		 		checkPasswd('','','');
		 }
		 cCcommonTool.DebugLog("javascript ������֤����");
		}
	}
	v_bn_password = null;

	/**
	 * ��ʾ�û���ʷ����ԭ����ϸ
	 */
	var v_bn_callCauseList = document.getElementById("K055");
	if (v_bn_callCauseList != null) {
		v_bn_callCauseList.onclick = function() {
			cCcommonTool.DebugLog("javascript �û���Ϣ��ʼ");
			var caller_phone = document.getElementById("acceptPhoneNo").value;
			showUserInfo(caller_phone);	
			cCcommonTool.DebugLog("javascript �û���Ϣ����");
			caller_phone = null;
		}
	}
	v_bn_callCauseList = null;
	

	function showUserInfo(caller_phone) {
		cCcommonTool.DebugLog("javascript չʾ�û���Ϣ��ʼ");
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
		cCcommonTool.DebugLog("javascript չʾ�û���Ϣ����");
		height = null;
		width = null;
		top = null;
		left = null;
		winParam = null;
	}

	/**
	 * ���Թ��� tancf 20081105
	 */
	var v_bn_Test = document.getElementById('K101');
	if (v_bn_Test != null) {
		v_bn_Test.onclick = function() {
			cCcommonTool.DebugLog("javascript ���Թ���");
			parPhone.closeLogTxt();
			// alert("vdn"+parPhone.AgentInfoEx_VdnID);
			// window.open('../../npage/callbosspage/evaljs.html');
			cCcommonTool.DebugLog("javascript ���Թ���");
		}
	}
	v_bn_Test = null;
	
	
	var v_bn_sendMsg = document.getElementById('K084');
	if(v_bn_sendMsg != null){
		v_bn_sendMsg.onclick = function(){
			cCcommonTool.DebugLog("javascript ���ü�ʱ��Ϣ��ʼ");	
			cCcommonTool.ShowSmsFrm();
			cCcommonTool.DebugLog("javascript ���ü�ʱ��Ϣ����");	
		}
	}
	v_bn_sendMsg = null;
	
	var v_bn_endLock = document.getElementById('K103');
	if(v_bn_endLock != null){
		v_bn_endLock.onclick = function(){
			cCcommonTool.DebugLog("javascript ���ý���������ʼ");	
			cCcommonTool.ReleaseLock();
			cCcommonTool.DebugLog("javascript ���ý�����������");	
		}
	}
	v_bn_endLock = null;
	
	var v_bn_endRelax = document.getElementById('K104');
	if(v_bn_endRelax != null){
		v_bn_endRelax.onclick = function(){
			cCcommonTool.DebugLog("javascript ���ý�������ʼ");	 
			var callinfoarr = cCcommonTool.getLastCallInfo();
			if(callinfoarr[3]==true){
					cCcommonTool.ReleaseLock();
			}
			cCcommonTool.WrkRelease();
			cCcommonTool.DebugLog("javascript ���ý����������");	
		}
	}
	v_bn_endRelax = null;

	cCcommonTool.DebugLog("javascript iniOnclick ��ϯ��ʼ������");
}

function showCallOutWin(phone_no){
	cCcommonTool.DebugLog("javascript ��ʾ����������ڿ�ʼ");	
	var height = 158;
	var width = 241;
	var top = screen.availHeight/2 - height/2;
	var left=screen.availWidth/2 - width/2;
	var winParam = "height=" + height + ",width=" + width + ",top=" + top + ",left= " + left + ",toolbar=no,menubar=no,scrollbars=no, resizable=yes,location=no, status=no";
	window.open("../../npage/callbosspage/k025/caller_phone.jsp?phone_no="+phone_no, "callOutWin", winParam);   
  	cCcommonTool.DebugLog("javascript ��ʾ����������ڽ���");	
}

function showCallInnerWin(){
	cCcommonTool.DebugLog("javascript  ��ʾ�ڲ����е������ڿ�ʼ");
	var height = 460;
	var width = screen.availWidth-400;
	var top = screen.availHeight/2 - height/2;
	var left = screen.availWidth/2 - width/2;
	var winParam = "height=" + height + ",width=" + width + ",top=" + top + ",left= " + left + ",toolbar=no,menubar=no,scrollbars=no, resizable=yes,location=no, status=yes";
	window.open("../../npage/callbosspage/callInner/callinnerMain.jsp", "callInnerWin", winParam);
  	cCcommonTool.DebugLog("javascript  ��ʾ�ڲ����е������ڽ���");
}

function checkPasswd(code,title,targetUrl){
	/*
	cCcommonTool.DebugLog("javascript  ��ʾ������֤��ʼ");
	var height = 120;
	var width = 260;
	var top = screen.availHeight/2 - height/2;
	var left = screen.availWidth/2 - width/2;
	var winParam = "height=" + height + ",width=" + width + ",top=" + top + ",left= " + left + ",toolbar=no,menubar=no,scrollbars=no, resizable=yes,location=no, status=yes";
	window.open("../../npage/callbosspage/K086/otherPhoneCheck.jsp", "checkPasswd", winParam);
    cCcommonTool.DebugLog("javascript  ��ʾ������֤����");*/
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
	cCcommonTool.DebugLog("javascript  ��ϯʾæ��ʼ CurState" + CurState);
	/*
	cCcommonTool.DebugLog("javascript  ��ϯʾæ��ʼ delyOpcode" + delyOpcode);
	if (CurState == 5 || CurState == 4) {
		showDialog("�Ƿ�ȷ���ύ��",3,function(){
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
		similarMSNPop("����ʾæ�ӿ�ʧ�ܣ�");
		cCcommonTool.ErrorLog("ʾæ cCcommonTool.Pausee ret��" + ret);
		return;
	}

	cCcommonTool.DebugLog("javascript  ��ϯʾæ����"+ret);
}
function doSayFree() {
	cCcommonTool.DebugLog("javascript  ��ϯʾ�п�ʼ CurState" + CurState);
	/*
	cCcommonTool.DebugLog("javascript  ��ϯʾ�п�ʼ delyOpcode" + delyOpcode);	
	if (CurState == 5 || CurState == 4) {
		showDialog("�Ƿ�ȷ���ύ��",3,function(){
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
		similarMSNPop("����ʾ�нӿ�ʧ�ܣ�");
		cCcommonTool.ErrorLog("ʾ�� cCcommonTool.Ready ret��" + ret);
		return;
	}
	cCcommonTool.DebugLog("javascript  ��ϯʾ�н���"+ret);
}
function doSignOut(){
	cCcommonTool.DebugLog("javascript  ��ϯǩ����ʼ CurState" + CurState);
	if (cCcommonTool.getState() == 4 || cCcommonTool.getState() == 1) {
		similarMSNPop("���µ绰���룬�޷�ǩ��!");
	} else {
		ret = cCcommonTool.Logout();
		if(!ret){
			similarMSNPop("����ǩ���ӿ�ʧ�ܣ�");
			cCcommonTool.ErrorLog("ǩ��cCcommonTool.Logout ret��" + ret);
			clearAllTimer_0();
			return;
	    }
	}		
}
