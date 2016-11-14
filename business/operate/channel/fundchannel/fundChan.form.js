define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
		var moment = require( "moment" );
		base.code.cache( "Is_No,Acct_Type,Acc_Type");
		
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
		};
		
		//初始化远程请求处理
		that.load = function() {
			var that = this.global();
			if ( !that.params.item ) return;
			that.handlers.load( that.params.item );
		};
		
		//验证组件
		that.valdiate = function() {
			var that = this.global(); 
			that.vars.validator = that.selector.find( "form" ).validate( {
				rules: {
					chanNo: { required: true },
					chanName: { required: true },
					checkFlag: { required: true },
					checkAccFlag: { required: true },
					isUse: { required: true },
					fundName: { required: true },
					fundType: { required: true }
				}
			} );
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
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
			that.selector.find( ".input" ).input( {} );//实例input插件
			that.selector.find( "input[name=checkFlag]" ).select( {
				code: { type: "Is_No" }
			} );
			that.selector.find( "input[name=checkAccFlag]" ).select( {
				code: { type: "Is_No" }
			} );
			that.selector.find( "input[name=isUse]" ).select( {
				code: { type: "Is_No" }
			} );
			
			that.selector.find( "input[name=autoMakeRct]" ).select( {
				code: { type: "Is_No" }
			} );
			
			that.selector.find( "input[name=fundType]" ).select( {
				code: { type: "Acc_Type" }
			} );
			
			that.selector.find( "input[name=ruleId]" ).select( {
				remote: {
					url: "nucleus/bizconfig/sysrule/getSelectList?ruleType=24400014",
					type: 'POST'
				}
			} );
			
			that.selector.find( "input[name=feeNo]" ).select( {
				remote: {
					url: "operate/channel/fundChan/getFeelSelect",
					type: 'POST'
				}
			} );
		};
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		/** 加载数据*/
		handlers.load = function( item ) {
			var that = this.global();
			that.selector.find( ":input[name=id]" ).valChange( item.id );
			that.selector.find( ":input[name=chanNo]" ).valChange( item.chanNo );
			that.selector.find( ":input[name=chanName]" ).valChange( item.chanName );
			that.selector.find( ":input[name=checkFlag]" ).valChange( item.checkFlag );
			that.selector.find( ":input[name=checkAccFlag]" ).valChange( item.checkAccFlag );
			that.selector.find( ":input[name=isUse]" ).valChange( item.isUse );
			that.selector.find( ":input[name=feeNo]" ).valChange( item.feeNo );
			that.selector.find( ":input[name=url]" ).valChange( item.url );
			that.selector.find( ":input[name=fundName]" ).valChange( item.fundName );
			that.selector.find( ":input[name=fundAddr]" ).valChange( item.fundAddr );
			that.selector.find( ":input[name=fundType]" ).valChange( item.fundType );
			that.selector.find( ":input[name=dayLoanAmt]" ).valChange( item.dayLoanAmt );
			that.selector.find( ":input[name=ruleId]" ).valChange( item.ruleId );
			that.selector.find( ":input[name=autoMakeRct]" ).valChange( item.autoMakeRct );
			that.selector.find( ":input[name=chanNo]" ).readonly(true);
		};
		
		/** 保存*/
		handlers.save = function() {
			var that = this.global();
			//验证
			if ( !that.vars.validator.form() ) return;
			if(that.selector.find("input[name=checkFlag]").val()=="13900001" || that.selector.find("input[name=checkAccFlag]").val()=="13900001"){
				if(!that.selector.find("input[name=feeNo]").val()){
					that.selector.find( "input[name=feeNo]" ).validErrorTip("不能为空");
					return;
				}
			}else{
				that.selector.find( "input[name=feeNo]" ).validErrorTip("");
			}
			
			var data = that.selector.find( "form" ).serialize();
			that.loading.show(); 
			$.ajax( {
				url: "operate/channel/fundChan/save",
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
	};
	
	return Global;
});