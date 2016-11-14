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
		code.cache( "" );
		
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
		};
		
		//初始化远程请求处理
		that.load = function() {
			that.handlers.loanView(that.selector.find("#loanView"));
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {
			
		};
		
		//加载贷款视图展示页面
		handlers.loanView = function(content){
			//console.log(content);
			var that = this.global();
			that.module.open( {
			    url: "cust/manage/loan/index",
			    content: content,
			    params: {item:that.params.item},
			    events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.close();
					}
				}
			});
		};
	};
	return Global;
	
} );