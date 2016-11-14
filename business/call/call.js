define([
"jquery",      
"ola"
],function($,OLA){
	var ola_extn = "";
	//查询当前登录人员分机号
	$.ajax({
		async:false,
		url : "call/queryOlaExtn",
		type : "POST",
		success : function(data) {
			ola_extn = String(data);
		}
	});
	
	//拨打电话方法
	OLA.prototype.callPhone = function(loanNo,phone) {
		var call = this;
//		call.logout();
		$.ajax({
			async:false,
			url : "call/queryOlaQueue",
			type : "POST",
			data : {
				loanNo : loanNo
			},
			success : function(data) {
				if(data == null || data == ''){
					data = "100162";
				}
				call.opts.ola_queue = String(data);
			}
		});
		call.call(phone);
	};
	
	//实例化对象
	return new OLA({
		ola_extn: ola_extn, //分机号
		ola_queue: "" //队列编号
	});
});