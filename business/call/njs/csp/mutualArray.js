/**
 * 
 * �����а�ť����
 * 
 */
function btn_able() {
	cCcommonTool.DebugLog("javascript ����btn_able��ʼ");
	for (var i = 0; i < all_call_code.length; i++) {
		var codeEle = document.getElementById(all_call_code[i]);
		codeEle.className="show"; 
		try{
			codeEle.firstChild.className="show"; 
		}catch(e){

		}
		codeEle.onmouseover=function()
		{
			try{
					this.firstChild.className="img_bord"; 
		    }catch(e){
		    	
		    }
		}
		
		codeEle.onmouseout=function()
		{
		    try{
					this.firstChild.className="show"; 
		    }catch(e){
		    	
		    }
		}
		//cCcommonTool.DebugLog("btn_able:"+all_call_code[i]);
		
	}
	cCcommonTool.DebugLog("javascript ����btn_able����");
}

/**
 * 
 * ���ݴ������齫ָ����ť�û�
 */
function btn_Gray(arr_opcode) {
	cCcommonTool.DebugLog("javascript ����btn_Gray��ʼ");
	// similarMSNPop("begin call btn_Gray...");
	var authority = getAuthority();
	/*--- modify by liujied -----*/
	var allButtonGrey = arr_opcode.concat(authority);
	/*-------------------- -----*/
	// var allButtonGrey=arr_opcode.concat(authority);
	for (var i = 0; i < allButtonGrey.length; i++) {
		var hiddenFlag = false;
		for(var m=0; m < hidden_code.length; m++){
			if(hidden_code[m]==allButtonGrey[i]){
				 hiddenFlag =true;
			}
		}
		
		var j = document.getElementById(allButtonGrey[i]);
		//cCcommonTool.DebugLog("btn_Gray:"+allButtonGrey[i]+":"+hiddenFlag);
		if(hiddenFlag){
			j.className="grey_hidden";
			
		}else{
			j.className="grey";
	  }
		 
		j.onclick=function()
		{
		  return;
		}
	}

	// similarMSNPop("end call btn_Gray...");
	cCcommonTool.DebugLog("javascript ����btn_Gray����");
}

function getAuthority() {
	//cCcommonTool.DebugLog("javascript ����getAuthority��ʼ");
	var retValue = new Array();
	//cCcommonTool.DebugLog("javascript ����getAuthority����");
	return retValue;
}

/*******************************************************************************
 * @Author liujied
 * @Date 20090807
 * @Param opCode
 *            stands for the function block,you can only transfer single opCode
 *            string to this function.
 * @Return none Ϊ������ť���з���������,���������д���ˣ���������Ӧ��ť��Ч��
 ******************************************************************************/
function btn_enable_singleButton(opCode) {
	var j = document.getElementById(opCode);

	try {
		j.className = getDisplayCssName(opCode);
		// alert(j.firstChild);
	} catch (e) {
		// alert("Ϊ������ť���з���������");
	}
}

/*******************************************************************************
 * @Author added by liujied
 * @Date: 20090804
 * @Param opCode
 *            stands for the function block,you can only transfer single opCode
 *            string to this function.
 * @Return none Ϊ������ť���з��ûҲ���
 ******************************************************************************/

function btn_disable_singleButton(opCode) {

	var j = document.getElementById(opCode);

	j.className = getHideCssName(opCode);
	j.onclick = function() {
		return;
	}
	j.onmouseover = function() {
		return false;
	}
	j.onmouseout = function() {
		return false;
	}
}

function buttonType(opCode){
	if(cCcommonTool.getView_code()==opCode){
		return;
	}
	iniOnclick();
	btn_able(); 
	btn_Gray(eval('arr_'+opCode)); 
	cCcommonTool.setView_code(opCode);
}

//������ʾ��Ϣ
function ChangeContactingMsg(remark){
	cCcommonTool.DebugLog("javascript ChangeContactingMsg begin remark:"+remark);
	if(remark==0){
		document.getElementById('contactingMsg').innerHTML="<font color='#008000'>��ǰ״̬������</font>";	
    }
	if(remark==1){
		document.getElementById('contactingMsg').innerHTML="<font color='#FF0000'>����ͨ������:"+cCcommonTool.getCallingNumber()+" ����:"+cCcommonTool.getCalledNumber()+"  </font>";
    }
 	if(remark==2){
    	document.getElementById('contactingMsg').innerHTML="<font color='#FF0000'>��ǰ״̬��ʾæ</font>";	
	}
	if(remark==3){
    	document.getElementById('contactingMsg').innerHTML="<font color='#FF0000'>��ǰ״̬����������</font>";	
	}
	if(remark==4){
    	document.getElementById('contactingMsg').innerHTML="<font color='#008000'>��ǰ״̬��ͨ������</font>";	
	}
	if(remark==5){
		document.getElementById('contactingMsg').innerHTML="<font color='#008000'>����תIVR </font>";	
	}
	if(remark==6){
		document.getElementById('contactingMsg').innerHTML="<font color='#008000'>�ȴ�Ӧ��</font>";		
	}
	if(remark==7){
		document.getElementById('contactingMsg').innerHTML="<font color='#008000'>�ȴ���������:"+cCcommonTool.getCallingNumber()+" ����:"+(cCcommonTool.getCalledNumber()==''?cCcommonTool.getCalledNo():cCcommonTool.getCalledNumber())+" </font>";	
	}
	if(remark==9){
		document.getElementById('contactingMsg').innerHTML="<font color='#FF0000'>��ǰ״̬����������</font>";			
	}
	if(remark==10){
		document.getElementById('contactingMsg').innerHTML="<font color='#FF0000'>�ȴ��û�����ȷ��</font>";			
	}
	if(remark==11){
		document.getElementById('contactingMsg').innerHTML="<font color='#FF0000'>�ȴ�������֤</font>";			
	}
	if(remark==12){
		document.getElementById('contactingMsg').innerHTML="<font color='#FF0000'>����¼��</font>";			
	}
	cCcommonTool.DebugLog("javascript ChangeContactingMsg end ");
}
