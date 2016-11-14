/*******************************************************************************
 * 文件名： ocx_autoDownload.js 修改人： dengh 修改时间： 2010-03-15 说明：话务控件自动下载
 ******************************************************************************/
var fsoOcx =null;
var complainPhone  = document.getElementById('XDownload');
var ocxfilePath = "C:\\asiainfo";                   
var ocxfileName = "paispx.ocx";
var inifilePath = "C:\\asiainfo";                   
var inifileName = "aisp.ini";
var databusPath = "C:\\Windows\\System32";
var databusName = "databus.dll";

//控件下载
function fileExist(localAddr,localPort){

var localAddr = document.getElementById("localAddr").value;
var localPort = document.getElementById("localPort").value;

	try {
		fsoOcx = new ActiveXObject("Scripting.FileSystemObject");
		//paispx.ocx
	
		if (
		    !fsoOcx.FolderExists(ocxfilePath) || 
		    !fsoOcx.FolderExists(databusPath) ||
			!fsoOcx.FileExists(ocxfilePath + "\\" + ocxfileName) || 
			!fsoOcx.FileExists(databusPath + "\\" + databusName) ||
			!fsoOcx.FileExists(inifilePath + "\\" + inifileName)
			)
		{
			
			//alert('http://'+localAddr+':'+localPort+'/ocx/paispx.ocx');		
			//if(rdShowConfirmDialog("是否下载话务文件？")==1){
			if(window.confirm("是否下载话务文件？")){
				//判断paispx.ocx是否存在
				
				if (!fsoOcx.FolderExists(ocxfilePath)) {					
					
					fsoOcx.CreateFolder(ocxfilePath);
					complainPhone.DownloadFile('http://'+localAddr+':'+localPort+'/ocx/paispx.ocx','C:\\asiainfo\\paispx.ocx');
			
				} else  if (!fsoOcx.FileExists(ocxfilePath + "\\" + ocxfileName)) {
					
					complainPhone.DownloadFile('http://'+localAddr+':'+localPort+'/ocx/paispx.ocx','C:\\asiainfo\\paispx.ocx');
				}
				
				//判断databus.dll是否存在
				if (!fsoOcx.FolderExists(databusPath)) {
			
					fsoOcx.CreateFolder(databusPath);
					complainPhone.DownloadFile('http://'+localAddr+':'+localPort+'/ocx/databus.dll','C:\\windows\\system32\\databus.dll');
				} else if (!fsoOcx.FileExists(databusPath + "\\" + databusName)) {
			
					complainPhone.DownloadFile('http://'+localAddr+':'+localPort+'/ocx/databus.dll','C:\\windows\\system32\\databus.dll');
				}
				
				//注册控件
				register();	
			}
			//判断aisp.ini是否存在
			if (!fsoOcx.FolderExists(inifilePath)) {
				if (rdShowConfirmDialog("请在话务配置页面进行配置！")==1){
					fsoOcx.CreateFolder(inifilePath);			
					addTab(true,'1002','话务配置','../callbosspage/config/local_config.jsp');
				}
			} else  if (!fsoOcx.FileExists(inifilePath + "\\" + inifileName)) {
		
				if (rdShowConfirmDialog("请在话务配置页面进行文件配置！")==1){
					addTab(true,'1002','话务配置','../callbosspage/config/local_config.jsp');
				}
			}				
		}
	} catch (ex) {
		alert(ex)
      
	}
}
//控件注册
function register() {
	fsoOcx = new ActiveXObject("Scripting.FileSystemObject");	
	
	if (!fsoOcx.FolderExists(ocxfilePath)) {
	
		rdShowMessageDialog("该路径不存在，请下载文件!",1);
	} else if (!fsoOcx.FileExists(ocxfilePath + "\\" + ocxfileName)) {

		rdShowMessageDialog("该文件不存在，请下载文件!",1);
	} else {
		
		complainPhone.RegisterOCX('C:\\asiainfo\\paispx.ocx');
		rdShowMessageDialog("控件注册完毕!",1);
	}
}