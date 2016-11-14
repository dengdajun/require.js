define(function () { 
	
	function Global( vars ) {
		
		//=======================================================
		//获取基础组件
		//=======================================================
		var $ = require( "jquery" )
			, base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
		var moment = require( "moment" );
		base.code.cache( "Is_No" );
		
		//=======================================================
		//当前组件
		//=======================================================
		var that = this;
		var vars = that.vars = $.extend( true, {}, vars );
		var handlers = that.handlers = {};//处理程序
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
			that.selector.find( ".nav-tabs li a" ).bind( "click", function( event ) {
				var content=$(this).attr("href");
				handlers.moduleLoad($(content));
			} );
			that.selector.find( ".nav-tabs li a:first" ).click();
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		
		handlers.load = function ( items ){
			var that = this.global();
			that.selector.find( "#prodId" ).valChange( items.id ); 
			that.selector.find( "#prodNo" ).valChange( items.prodNo ); 
			that.selector.find( "#prodStat" ).valChange( items.prodStat ); 
		};
		handlers.moduleLoad = function(content){
			var that = this.global();
			if("content1" != content.attr("id") && $("#prodId").val() == false){
				that.dialog.alert({
					closeBtn : false,
					title : "操作提示",
					content : "请先保存基本信息",
					buttonHandler : function(){
						that.selector.find( ".nav-tabs li a:first" ).click();
					}
				});
				return;
			}
			if(content.html()==""){
				that.module.open( {
				    url: content.attr("href"),
				    content: content,
				    params: {item:that.params.item},
				    events: {
						hiden: function( closed, data ) {
							if ( !closed ) return;
							that.close();
						}
					}
				});
			}
			
		};
	};
	return Global;
} );