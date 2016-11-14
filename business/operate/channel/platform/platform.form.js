define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
		
		var moment = require( "moment" );
		
		base.code.cache( "Is_No" );
		
		//=======================================================
		// 当前组件
		//=======================================================
		var that = this; //全局对象
		var vars = this.vars = {};//全局变梁
		var handlers = this.handlers = {};//处理程序
		handlers.global = function() { return that; };
		
		//组件入口函数  相当于java.main
		that.init = function() {
			this.layout();
			this.load();
			this.valdiate();
			this.valdiate();
		};
		
		
		//初始化远程请求处理
		that.load = function() {
			var that = this.global();
			console.log(that.params.item );
			
			if ( !that.params.item ) return;
			that.handlers.load( that.params.item );
		};
		
		//验证组件
		that.valdiate = function() {
			var that = this.global(); 
			//jquery-validate 验证form表单元素
			that.vars.validator = that.selector.find( "form" ).validate( {
				rules: {
					acctBelong: { required: true },
					repayChan:{required:true},
					acctType:{required:true},
					acctNo:{required:true},
					acctName:{required:true},
					openBank:{required:true},
					acctOrg:{required:true}
				},
			} );
		};
		
		//页面布局
		that.layout = function() {
			
			var that = this.global();//获取组件的全局对象
			that.selector.find( "input[name=chanNo]" ).select( {//实例下拉插件
				remote: {
					url: "operate/platform/channo",
					type: 'POST'
				}
			} );
			
			that.selector.find( ".input" ).input( {} );//实例input插件
			that.selector.find( "input[name=acctOrg]" ).select( {//实例下拉插件
				code: { type: "Open_Org" }
			} );
			
			that.selector.find( "input[name=acctBelong]" ).select( {//实例下拉插件
				code: { type: "Acc_Type" }
			} ).valChange("28000001");
			
			that.selector.find( "input[name=acctType]" ).select( {//实例下拉插件
				code: { type: "ACCT_TYPE" },
				events: {
					change: {
						data: {},
						handler: function (event, val, items) {
							//还款渠道
							var repayChan = that.selector.find( "input[name=repayChan]").val();
							that.handlers.styctr(repayChan,val);
						}
					}
				}
			} ).valChange("21900001");;
			that.selector.find( "input[name=repayChan]" ).select( {//实例下拉插件
				code: { type: "REPAY_CHANNEL" },
				events: {
					change: {
						data: {},
						handler: function (event, val, items) {
							//账户类型 
							var acctType = that.selector.find( "input[name=acctType]" ).val();
							that.handlers.styctr(val,acctType);
						}
					}
				}
			} ).valChange("11400001");
			
			//初始布局
			that.handlers.styctr(that.selector.find( "input[name=repayChan]").val() , that.selector.find( "input[name=acctType]" ).val());

			that.selector.find( "input[name=acctBelong]" ).parent("div").find("ul").hide();
			
			
			
			//保存事件
			that.selector.find( "#submitBtn" ).click( function(event) {
				that.handlers.save();
				return false;
			});
			
			//关闭事件
			that.selector.find( "#closeBtn" ).click( function(event) {
				that.close();
				return false;
			});
			
			
		};
		
		
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		/** 加载数据*/
		handlers.load = function( item ) {
			var that = this.global();
			
			that.selector.find( ":input[name=id]" ).valChange( item.id ); 
			that.selector.find( ":input[name=acctBelong]" ).valChange( item.acctBelong );
			that.selector.find( ":input[name=repayChan]" ).valChange( item.repayChan ); 
			that.selector.find( ":input[name=acctType]" ).valChange( item.acctType ); 
			that.selector.find( ":input[name=marNo]" ).valChange( item.marNo ); 
			that.selector.find( ":input[name=marName]" ).valChange( item.marName ); 
			that.selector.find( ":input[name=acctNo]" ).valChange( item.acctNo ); 
			that.selector.find( ":input[name=acctName]" ).valChange( item.acctName ); 
			that.selector.find( ":input[name=acctOrg]" ).valChange( item.acctOrg ); 
			that.selector.find( ":input[name=openBank]" ).valChange( item.openBank ); 
			that.selector.find( ":input[name=chinapayMerkey]" ).valChange( item.chinapayMerkey );
			that.selector.find( ":input[name=chinapayPubkey]" ).valChange( item.chinapayPubkey );
			that.selector.find( ":input[name=certAlias]" ).valChange( item.certAlias );
			that.selector.find( ":input[name=chinapayUsername]" ).valChange( item.chinapayUsername ); 
			that.selector.find( ":input[name=chinapayPw]" ).valChange( item.chinapayPw ); 
			that.selector.find( ":input[name=platNo]" ).valChange( item.platNo );
			that.selector.find( ":input[name=platName]" ).valChange( item.platName );
			that.selector.find( ":input[name=commBank]" ).valChange( item.commBank );
			that.selector.find( ":input[name=commAcctNo]" ).valChange( item.commAcctNo );
			that.selector.find( ":input[name=commOpenOrg]" ).valChange( item.commOpenOrg );
			that.selector.find( ":input[name=remark]" ).valChange( item.remark );
		};
		
		/** 保存*/
		handlers.save = function (){
			var that = this.global();
			if ( !that.vars.validator.form() ) return;
			var data = that.selector.find( "form" ).serialize();
			
			that.loading.show(); 
			$.ajax( {
				url: "operate/platform/save",
				type: "POST",
				data: data,
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
					if ( !data.success ) {
						return message.error( data.msg );
					}
					message.success( data.msg );
					that.close( data );
				}
			} );
		};
		/***********************************************************************************
		 * *********************************************************************************
		 * 页面配置样式控制
		 * 
		 * @param repayChan 还款渠道
		 * @param acctType 账户类型
		 * 
		 */
		handlers.styctr = function (repayChan , acctType){
			var that = this.global();
			//11400001 单笔, 11400002 对公, 11400003 批量代扣 ;
			//21900005 天翼支付 , 21900006 快付通, 21900007 微支付,21900001 支付宝 , 21900002 微信 , 21900003 银行卡, 21900004 财富通 ;
			
			//先还原成默认配置样式
			that.handlers.defltctr();
			//天翼支付
			if('21900005' == acctType){ 
				//单笔
				if('11400001' == repayChan){
					//显示天翼支付单笔配置样式
					that.selector.find(":input[name='chinapayMerkey'], [name='certAlias'], [name='platNo'], [name='platName'],[name='chinapayPw']").parent().show();
					that.selector.find(":input[name='chinapayMerkey'], [name='certAlias'], [name='platNo'], [name='platName'],[name='chinapayPw']").removeAttr("disabled");
					that.selector.find(":input[name='chinapayMerkey']").parent("div").children("label ").html("证书");
					that.selector.find(":input[name='certAlias']").parent("div").children("label ").html("证书别名");
					that.selector.find(":input[name='chinapayPw']").parent("div").children("label ").html("证书密码");
					that.selector.find(":input[name='platNo']").parent("div").children("label ").html("平台号");
					that.selector.find(":input[name='platName']").parent("div").children("label ").html("平台名称");
				}
				
			//快付通
			}else if('21900006' == acctType){
				//单笔
				if('11400001' == repayChan){
					//显示快付通单笔配置样式
					that.selector.find(":input[name='chinapayMerkey'],[name='chinapayUsername'],[name='chinapayPw']").parent().show();
					that.selector.find(":input[name='chinapayMerkey'],[name='chinapayUsername'],[name='chinapayPw']").removeAttr("disabled");
					that.selector.find(":input[name='chinapayMerkey']").parent("div").children("label ").html("证书");
					that.selector.find(":input[name='chinapayUsername']").parent("div").children("label ").html("证书容器密码");
					that.selector.find(":input[name='chinapayPw']").parent("div").children("label ").html("证书密码");
				//批量	
				}else if('11400003'==repayChan){
					//显示快付通文件批扣配置样式
					that.selector.find(":input[name='commBank'],[name='commAcctNo'],[name='commOpenOrg'],[name='platNo']").parent().show();
					that.selector.find(":input[name='commBank'],[name='commAcctNo'],[name='commOpenOrg'],[name='platNo']").removeAttr("disabled");
					that.selector.find(":input[name='commBank']").parent("div").children("label ").html("代办收款行行别");
					that.selector.find(":input[name='commAcctNo']").parent("div").children("label ").html("代办收款行行号");
					that.selector.find(":input[name='commOpenOrg']").parent("div").children("label ").html("收款开户行行号");
					that.selector.find(":input[name='platNo']").parent("div").children("label ").html("企业代码");
				}
				
			//银联	
			}else if('21900003' == acctType){//银联
				//单笔
				if('11400001' == repayChan){
					//显示银联单笔配置样式
					that.selector.find(":input[name='chinapayMerkey'],[name='chinapayPubkey'],[name='chinapayUsername'],[name='chinapayPw']").parent().show();
					that.selector.find(":input[name='chinapayMerkey'],[name='chinapayPubkey'],[name='chinapayUsername'],[name='chinapayPw']").removeAttr("disabled");
					that.selector.find(":input[name='chinapayMerkey']").parent("div").children("label ").html("银联私钥");
					that.selector.find(":input[name='chinapayPubkey']").parent("div").children("label ").html("银联公钥");
					that.selector.find(":input[name='chinapayUsername']").parent("div").children("label ").html("用户名");
					that.selector.find(":input[name='chinapayPw']").parent("div").children("label ").html("密码");
				}
				
			}
			
		}
		
		//默认配置样式控制
		handlers.defltctr = function (){
			var that = this.global();
			//that.selector.find(".certconfig").hide();
			var  n, v;
	        var $inputs = that.selector.find(".certconfig :input[name]").each(function(){
	            n = $(this).attr("name");
	            if(n){
	                v = $.trim($(this).val());
	                $(this).attr("disabled","disabled");
	                $(this).parent().hide();
	            }
	        });
		}
		
	};
	
	return Global;
});