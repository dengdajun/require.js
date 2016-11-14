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
		code.cache( "Branch_Type,Is_No" );
		
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
		that.load = function() {};
		
		//验证组件
		that.valdiate = function() {
			var that = this.global(); 
			that.vars.validator = that.selector.find( "form" ).validate( {
				rules: {
					chanNo: { required: true },
					repayDate: { required: true }
				}
			} );
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			that.selector.find( ".input" ).input( {} );//实例input插件
			
			that.selector.find("#submitBtn").bind("click",function ( event ){
				 that.handlers.exportDay();
				 return false;
			});
			
			that.selector.find("#closeBtn").bind("click",function ( event ){
				 that.close();
				 return false;
			});
			
			that.selector.find( "input[name=stat]" ).select( {//实例下拉插件
				code: { type: "Sett_Stat" }
			} );
			
			that.selector.find( "input[name=chanNo]" ).select( {//实例下拉插件
				remote: {
					url: "operate/channel/fundChan/getSelectList",
					type: 'POST'
				}
			} );
			that.selector.find( "input[name=repayDate]" ).datetimepicker({
				format : "YYYYMMDD"
			});
		
		}
			
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {
			
		};
		
		handlers.exportDay = function (){
			var that = this.global();
			if ( !that.vars.validator.form() ) return;
			var data = that.selector.find( "form" ).serialize();
			that.loading.show();
			var url = "operate/channel/repayment/doExportDay?"+data;
			if(!document.getElementById( "_filedown_")){
				var downWindow = document.createElement( 'iframe');
				downWindow.width = '0';
				downWindow.height = '0';
				downWindow.name = "_filedown_";
				downWindow.id = "_filedown_";
				downWindow.src =  url;
				document.body.appendChild(downWindow);
			}else{
				document.getElementById( "_filedown_").src = url;
			}
			that.loading.hide();
			that.close();
		};
		
	};
	return Global;
	
} );