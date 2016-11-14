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
			
			that.selector.find( "#addBtn" ).bind( "click", function( event ) {
				that.handlers.add();
				return false;
			} );
			
			that.selector.find( "#editBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.edit( items );
				return false;
			} );
			
			that.selector.find( "#delBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.del( items );
				return false;
			} );
			
			var config = {
				remote: {
		        	url: "operate/platform/list",
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
			cols[ cols.length ] = { title: "账户归属", name: "acctBelong", width: "100px", lockWidth: true ,align:'center',
					renderer:function(val,item,rowIndex){return base.code.getText("ACC_TYP",val);}};
			
			cols[ cols.length ] = { title: "还款渠道", name: "repayChan", width: "100px", lockWidth: true ,align:'center',
					renderer:function(val,item,rowIndex){return base.code.getText("REPAY_CHANNEL",val);}};
			cols[ cols.length ] = { title: "平台号", name: "platNo", width: "150px", lockWidth: true };
			cols[ cols.length ] = { title: "平台名称", name: "platName", width: "90px", lockWidth: true };
			cols[ cols.length ] = { title: "账户", name: "acctNo", width: "150px", lockWidth: true };
			cols[ cols.length ] = { title: "账户名称", name: "acctName", width: "90px", lockWidth: true };
			cols[ cols.length ] = { title: "账户类型", name: "acctType", width: "100px", lockWidth: true ,align:'center',
					renderer:function(val,item,rowIndex){return base.code.getText("ACCT_TYPE",val);}};
			cols[ cols.length ] = { title: "插入时间", name: "instDate", width: "150px", lockWidth: true, style:"text-align: center",
					renderer: function( val, item, rowIndex ) {return tools.dateUtil.format( item.instDate, "YYYY-MM-DD hh:mm:ss");}
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
			
			that.vars.gridVar = that.selector.find( "#platform" ).grid( config );//renderer
			
			
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {
		};
		
		handlers.add = function( items ) {
			var that = this.global();
			that.page.open( {
				title: "平台账户 | 新增",
				url: "operate/platform/from",
				size: "modal-lg",
				params: {},
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.gridVar.load();
					}
				}
			} );
		};
		
		handlers.edit = function( items ) {
			if ( items.length != 1 ) {
				return message.error( "请选择一条操作数据。" );
			}
			
			var item = items[ 0 ]; //获取一条数据
			
			var that = this.global();
			that.page.open( {
				title: "用户组管理 | 编辑",
				url: "operate/platform/from",
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
		handlers.del = function( items ) {
			if ( items == null || items.length == 0 ) {
				return message.error( "请选择至少一条操作数据。" );
			}
			
			var ids = [];
			$.each( items, function( index, item ) {
				ids.push( item.id );
			} ); 
			
			that.dialog.confirm( "确定删除选择的[ " + items.length + " ]条操作数据？", function( event, index ) {
				if ( index == 1 ) return false;
				$.ajax( {
					url: "operate/platform/del",
					type: "POST",
					data: { ids: ids },
					success: function( data ) {
						if ( !data.success ) {
							return message.error( data.msg );
						}
						message.success( data.msg );
						that.vars.gridVar.load();
					}
				} );
			} );
			
		};
		
	};
	
	return Global;
	
} );