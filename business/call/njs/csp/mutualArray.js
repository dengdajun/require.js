/**
 * 
 * 将所有按钮置明
 * 
 */
function btn_able() {
	cCcommonTool.DebugLog("javascript 调用btn_able开始");
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
	cCcommonTool.DebugLog("javascript 调用btn_able结束");
}

/**
 * 
 * 根据传入数组将指定按钮置灰
 */
function btn_Gray(arr_opcode) {
	cCcommonTool.DebugLog("javascript 调用btn_Gray开始");
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
	cCcommonTool.DebugLog("javascript 调用btn_Gray结束");
}

function getAuthority() {
	//cCcommonTool.DebugLog("javascript 调用getAuthority开始");
	var retValue = new Array();
	//cCcommonTool.DebugLog("javascript 调用getAuthority结束");
	return retValue;
}

/*******************************************************************************
 * @Author liujied
 * @Date 20090807
 * @Param opCode
 *            stands for the function block,you can only transfer single opCode
 *            string to this function.
 * @Return none 为单个按钮进行放置明操作,这个方法被写死了，仅对来话应答按钮有效，
 ******************************************************************************/
function btn_enable_singleButton(opCode) {
	var j = document.getElementById(opCode);

	try {
		j.className = getDisplayCssName(opCode);
		// alert(j.firstChild);
	} catch (e) {
		// alert("为单个按钮进行放置明操作");
	}
}

/*******************************************************************************
 * @Author added by liujied
 * @Date: 20090804
 * @Param opCode
 *            stands for the function block,you can only transfer single opCode
 *            string to this function.
 * @Return none 为单个按钮进行放置灰操作
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

//控制显示信息
function ChangeContactingMsg(remark){
	cCcommonTool.DebugLog("javascript ChangeContactingMsg begin remark:"+remark);
	if(remark==0){
		document.getElementById('contactingMsg').innerHTML="<font color='#008000'>当前状态：空闲</font>";	
    }
	if(remark==1){
		document.getElementById('contactingMsg').innerHTML="<font color='#FF0000'>正在通话主叫:"+cCcommonTool.getCallingNumber()+" 被叫:"+cCcommonTool.getCalledNumber()+"  </font>";
    }
 	if(remark==2){
    	document.getElementById('contactingMsg').innerHTML="<font color='#FF0000'>当前状态：示忙</font>";	
	}
	if(remark==3){
    	document.getElementById('contactingMsg').innerHTML="<font color='#FF0000'>当前状态：话机锁定</font>";	
	}
	if(remark==4){
    	document.getElementById('contactingMsg').innerHTML="<font color='#008000'>当前状态：通话保持</font>";	
	}
	if(remark==5){
		document.getElementById('contactingMsg').innerHTML="<font color='#008000'>挂起转IVR </font>";	
	}
	if(remark==6){
		document.getElementById('contactingMsg').innerHTML="<font color='#008000'>等待应答</font>";		
	}
	if(remark==7){
		document.getElementById('contactingMsg').innerHTML="<font color='#008000'>等待播报工号:"+cCcommonTool.getCallingNumber()+" 被叫:"+(cCcommonTool.getCalledNumber()==''?cCcommonTool.getCalledNo():cCcommonTool.getCalledNumber())+" </font>";	
	}
	if(remark==9){
		document.getElementById('contactingMsg').innerHTML="<font color='#FF0000'>当前状态：话后整理</font>";			
	}
	if(remark==10){
		document.getElementById('contactingMsg').innerHTML="<font color='#FF0000'>等待用户二次确认</font>";			
	}
	if(remark==11){
		document.getElementById('contactingMsg').innerHTML="<font color='#FF0000'>等待密码验证</font>";			
	}
	if(remark==12){
		document.getElementById('contactingMsg').innerHTML="<font color='#FF0000'>播放录音</font>";			
	}
	cCcommonTool.DebugLog("javascript ChangeContactingMsg end ");
}
