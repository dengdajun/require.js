define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
//		var moment = require( "moment" );
		base.code.cache( "Is_No",'Oth_Position');
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
					phoneNo: { required: true ,isMobile:true},
					loginNo: { required: true ,isEnglish:true},
					loginName: { required: true },
					loginPwd: { required: true },
					certNo: { required: true ,isIdCardNo:true,},
					state: { required: true }
				}
			} );
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			
			
			that.selector.find( "input[name=state]" ).select( {
				code: { type: "Is_No" }
			} );
			that.selector.find( "input[name=userRole]" ).select( {
				code: { type: "Oth_Position" }
			} );
			
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
		};
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		/** 加载数据*/
		handlers.load = function( item ) {
			var that = this.global();
			that.selector.find( ":input[name=id]" ).valChange( item.id ); 
			that.selector.find( ":input[name=phoneNo]" ).valChange( item.phoneNo ); 
//			that.selector.find( ":input[name=loginNo]" ).valChange( item.loginNo );
			that.selector.find( ":input[name=loginName]" ).valChange( item.loginName );
			that.selector.find( ":input[name=loginPwd]" ).valChange( item.loginPwd ); 
			that.selector.find( ":input[name=certNo]" ).valChange( item.certNo ); 
			that.selector.find( ":input[name=userRole]" ).valChange( item.userRole ); 
			that.selector.find( ":input[name=state]" ).valChange( item.state ); 
			that.selector.find( ":input[name=remark]" ).valChange( item.remark ); 
			that.selector.find( ":input[name=phoneNo]" ).readonly(true);
		};
		
		/** 保存*/
		handlers.save = function() {
			var that = this.global();
			//验证
			if ( !that.vars.validator.form() ) return;
			that.selector.find( ":input[name=loginCode]" ).valChange( $("#branchNo").val()); 
			var data = that.selector.find( "form" ).serialize();
			that.loading.show(); 
			$.ajax( {
				url: "operate/channel/bizchannel/adminsave",
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