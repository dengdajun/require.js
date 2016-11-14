define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
	var moment = require( "moment" );
	var $ = require( "jquery" );
		base.code.cache( "Is_No,Login_Type" );
		
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
		};
		
		//初始化远程请求处理
		that.load = function() {
			var that = this.global();
			if ( !that.params.item ) return;
			that.handlers.load( that.params.item );
		};
		
		
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			
			that.selector.find( ".input" ).input( {} );//实例input插件
			/*that.selector.find( ":input[name=state]" ).select( {
				code: { type: "Is_No" }
			} );
			that.selector.find( "input[name=isAdmin]" ).select( {
				code: { type: "Is_No" }
			} );
			
			that.selector.find( "input[name=loginType]" ).select( {
				code: { type: "Login_Type" }
			} );*/
		};
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		/** 加载数据*/
		handlers.load = function( item ) {
			var that = this.global();
			that.selector.find( ":input[name=id]" ).valChange( item.id ); 
			that.selector.find( ":input[name=phoneNo]" ).valChange( item.phoneNo ); 
			that.selector.find( ":input[name=loginNo]" ).valChange( item.loginNo );
			that.selector.find( ":input[name=loginName]" ).valChange( item.loginName );
			that.selector.find( ":input[name=loginPwd]" ).valChange( item.loginPwd ); 
			that.selector.find( ":input[name=loginType]" ).valChange(  $(base.code.getText("Login_Type",item.loginType)).text() ); 
			that.selector.find( ":input[name=isAdmin]" ).valChange( $(base.code.getText("Is_No",item.isAdmin)).text() ); 
			that.selector.find( ":input[name=certNo]" ).valChange( item.certNo ); 
			that.selector.find( ":input[name=loginCode]" ).valChange( item.loginCode ); 
			that.selector.find( ":input[name=pwdValid]" ).valChange( item.pwdValid ); 
			that.selector.find( ":input[name=loginNum]" ).valChange( item.loginNum ); 
			that.selector.find( ":input[name=remark]" ).valChange( item.remark ); 
			that.selector.find( ":input[name=state]" ).valChange( $(base.code.getText("Is_No",item.state)).text() ); 
			that.selector.find( ":input[name=instDate]" ).valChange( moment(item.instDate).format("YYYY-MM-DD")); 
			that.selector.find( ":input[name=instUserNo]" ).valChange( item.instUserNo ); 
			that.selector.find( ":input[name=updtDate]" ).valChange( moment(item.updtDate).format("YYYY-MM-DD")); 
			
			that.selector.find( ":input[name=id]" ).readonly( true ); 
			that.selector.find( ":input[name=phoneNo]" ).readonly( true ); 
			that.selector.find( ":input[name=loginNo]" ).readonly(true );
			that.selector.find( ":input[name=loginName]" ).readonly( true );
			that.selector.find( ":input[name=loginPwd]" ).readonly( true ); 
			that.selector.find( ":input[name=loginType]" ).readonly( true ); 
			that.selector.find( ":input[name=isAdmin]" ).readonly( true ); 
			that.selector.find( ":input[name=certNo]" ).readonly( true ); 
			that.selector.find( ":input[name=loginCode]" ).readonly( true ); 
			that.selector.find( ":input[name=pwdValid]" ).readonly( true ); 
			that.selector.find( ":input[name=loginNum]" ).readonly( true ); 
			that.selector.find( ":input[name=remark]" ).readonly( true ); 
			that.selector.find( ":input[name=state]" ).readonly( true ); 
			that.selector.find( ":input[name=instDate]" ).readonly( true ); 
			that.selector.find( ":input[name=instUserNo]" ).readonly( true ); 
			that.selector.find( ":input[name=updtDate]" ).readonly( true ); 
		; 
//			that.selector.find( ":input[name=repayNo]" ).disabled( true );
		};
		
	
	};
	
	return Global;
});