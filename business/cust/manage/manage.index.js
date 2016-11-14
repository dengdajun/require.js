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
		code.cache( "sex","Cust_Type" );
		
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
			that.selector.find( ".input" ).input( {} );//实例input插件
			
			that.selector.find( "#manageGrid #queryBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.query(items);
				return false;
			} );
			
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {
			
		};
		
		//加载客户信息的展示页面
		handlers.query = function(){
			var that = this.global();
			var config = {
					remote: {
			        	url: "cust/manage/info/list",
			            params: {}
			        },
			        multi: false,
			        page: true,
			        query: {
			        	isExpand:true,
			        	target: that.selector.find( ".grid-query" )
			        },
			        plugins: [],
			        events: {},
			        customEvents: []
				};
				config.cols = cols = [];
				cols[ cols.length ] = { title: "编号", name: "custNo", width: "120px", lockWidth: true};
				cols[ cols.length ] = { title: "姓名", name: "custName", width: "70px", lockWidth: true , style:"text-align: center"};
				cols[ cols.length ] = { title: "性别", name: "sex", width: "70px", lockWidth: true , style:"text-align: center",
						renderer:function(val,item,rowIndex){return base.code.getText("sex",val);}
				};
				cols[ cols.length ] = { title: "类型", name: "custType", width: "70px", lockWidth: true , style:"text-align: center",
						renderer:function(val,item,rowIndex){return base.code.getText("Cust_Type",val);}

				};
				cols[ cols.length ] = { title: "手机", name: "phoneNo", width: "70px", lockWidth: true, style:"text-align: center"};
				cols[ cols.length ] = { title: "评级", name: "level", width: "90px", lockWidth: true, style:"text-align: center"};
				cols[ cols.length ] = { title: "授信额度", name: "creditLimit", width: "120px", lockWidth: true, style:"text-align: right",
						renderer: function( val, item, rowIndex ) {return tools.moneyFromat(val, 2);}
				};
				cols[ cols.length ] = { title: "剩余额度", name: "remainLimit", width: "120px", lockWidth: true, style:"text-align: right",
						renderer: function( val, item, rowIndex ) {return tools.moneyFromat(val, 2);}
				};
				
				config.events.click = {
					handler: function( event, item, rowIndex ) {
						//item 当期行数据
						//rowIndex 当前行索引
						
						//处理其他逻辑
					}
				};
				
				config.customEvents.push( {
//					target: ".edit",
//					handler: function( event, item, rowIndex ) {
//						
//					}
				} );
				
				that.vars.gridVar = that.selector.find( "#manageGrid" ).grid( config );//renderer
		};
	};
	return Global;
	
} );