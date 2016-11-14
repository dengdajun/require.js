define(function (){
	function Global( vars ){
		//=======================================================
		// 获取基础组件
		//=======================================================
		var app = require( "app/base" )
			, base = require( "app/base" )
			, message = base.message
			, tools = base.tools
			, code = base.code;
		var moment = require( "moment" );
		
		//=======================================================
		// 当前组件
		//=======================================================
		var that = this; //全局对象
		var vars = this.vars = {};//全局变量
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
			if ( !that.params.item ) 
				return;
			that.handlers.load( that.params.item );
			
		};
		
		//验证组件
		that.valdiate = function(){
			
			var that = this.global();//获取组件的全局对象
			var that = this.global();
			that.vars.validator = that.selector.find( "form" ).validate( {
				rules: {
					loanAmt: {required:true,number:true,min:0,max:999999999},
					feeRate: {required:true,number:true,min:0,max:1 }
				}
			} );
			
		};
		
		//页面布局
		that.layout = function(){
			//关闭事件
			that.selector.find( "#closeBtn" ).click( function(event) {
				that.close();
				return false;
			});
			//试算
			that.selector.find( "#calcBtn" ).click( function(event) {
				that.handlers.calc();
				return false;
			});
			
			that.selector.find( ".input" ).input( {} );//实例input插件
		};//end 页面布局
		
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		handlers.load = function( item ){
			var that = this.global();
			that.selector.find( ":input[name=id]" ).valChange( item.id );
			that.selector.find( ":input[name=ruleId]" ).valChange( item.ruleId );
			that.selector.find( ":input[name=ruleName]" ).valChange( item.ruleId );
			that.selector.find( ":input[name=confName]" ).valChange( item.confName );
			that.selector.find( ":input[name=repayCond]" ).valChange( item.repayCond ); 
			that.selector.find( ":input[name=ruleDet]" ).valChange( item.ruleDet );
			
			that.selector.find( ":input[name=confName]" ).disabled( true );
			that.selector.find( ":input[name=repayCond]" ).disabled( true );
			that.selector.find( ":input[name=ruleName]" ).disabled( true );
			that.selector.find( ":input[name=calcResult]" ).disabled( true );
		};
		
		//试算业务逻辑
		handlers.calc = function (){
			var that = this.global();
			//验证
			if ( !that.vars.validator.form() ) return;
			var data=that.params.item;
			data.ruleId = that.selector.find( ":input[name=ruleId]" ).val();
			data.loanAmt=that.selector.find(":input[name='loanAmt']").val();
			data.feeRate=that.selector.find(":input[name='feeRate']").val();
			that.loading.show();
			$.ajax( {
				url: "nucleus/bizconfig/repaytypeconf/doCalc",
				type: "POST",
				contentType:"application/json",
				data: JSON.stringify(that.params.item),
				complete: function() {
					//$button.disabled( false );
					that.loading.hide();
				},
				success: function( data ) {
					that.selector.find( ":input[name=calcResult]" ).valChange( data.map.calcResult );
				}
			} );
		};
		
	};//end Global
	
	return Global;
});