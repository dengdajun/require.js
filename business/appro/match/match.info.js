define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
		var moment = require( "moment" );
		
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
			that.handlers.matchedView(that.selector.find("#matchedView"));
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			//关闭事件
			that.selector.find( "#closeBtn" ).click( function(event) {
				that.close();
				return false;
			});
			
			
			//动态加载页面
			handlers.matchedView = function(content){
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

	};
	
	return Global;
});