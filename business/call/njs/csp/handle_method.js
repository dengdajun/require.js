function doCallOnRespond(AEvent,AMessage,ACode,ATargetStaffID){
	cCcommonTool.DebugLog("javascript doCallOnRespond ��ʼ��");
	cCcommonTool.DebugLog("AEvent="+AEvent+";AMessage="+AMessage+";ACode="+ACode+";ATargetStaffID="+ATargetStaffID);
	if(AEvent=='Register'){
		ocxLock = false;
	}
	if(ACode==0){
		switch(AEvent){
			case 'Register':{
				cCcommonTool.setIsRegcti(true);
				if(needLoginDelay){
					var ret1 = cCcommonTool.Login();
					cCcommonTool.DebugLog("javascript  ��ϯǩ����� ret1��" + ret1);
					needLoginDelay =false;	
				}
			}
			break;
			case 'UnRegister':{
				cCcommonTool.setIsRegcti(false);
			}
			break;
			case 'Login':{				
				//ǩ��ɹ����ݲ��룬������ϯ״̬��Ϣ
				//similarMSNPop('ǩ��ɹ���');
				
			}
			break;
			case 'Logout':{
				//ǩ���ɹ����ݲ��룬������ϯ״̬��Ϣ
				//singnInUpdate();
			}
			break;
			case 'Pause':{
				//������ϯ״̬��Ϣ
				similarMSNPop('ʾæ�ɹ���');
			}
			break;
			case 'Ready':{
				//������ϯ״̬��Ϣ
				clearAllTimer_0();
				similarMSNPop('ʾ�гɹ���');
			}
			break;
			case 'Lock':{
				//similarMSNPop('���������������Եȣ�');
			}
			break;
			case 'Release':{
				user_hung = 0;
			}
			break;
			case 'WrkLock':{
				//������ϯ״̬��Ϣ
			}
			break;
			case 'WrkRelease':{
				//������ϯ״̬��Ϣ
			}
			break;
			case 'Make':{
				buttonType("K021");
				ChangeContactingMsg(6);
			}
			break;
			case 'ConferenceToIVR':{
				if(specialCode=='Verified'){
					//���뻰������״̬
					ChangeContactingMsg(11);
					buttonType("K105");
					chgStatus(10,'����̬');		
				}
			}
			break;
		}
	}
	else{
			
			cCcommonTool.ErrorLog("AEvent="+AEvent+";AMessage="+AMessage+";ACode="+ACode+";ATargetStaffID="+ATargetStaffID);
			if(AEvent=='ClearConnection'&&ACode=='202'){
				return;	
			}
			similarMSNPop("<font color=red>���÷���"+AEvent+"����!</font><br>" +
					"errCode:&nbsp;" +ACode+"<br>"+
					"message:&nbsp;"+AMessage);
	}
	cCcommonTool.DebugLog("javascript doCallOnRespond ����");
}
function doCallOnReport(AEvent,ACauseInfo,AMessage,ACallInfo){
	cCcommonTool.DebugLog("javascript doCallOnReport ��ʼ��");
	cCcommonTool.DebugLog("AEvent="+AEvent+";ACauseInfo="+ACauseInfo+";AMessage="+AMessage);
	var callInfoArr = new VBArray(ACallInfo).toArray();  
	cCcommonTool.setLastCallInfo(callInfoArr);
	var outPut = '';
	for(i=0;i<callInfoArr.length;i++){
		outPut+=i+":"+callInfoArr[i]+";";
	}
	cCcommonTool.DebugLog("outPut="+outPut);
	//��ǰ��ȡ����һ�ε�״̬
	var lastState = cCcommonTool.getState();
	
	//ȫ���¼���
	if(checkState(callInfoArr,'0')){
		//ǩ��̬,�ؼ�ʧȥ��ȷ�Ļ������
		if(cCcommonTool.getIsSignIn()){
			singnInUpdate();
			//if(intervalScanCom!=null){
			//	clearInterval(intervalScanCom);
			//}
		}
		chgStatus(-1,'ǩ��');
		cCcommonTool.setIsSignIn(false);
		buttonType("K006");
		if(cCcommonTool.getShowBar()){
			cCcommonTool.setShowBar(false);
			$('#callSearch').css('display','none');
			$('.r2 .frame-tool').animate({width:'220px'},'slow');
		}
		cCcommonTool.extendFlag = false;
		specialCode = '';
		if(lastState==1||lastState==6||lastState==4){
			clrCallTimer();
			sK013insert();
			succ_flag_0 = false;
			is_showDialog_ = false;
		}
		return;
	}else{
		if(!cCcommonTool.getIsSignIn()){
			singnInInsert();
			//if(intervalScanCom!=null){
			//	clearInterval(intervalScanCom);
			//}
			//intervalScanCom = setInterval("scanCom()",500000);
		}
		cCcommonTool.setIsSignIn(true);
		if(AEvent=='ConnectionClear'&&!(checkState(callInfoArr,'--------1'))){
			if(ACauseInfo==cCcommonTool.exCallId){
				cCcommonTool.extendFlag = false;
			}
			if(ACauseInfo!=cCcommonTool.exCallId&&ACauseInfo.indexOf('490')!=0){
				similarMSNPop('ͨ���ͷţ�');
			}
			if(ACauseInfo.indexOf('490')!=0){
				specialCode = '';
			}
	  }
	  if(checkState(callInfoArr,'-0')){
	  	specialCode = '';
	  }
	  if(AEvent=='IVREvent'){
			if(ACauseInfo=='Verified'){
				specialCode = '';
			}
			if(ACauseInfo=='Confirmed'){
				specialCode = '';
			}
		}
		if(checkState(callInfoArr,'-1--1')){
			//����ͨ������̬
			ChangeContactingMsg(4);
			buttonType("K026");
			chgStatus(4,'ͨ������');
			
		}else if(checkState(callInfoArr,'-0------01')){
			//���뻰������״̬
			ChangeContactingMsg(9);
			buttonType("K009");
			chgStatus(9,'����̬');
			
		}else if(specialCode=='Confirmed'){
			//���뻰������״̬
			ChangeContactingMsg(10);
			buttonType("K105");
			chgStatus(10,'����̬');		
		}else if(specialCode=='Verified'){
			//���뻰������״̬
			ChangeContactingMsg(11);
			buttonType("K105");
			chgStatus(10,'����̬');		
		}else if(specialCode=='Play'){
			//���뻰������״̬
			ChangeContactingMsg(12);
			buttonType("K105");
			chgStatus(10,'����̬');		
		}else if(checkState(callInfoArr,'-01')&&(AEvent=='AgentStateChange')){
			//����æ״̬
			ChangeContactingMsg(2);
			buttonType("K004");
			chgStatus(2,'ʾæ״̬');	
		}else if(checkState(callInfoArr,'-1')){
			if(AEvent=='AgentStateChange'||AEvent=='Retrieved'||AEvent=='Established'||AEvent=='ConnectionClear'||AEvent=='IVREvent'){
				if(callInfoArr[12]!=''&&callInfoArr[11]!=''){
					//����ͨ��״̬
					ChangeContactingMsg(1);
					buttonType("K021");
					chgStatus(1,'ͨ��״̬');
				}else{
					
				}
			}
			
		}else if(checkState(callInfoArr,'---1')){
			ChangeContactingMsg(3);
			//��������̬
			buttonType("K102");
			chgStatus(3,'CTI����');
			
		}else if(checkState(callInfoArr,'10000----0')){
			ChangeContactingMsg(0);
			buttonType("K005");
			
			chgStatus(0,'����̬');
			specialCode = '';
		}
	}
	if(AEvent=='AgentStateChange'){
		if(ACauseInfo=='NetError'){
			similarMSNPop('�������,����������ͨ�����');
		}
	}else if(AEvent=='NewCall'){
		//��·׼����������������
		
	}else if((AEvent=='Delivered'||AEvent=='Originated')){
		//�����¼�
		if(!(checkState(callInfoArr,'-------1'))&&!(checkState(callInfoArr,'--------1'))){
			cCcommonTool.setState(6);
			ChangeContactingMsg(6);
			//��ʼ����¼dcallcall
			if(callInfoArr[12]=='1009'){
				specialCode = 'Play';
			}
			if(lastUcid != callInfoArr[10]&&callInfoArr[10]!='00000000000000000000'&&specialCode==''){
				lastUcid = callInfoArr[10];
				var user_phone = '';
				if(callInfoArr[6]){
					document.getElementById('call_type').value = '7';
					user_phone = cCcommonTool.getCalledNumber();
				}else{
					document.getElementById('call_type').value = '0';
					user_phone = cCcommonTool.getCallingNumber();
				}
				getContactId(user_phone);
				specialCode = '';
				callIsUpdateCall = false;
				nextPhoneId = '';
				comering(callInfoArr);
				succ_flag_0 = false;
				is_showDialog_ = false;
				is_showUserTab = false;
				cCcommonTool.setVerified(false);				
				document.getElementById("acceptPhoneNo").value = user_phone;
				if(!isOpenPhoneTabByNum(user_phone)){
					is_showUserTab = true;
				}
				if(/^1\d{10}$/.test(user_phone)){
					inputcall(user_phone);
				}
				cCcommonTool.baseCallId = ACauseInfo;				  
				cCcommonTool.extendFlag = false;
			}
		}else if(cCcommonTool.baseCallId!=ACauseInfo){
				cCcommonTool.exCallId = ACauseInfo;	
				cCcommonTool.extendFlag = true;
		}
	}else if(AEvent=='Established'){
		//��ͨ�ֻ�
		if(!checkState(callInfoArr,'-1--1')&&!(checkState(callInfoArr,'-------1'))&&checkState(callInfoArr,'-1')){
			ChangeContactingMsg(1);
			if(!is_showDialog_){
				similarMSNPop('ͨ���ɹ���');
				is_showDialog_ = true;
			}
			chgStatus(1,'ͨ��״̬');
			//����dcall�ɹ���־
			//if(!(outFlag == 3&&callInfoArr[6])&&specialCode==''){
			//	beginTimeCall();
			//	oprateDcallcall();
			//}	
		}
		if(!callIsUpdateCall&&checkState(callInfoArr,'-1')){
				beginTimeCall();
				succ_flag_0 = true;
				setTimeout('oprateDcallcall()',800);
				callIsUpdateCall = true;
		}
	}else if(AEvent=='ConnectionClear'&&!(checkState(callInfoArr,'--------1'))){

	}else if(AEvent=='DeleteCall'&&!(checkState(callInfoArr,'-1'))&&!(checkState(callInfoArr,'--------1'))){
		//�ҶϷֻ�	
		if(lastState==1||lastState==6||lastState==4){
			//dcallcall���ݲ���
			if(!(outFlag == 3&&callInfoArr[6])&&specialCode==''){
				lastUcid = '';
				clrCallTimer();
				sK013insert();
				succ_flag_0 = false;
				is_showDialog_ = false;
				is_showUserTab = false;
				if(outFlag!=3){
					selectFailReason();
				}
			}
			
		}
		//��������̬
		if(lastState!=4&&!(checkState(callInfoArr,'--1'))){
			enterRelax();	
		}
		
	}else if(AEvent=='Held'){
		
	}else if(AEvent=='Retrieved'){
		
	}else if(AEvent=='IVREvent'){
		if(ACauseInfo=='Verified'){
			specialCode = '';
			if(AMessage==''||AMessage==null){
				cCcommonTool.setVerified(false);
				similarMSNPop('������֤ʧ�ܣ�');
			}else{				
				cCcommonTool.setVerified(true);
				similarMSNPop('������֤�ɹ���');
				doAtferCheck();
			}
		}
		if(ACauseInfo=='Confirmed'){
			specialCode = '';
			var aparams = AMessage.split('|');
			if(aparams.length==2){
				var button_accept = aparams[1];
				if(button_accept=='1'){
					cCcommonTool.setVerified(true);
					similarMSNPop('����ȷ�ϳɹ���');
					doAtferCheck();
				}else{					
					cCcommonTool.setVerified(false);				
					similarMSNPop('����ȷ��ʧ�ܣ�');
				}
			}
		}
	}
	//add liujcc
		$('#callSearch').css('display','block');
		$('.r2 .frame-tool').animate({width:'660px'},'slow');
	if(!cCcommonTool.getShowBar()){
		cCcommonTool.setShowBar(true);
		$('#callSearch').css('display','block');
		$('.r2 .frame-tool').animate({width:'660px'},'slow');
	}
	cCcommonTool.DebugLog("javascript doCallOnReport ����");
}
//�жϵ�ǰ����״̬��������ַ����Ƿ�ƥ��,�ַ���ÿһλ����״̬�����е�һ�1����true��0����false,-�������Ƚ�
function checkState(stateArr,stateStr){
	var res = true;
	for(i=0;i<stateStr.length;i++){
		var step = stateStr.charAt(i);
		if(step=='1'){
			if(stateArr[i]==false){
				return false;
			}
		}else if(step=='0'){
			if(stateArr[i]==true){
				return false;
			}
		}
	}
	return res;
}
function enterRelax(){
	var ret = cCcommonTool.WrkLock(30);
	
	if(ret){
		if(relaxTimer!=null){
			clearTimeout(relaxTimer);
		}
		relaxTimer = setTimeout('endRelax()',relaxTime*1000);
	}
}
function endRelax(){
	if(cCcommonTool.getState()==9){
		cCcommonTool.WrkRelease();
		if(isOpenPhoneTab()){
			if(cCcommonTool.lastCallInfo!=null&&cCcommonTool.lastCallInfo[2]==true){
				return;	
			}
			var ret = cCcommonTool.Pausee();
			if(ret){
				if(busyAlertTimer!=null){
					clearInterval(busyAlertTimer);
					busyAlertCount = 0;
			  }
				busyAlertTimer = setInterval(busyAlertInfo,busyAlertJG*1000);
				if(autoEndBusyTimer!=null){
					clearInterval(autoEndBusyTimer);
			  }
				autoEndBusyTimer = setTimeout('endBusy()',autoEndBusyTime*1000);
			}
		}
	}
	relaxTimer = null;
}
function isOpenPhoneTab(){
	var objIframe = g("tabtag").getElementsByTagName("li");
			for(var i=0;i<objIframe.length;i++){
 
				var divId = objIframe[i].getAttribute("id");
				if(/^1\d{10}$/.test(divId))
				{
						return true;
				}
			}
	return false;
}
function isOpenPhoneTabByNum(phoneNum){
	var objIframe = g("tabtag").getElementsByTagName("li");
			for(var i=0;i<objIframe.length;i++){
 
				var divId = objIframe[i].getAttribute("id");
				if(divId==phoneNum)
				{
						return true;
				}
			}
	return false;
}
function busyAlertInfo(){
	busyAlertCount++;
	var leftTime = autoEndBusyTime-busyAlertCount*busyAlertJG;
	if(leftTime>0){
		similarMSNPop('�����Զ��رջ���'+leftTime+'��,�뼰ʱ����ϴ���Ϣ���棡');
  }else{
			if(busyAlertTimer!=null){
				clearInterval(busyAlertTimer);
				busyAlertTimer = null;
			}
			busyAlertCount = 0;
	}
}
function endBusy(){		
		oldRemoveTab(document.getElementById('acceptPhoneNo').value);
		cCcommonTool.Ready();
		clearAllTimer_0();
		destSessionPhone();
}
function clearAllTimer_0(){
	if(busyAlertTimer!=null){
		clearInterval(busyAlertTimer);
		busyAlertTimer = null;
		busyAlertCount = 0;
	}
	if(autoEndBusyTimer!=null){
		clearInterval(autoEndBusyTimer);
		autoEndBusyTimer = null;
	}
	if(relaxTimer!=null){
		clearTimeout(relaxTimer);
		relaxTimer = null;
	}
	if(autoEndBusyTimer!=null){
		clearTimeout(autoEndBusyTimer);
		autoEndBusyTimer = null;
	}
}
function selectFailReason(){
	window.open("/npage/callbosspage/portal/callResult.jsp","_blank","toolbar=no, location=no, directories=no,status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=yes, top=300,left=350,width=300, height=200");
}