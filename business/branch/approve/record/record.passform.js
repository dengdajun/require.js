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
//		code.cache( "Is_No" );
//		code.cache( "Branch_Self_Typ" );
//		code.cache( "Branch_Type" );
		
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
		//验证组件
		that.valdiate = function() {
			var that = this.global(); 
			//jquery-validate 验证form表单元素
			that.vars.validator = that.selector.find( "form" ).validate( {
				rules: {
				}
			} );
		};
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			that.selector.find( ".input" ).input( {} );//实例input插件
			
//			that.selector.find( "input[name=stat]" ).select( {//实例下拉插件
//				code: { type: "Is_No" }
//			} );
			
			
			
			var config = {
				remote: {
		        	url: "record/appro/recordlist",
		            params: {aprovResult:"25300003"}
		        },
		        multi: true,
		        page: true,
		        query: {
		        	target: that.selector.find( ".grid-query" )
		        },
		        plugins: [],
		        events: {},
		        customEvents: []
			};
			
			config.cols = cols = [];
			cols[ cols.length ] = { title: "网点名称", name: "branchName", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "营业执照号", name: "busLicsNo", width: "150px", lockWidth: true };
			cols[ cols.length ] = { title: "签约合同号", name: "signContr", width: "150px", lockWidth: true };
			cols[ cols.length ] = { title: "网点编码", name: "branchNo", width: "200px", lockWidth: true };
			cols[ cols.length ] = { title: "法人姓名", name: "regalName", width: "80px", lockWidth: true };
			cols[ cols.length ] = { title: "联系号码", name: "phoneNo", width: "120px", lockWidth: true };
			cols[ cols.length ] = { title: "签约日期", name: "signDate", width: "120px", lockWidth: true};
			cols[ cols.length ] = { title: "处理人姓名", name: "instUserName", width: "80px", lockWidth: true };
			cols[ cols.length ] = { title: "处理备注", name: "remark", width: "180px", lockWidth: true };
			cols[ cols.length ] = { title: "处理时间", name: "updtDate", width: "150px", lockWidth: true, style:"text-align: center",
					renderer: function( val, item, rowIndex ) {return tools.dateUtil.format( item.updtDate, "YYYY-MM-DD hh:mm:ss");}
			};
			config.events.click = {
				handler: function( event, item, rowIndex ) {
					//item 当期行数据
					//rowIndex 当前行索引
					
					//处理其他逻辑
				}
			};
			
			config.customEvents.push( {
				target: ".edit",
				handler: function( event, item, rowIndex ) {
					
				}
			} );
			
			that.vars.gridVar = that.selector.find( "#userGroupGrid" ).grid( config );//renderer
			
			
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {
		};
		
	};
	
	return Global;
	
} );