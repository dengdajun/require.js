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
			
			that.selector.find( "#appro" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.appro( items );
				return false;
			} );
			
			
			
			var config = {
				remote: {
		        	url: "branch/appro/list",
		            params: {}
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
			cols[ cols.length ] = { title: "网点名称", name: "branchName", width: "150px", lockWidth: true };
			cols[ cols.length ] = { title: "网点自营类型", name: "branchSelf", width: "100px", lockWidth: true ,align:'center',
					renderer:function(val,item,rowIndex){return base.code.getText("Branch_Self_Typ",val);}};
			
			cols[ cols.length ] = { title: "网点类型", name: "branchTyp", width: "100px", lockWidth: true ,align:'center',
					renderer:function(val,item,rowIndex){return base.code.getText("Branch_Type",val);}};
			cols[ cols.length ] = { title: "营业执照号", name: "busLicsNo", width: "150px", lockWidth: true };
			cols[ cols.length ] = { title: "法人代表名称", name: "userName", width: "90px", lockWidth: true };
			cols[ cols.length ] = { title: "法人代表身份证号", name: "certNo", width: "150px", lockWidth: true };
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
		
		handlers.appro = function( items ) {
			if ( items.length != 1 ) {
				return message.error( "请选择一条操作数据。" );
			}
			
			var item = items[ 0 ]; //获取一条数据
			var that = this.global();
			that.page.open( {
				title: "商户管理 | 进行认证",
				url: "branch/appro/listInfo",
				size: "modal-lg",
				params: { item: item },
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.gridVar.load();
					}
				}
			} );
			
		};
		
		
	};
	
	return Global;
	
} );