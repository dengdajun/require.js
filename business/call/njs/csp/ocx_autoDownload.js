/*******************************************************************************
 * �ļ����� ocx_autoDownload.js �޸��ˣ� dengh �޸�ʱ�䣺 2010-03-15 ˵��������ؼ��Զ�����
 ******************************************************************************/
var fsoOcx =null;
var complainPhone  = document.getElementById('XDownload');
var ocxfilePath = "C:\\asiainfo";                   
var ocxfileName = "paispx.ocx";
var inifilePath = "C:\\asiainfo";                   
var inifileName = "aisp.ini";
var databusPath = "C:\\Windows\\System32";
var databusName = "databus.dll";

//�ؼ�����
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
			//if(rdShowConfirmDialog("�Ƿ����ػ����ļ���")==1){
			if(window.confirm("�Ƿ����ػ����ļ���")){
				//�ж�paispx.ocx�Ƿ����
				
				if (!fsoOcx.FolderExists(ocxfilePath)) {					
					
					fsoOcx.CreateFolder(ocxfilePath);
					complainPhone.DownloadFile('http://'+localAddr+':'+localPort+'/ocx/paispx.ocx','C:\\asiainfo\\paispx.ocx');
			
				} else  if (!fsoOcx.FileExists(ocxfilePath + "\\" + ocxfileName)) {
					
					complainPhone.DownloadFile('http://'+localAddr+':'+localPort+'/ocx/paispx.ocx','C:\\asiainfo\\paispx.ocx');
				}
				
				//�ж�databus.dll�Ƿ����
				if (!fsoOcx.FolderExists(databusPath)) {
			
					fsoOcx.CreateFolder(databusPath);
					complainPhone.DownloadFile('http://'+localAddr+':'+localPort+'/ocx/databus.dll','C:\\windows\\system32\\databus.dll');
				} else if (!fsoOcx.FileExists(databusPath + "\\" + databusName)) {
			
					complainPhone.DownloadFile('http://'+localAddr+':'+localPort+'/ocx/databus.dll','C:\\windows\\system32\\databus.dll');
				}
				
				//ע��ؼ�
				register();	
			}
			//�ж�aisp.ini�Ƿ����
			if (!fsoOcx.FolderExists(inifilePath)) {
				if (rdShowConfirmDialog("���ڻ�������ҳ��������ã�")==1){
					fsoOcx.CreateFolder(inifilePath);			
					addTab(true,'1002','��������','../callbosspage/config/local_config.jsp');
				}
			} else  if (!fsoOcx.FileExists(inifilePath + "\\" + inifileName)) {
		
				if (rdShowConfirmDialog("���ڻ�������ҳ������ļ����ã�")==1){
					addTab(true,'1002','��������','../callbosspage/config/local_config.jsp');
				}
			}				
		}
	} catch (ex) {
		alert(ex)
      
	}
}
//�ؼ�ע��
function register() {
	fsoOcx = new ActiveXObject("Scripting.FileSystemObject");	
	
	if (!fsoOcx.FolderExists(ocxfilePath)) {
	
		rdShowMessageDialog("��·�������ڣ��������ļ�!",1);
	} else if (!fsoOcx.FileExists(ocxfilePath + "\\" + ocxfileName)) {

		rdShowMessageDialog("���ļ������ڣ��������ļ�!",1);
	} else {
		
		complainPhone.RegisterOCX('C:\\asiainfo\\paispx.ocx');
		rdShowMessageDialog("�ؼ�ע�����!",1);
	}
}