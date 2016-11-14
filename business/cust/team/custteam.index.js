define(function (){
	
	function Global( vars ) {
		var $ = require( "jquery" )
		, base = require( "app/base" )
		, message = base.message
		, tools = base.tools
		, code = base.code;
		
		code.cache( "Is_No" );	
		
		var that = this;
		var vars = that.vars = $.extend( true, {}, vars );//全局变梁
		var handlers = that.handlers = {};//处理程序
		handlers.global = function() { return that; };
		
		that.init = function() {
			this.layout(); 
		};
		
		that.load = function() {};
		
		that.layout = function (){
			var that = this.global();
			
			
			
			that.selector.find( "input[name=stat]" ).select( {//实例下拉插件
				code: { type: "Is_No" }
			} );
			
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
			//客户管理
			that.selector.find( "#custManagerBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.custManagerBtn( items );
				return false;
			} );
			
			that.selector.find( ".input" ).input( {} );//实例input插件
			var config = {
				remote: {
		        	url: "cust/manage/team/list",
		            params: {}
		        },
		        multi: true,
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
			cols[ cols.length ] = { title: "组编号", name: "custTeam", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "组名称", name: "custTeamName", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "是否有效", name: "stat", width: "50px", lockWidth: true, renderer: function( val, item, rowIndex ) {
				return base.code.getText( "Is_No", val )
			}
			};
			cols[cols.length ] = { title: "备注", name: "remark", width: "200px", lockWidth: true,renderer: function( val, item, rowIndex ) {
						var str = val!=null?val.substring(0,42):'';
						return str;
					}
			};

			config.events.click = {
				handler: function( event, item, rowIndex ) {
			
				}
			};
			config.customEvents.push( {
				target: ".edit",
				handler: function( event, item, rowIndex ) {
					
				}
			} );
			that.vars.gridVar = that.selector.find( "#bizChannelGrid" ).grid( config );//renderer
		};//end layout
		
		that.handlers.load = function( data ) {
			
		};
		that.handlers.add = function(  ) {
			var that = this.global();
			that.page.open( {
				title: "客户组管理 | 新增",
				url: "cust/manage/team/form",
				size: "modal-lg",
				params: {},
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.gridVar.load();
					}
				}
			} );
			
		};//end
		//客户管理
		handlers.custManagerBtn = function( items ) {
			if ( items.length != 1 ) {
				return message.error( "请选择一条操作数据。" );
			}
			var item = items[ 0 ]; //获取一条数据
			var that = this.global();
			that.page.open( {
				title: "客户组管理 | 组员管理",
				url: "cust/manage/team/custfrom",
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
		//end
		
		that.handlers.edit = function( items ) {
			if ( items.length != 1 ) {
				return message.error( "请选择一条操作数据。" );
			}
			
			var item = items[ 0 ]; //获取一条数据
			
			var that = this.global();
			that.page.open( {
				title: "客户组管理 | 编辑",
				url: "cust/manage/team/form",
				size: "modal-lg",
				params: { item: item },
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.gridVar.load();
					}
				}
			} );
			
		};//end
		that.handlers.del = function( items ) {
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
					url: "cust/manage/team/delete",
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
			
		};//end
	};
	
	return Global;
});