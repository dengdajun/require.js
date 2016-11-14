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
		var $ = require( "jquery" );
		//缓存码值
		code.cache( "Is_No" );
		
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
		};
		
		//初始化远程请求处理
		that.load = function() {};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			var item=that.params.item;
			that.selector.find( ".input" ).input( {} );//实例input插件
			that.selector.find( "#submitBtn" ).bind( "click", function( event ) {
				that.handlers.submit( item );
				return false;
			} );
			that.selector.find( "#cancel" ).bind( "click", function( event ) {
				that.close();
			} );
		};
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {
		};
//		提交操作
		that.handlers.submit = function( item ) {
			item.remark=$("#backreason").val();
			$.ajax( {
				url: "register/sysadmin/failSave",
				type: "POST",
				contentType:"application/json", 
				data: JSON.stringify(item),
				success: function( data ) {
					if ( !data.success ) {
						return message.error( data.msg );
					}
					message.success( data.msg );
					that.close(data);
				}
			} );
			
		};//end
		
	};
	return Global;
	
} );