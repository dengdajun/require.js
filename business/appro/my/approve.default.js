define(function () { 

	function Global( vars ) {
		
		//=======================================================
		//获取基础组件
		//=======================================================
		var $ = require( "jquery" )
			, base = require( "app/base" )
			, message = base.message
			, tools = base.tools
			, code = base.code;
		
		//缓存码值
		code.cache( "Recheck_Pass,Dec_Cause" );
		
		//=======================================================
		//当前组件
		//=======================================================
		var that = this;
		var vars = that.vars = $.extend( true, {}, vars );//全局变梁
		var handlers = that.handlers = {};//处理程序
		handlers.global = function() { return that; };
		
		//组件入口函数  相当于java.main
		that.init = function() {
			this.layout(); 
			this.load();
			this.valdiate();
		};
		
		//初始化远程请求处理
		that.load = function() {

		};
		//验证组件
		that.valdiate = function() {
			var that = this.global();
			that.vars.validator = that.selector.find( "form" ).validate( {
				rules: {
					remark: { required: true },
					approveResult: { required: true }
				}
			} );
		};
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			var loanNo = that.params.item.loanNo;
			var nodeNo = that.params.item.nodeNo;
			that.selector.find( ".input" ).input( {} );//实例input插件
			that.selector.find(".loanNo").valChange(loanNo);
			that.selector.find(".nodeNo").valChange(nodeNo);
			that.selector.find( "input[name=approveResult]" ).select( {//实例下拉插件
				items:[
				       {label:'通过',value:'pass'},
				       {label:'不通过',value:'notpass'},
				       {label:'驳回',value:'reject'},
				]
			} );
			that.selector.find( "input[name=approveResult]").parent().find("ul li").each(function(){
				$(this).bind( "click", function( event ) {
					 var val=$(this).attr("value");
					 if(val=="pass"){
						 $("input[name=passReason]").parent().show();
						 $("input[name=rejectReason]").parent().hide();
						 $(".rejectRemark").hide();
					 }
					 else if(val=="notpass"){
						 $("input[name=passReason]").parent().hide();
						 $("input[name=rejectReason]").parent().show();
						 $(".rejectRemark").hide();
					 }
					 else if(val=="reject"){
						 $("input[name=passReason]").parent().hide();
						 $("input[name=rejectReason]").parent().hide();
						 $(".rejectRemark").show();
					 }
				});
			});
			that.selector.find( "input[name=passReason]" ).select( {//实例下拉插件
				code: { type: "Recheck_Pass" }
			} );
			that.selector.find( "input[name=rejectReason]" ).select( {//实例下拉插件
				code: { type: "Dec_Cause" }
			} );
			$("input[name=rejectReason]").parent().hide();
			//提交按钮
			that.selector.find( "#submitButton" ).bind( "click", function( event ) {
				$.ajax({
					url : "appro/state/list",
					type : "POST",
					data : {
						loginName : loginName.value,
					},
					success : function(data) {
						if(data == '23700002'){
							var val=that.selector.find( "input[name=approveResult]").parent().find("ul .active").attr("value");
							 if(typeof(val) == "undefined"|| val==null ||val.length==0){
								 message.error("请选择审批结果！");
								 return;
							 }
							
							 if(val=="pass"){
								 var reaseon=that.selector.find( "input[name=passReason]").parent().find("ul .active").attr("value");
								 if(typeof(reaseon) == "undefined"|| reaseon==null ||reaseon.length==0){
									 message.error("请选择决策原因！");
									 return;
								 }
									that.handlers.pass();
							 }
							 else if(val=="notpass"){
								 var reaseon=that.selector.find( "input[name=rejectReason]").parent().find("ul .active").attr("value");
								 if(typeof(reaseon) == "undefined"|| reaseon==null ||reaseon.length==0){
									 message.error("请选择决策原因！");
									 return;
								  }
									that.handlers.notPass();
							 }
							 else if(val=="reject"){
									that.handlers.reject();
							 }
					}else if(data == "23700004"){
						message.error("已下线，请签到后进行审批！！！");
					}else if(data =="23700005"){
						message.error("已离开，请恢复审批状态在审批！！！");
					}
				}
				});
				
			} );
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {
			
		};
		
		//审核通过
		handlers.pass = function(){
			var that = this.global();
			//验证
			//if ( !that.vars.validator.form() ) return;
			var data = that.selector.find( "form" ).serialize();
			that.loading.show();
			$.ajax( {
				url: "appro/my/info/pass",
				type: "POST",
				data: data,
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
                        that.loading.hide();
                        message.success("操作成功");
                        that.handlers.approve_ready();
                        that.close( data );
				}
			} );
		};
		//审核不通过
		handlers.notPass = function(){
			var that = this.global();
			//验证
			//if ( !that.vars.validator.form() ) return;
			var data = that.selector.find( "form" ).serialize();
			that.loading.show();
			$.ajax( {
				url: "appro/my/info/fail",
				type: "POST",
				data: data,
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
                        that.loading.hide();
                        message.success("操作成功");
                        that.handlers.approve_ready();
                        that.close( data );
				}
			} );
		};
		//驳回
		handlers.reject = function(){
			var that = this.global();
			//验证
			//if ( !that.vars.validator.form() ) return;
			var data = that.selector.find( "form" ).serialize();
			that.loading.show();
			$.ajax( {
				url: "appro/my/info/reject",
				type: "POST",
				data: data,
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
                        that.loading.hide();
                        message.success("操作成功");
                        that.handlers.approve_ready();
                        that.close( data );
				}
			} );
		};
		handlers.approve_ready = function() {
			var loginName = $("input[id='loginName']").val();
			var userName = $("input[id='userName']").val();
			$.ajax({
				url : "appro/state/update",
				type : "POST",
				data : {
					staff : "23700001",
					loginName : loginName
				},
				success : function(data) {
					if (data) {
						$(".qiandao").html("已就绪");
						$(".ready").html("已就绪");
						$(".sign").html("已签到");
						$(".leave").html("离开");
						$(".coil").html("下线");
					}
				}
			});
							
		};
		
	};
	return Global;
	
} );