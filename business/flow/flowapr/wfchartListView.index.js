define(function () { 
	
	function Global( vars ) {
		
		//=======================================================
		//获取基础组件
		//=======================================================
		var $ = require( "jquery" )
			, base = require( "app/base" )
			, message = base.message
			, tools = base.tools
			, code = base.code
			, moment = require( "moment" );
		
		
		//=======================================================
		//当前组件
		//=======================================================
		var that = this;
		var vars = that.vars = $.extend( true, {}, vars );//全局变梁
		var handlers = that.handlers = {};//处理程序
		handlers.global = function() { return that; };
		
		//组件入口函数  相当于java.main
		that.init = function() {
			this.load();
			this.layout(); 
		};
		
		//初始化远程请求处理
		that.load = function() {
			that.vars.parentMenuItem = that.params.item || {};
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			
			that.selector.find( ".input" ).input( {} );//实例input插件
						
			that.selector.find( "#addBtn" ).bind( "click", function( event ) {
				that.handlers.add();
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
						
			that.selector.find( "#casedtlBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.casedtl( items );
				return false;
			} );
			
			that.selector.find( "input[name=ext1]" ).select( {
				code: { type: "Work_Flow_Type" }
			} );
			
			that.selector.find( "input[name=isDel]" ).select( {
				code: { type: "Is_No" }
			} );
						
			var config = {
				remote: {
		        	url: "flow/flowapr/wfchartList",
		            params: {}
		        },
		        multi: false,
		        page: true,
		        query: {
		        	target: that.selector.find( ".grid-query" )
		        },
		        plugins: [],
		        events: {},
		        customEvents: []
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "工作流名称", name: "templatename", width: "80px", lockWidth: true };
			cols[ cols.length ] = { title: "工作流代码", name: "templateKey", width: "80px", lockWidth: true };
			cols[ cols.length ] = { title: "工作流类型", name: "ext1", width: "80px", lockWidth: true, renderer: function( val, item, rowIndex ) {
				return base.code.getText( "Work_Flow_Type", val );
			}  };
			cols[ cols.length ] = { title: "是否删除", name: "isDel", width: "80px", lockWidth: true, renderer: function( val, item, rowIndex ) {
				return base.code.getText( "Is_No", val );
			}  };
			
			config.events.click = {
				handler: function( event, item, rowIndex ) {
					//item 当期行数据
					//rowIndex 当前行索引
					
					//处理其他逻辑a
				}
			};
			
			
			config.customEvents.push( {
				target: ".edit",
				handler: function( event, item, rowIndex ) {
					
				}
			} );
			
			that.vars.gridVar = that.selector.find( "#infoGrid" ).grid( config );//renderer
			
			
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {
			
		};
		handlers.add = function(  ) {
			var that = this.global();
			that.page.open( {
				title: false,
				url: "flow/flowapr/wfchartEdit",
				size: "modal-lg",
				params: {
				},
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
			if(item.isDel == "13900001")
			{
				alert("删除状态的数据不能进行编辑！");
				return ;
			}
			
			var that = this.global();
						
			that.page.open( {
				title: "流程管理 | 编辑",
				url: "flow/flowapr/wfchartEdit",
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
		
		//  数据删除
		handlers.del = function( items ) {
			if ( items == null || items.length == 0 ) {
				return message.error( "请选择至少一条操作数据。" );
			}

			var flag = 0;
			var templateKeys = [];
			$.each( items, function( index, item ) {
				templateKeys.push( item.templateKey );
			} ); 
			
			that.dialog.confirm( "确定删除选择的[ " + items.length + " ]条操作数据？", function( event, index ) {
				if ( index == 1 ) return false;
				$.ajax( {
					url: "flow/flowapr/delete",
					type: "POST",
					data: { templateKeys: templateKeys },
					success: function( data ) {
						if ( !data.success ) {
							return message.error( data.msg );
						}
						message.success( data.msg );
						that.vars.gridVar.load();
					}
				} );
			});
			
		};
		
	};
	
	
	return Global;
	
} );