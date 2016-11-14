var msn_popmenu2 = null;
var msn_count2 = 0;

function similarMSNPop_local2(msgContent){
    msn_count2++;
	var imgClose=msn_popmenu2.oPopup.document.createElement("img");
	imgClose.src="/nresources/default/images/icon_close_off.gif";
	imgClose.style.cursor="pointer";
	imgClose.onmouseover=function()
	{
		imgClose.src="/nresources/default/images/icon_close_on.gif";
	}
	imgClose.onmouseout=function()
	{
		imgClose.src="/nresources/default/images/icon_close_off.gif";
	}
	imgClose.onclick=function()
	{
		//hiddenList2(overDiv,120);
	}
	imgClose.setAttribute("id","msgImg");
	
	var titleDiv=msn_popmenu2.oPopup.document.createElement("div");
	titleDiv.setAttribute("id","msgTitle");
	
	var titleDivTxt=msn_popmenu2.oPopup.document.createTextNode("弹出框");
	
	var contentDiv=msn_popmenu2.oPopup.document.createElement("div");
	contentDiv.setAttribute("id","msgContent");
	contentDiv.innerHTML=msgContent;
	
	var overDiv = msn_popmenu2.oPopup.document.createElement("div");
	overDiv.setAttribute("id","msg");
	overDiv.style.display="none";
	overDiv.style.overflow="hidden";
	
	overDiv.onclick=function(){
		hiddenList2(overDiv,120);
	}
	
	titleDiv.appendChild(imgClose);
	titleDiv.appendChild(titleDivTxt);
	overDiv.appendChild(titleDiv);
	overDiv.appendChild(contentDiv);
	
	var bodyHtml=msn_popmenu2.oPopup.document.getElementsByTagName("body");
	bodyHtml[0].appendChild(overDiv);
	
	showList2(overDiv,120); 
	if(msn_popmenu2.oPopup.document.getElementById("overDiv")) return false;
	
	
	var hidett = setTimeout(function(){hiddenList2(overDiv,120)},5000);
	overDiv.setAttribute("hidett",hidett);
	
}

function showList2(objectId,mH)
{
	var h =0;
	var maxHeight = mH;
	var anim = function()
	{ 
		h += 5;
		if(h > maxHeight)
		{ 
			objectId.style.height = mH+"px";  
			if(tt){window.clearInterval(tt);}  
		} 
		else
		{ 	
			objectId.style.height = h + "px";
			objectId.style.display="block";

		}
	} 
	var tt = window.setInterval(anim,15);  
} 

function hiddenList2(objectId,mH)
{ 
	var h =mH; 
	var anim = function()
	{ 
		h -= 5;
		if(h <= 0)
		{ 
			objectId.style.display="none";
			if(tt){window.clearInterval(tt);
			if(objectId.getAttribute("hidett")!=null)
			{
				window.clearInterval(objectId.getAttribute("hidett"));
				}
			if(h>=-5){
			msn_count2--;
			if(msn_count2<0)
			   msn_count2 = 0;
			if(msn_count2==0){
				msn_popmenu2.stopthis();
				msn_popmenu2.hide();
			}
			}
			}
			objectId.parentNode.removeChild(objectId);
		} 
		else
		{ 
			objectId.style.height = h + "px";
		} 
	} 
	var tt = window.setInterval(anim,15); 
} 
	
function similarMSNPop(msgContent){
 
    if(msn_popmenu2 == null){
    	var MSG1 = new MSN_POP_CLASS(180, 120, "");
			msn_popmenu2 = MSG1;
			MSG1.show();
    }else{
    	msn_popmenu2.reshow();
    }
	similarMSNPop_local2(msgContent);	
}

function MSN_POP_CLASS(width, height, title) {
	this.title = title;
	this.width = width ? width : 180;
	this.height = height ? height : 120;
	this.timeout = 500;
	this.speed = 150;
	this.step = 5;
	this.right = screen.width - 1;
	this.bottom = screen.height;
	this.left = this.right - this.width;
	this.top = this.bottom - this.height;
	this.timer = 0;
	this.pause = false;
	this.close = false;
	this.autoHide = true;

	this.clickClose = false;
}

MSN_POP_CLASS.prototype.hide = function () {
	this.oPopup.hide();
};

MSN_POP_CLASS.prototype.onunload = function () {
	return true;
};

MSN_POP_CLASS.prototype.show = function () {	
  this.oPopup = window.createPopup();
	this.Pop = this.oPopup;
	var w = this.width;
	var h = this.height;
	var x = this.right-this.width;
	var y = this.bottom-this.height;
	var str = '';
	var me = this.Pop;
	this.oPopup.document.createStyleSheet()
			.addImport('../../nresources/default/css/layer_ob.css');
	this.oPopup.document.body.innerHTML = str;
	var fun = function () {
	    if(msn_count2!=0)
				me.show(x, y, w, h);
	}
	this.timer = window.setInterval(fun, this.speed);	
	this.close = false;
};

/*  
*    消息停止方法  
*/
MSN_POP_CLASS.prototype.stopthis = function () {	
	 window.clearInterval(this.timer);
	 this.close = true;	
};
/*  
*    消息显示方法  
*/
MSN_POP_CLASS.prototype.reshow = function () {	
  if(this.close==false){
  		return;
  	}
	var w = this.width;
	var h = this.height;
	var x = this.right-this.width;
	var y = this.bottom-this.height;
	var me = this.Pop;
	
	var fun = function () {
	    if(msn_count2!=0)
		me.show(x, y, w, h);
	}
	this.timer = window.setInterval(fun, this.speed);	
	this.close = false;	
};