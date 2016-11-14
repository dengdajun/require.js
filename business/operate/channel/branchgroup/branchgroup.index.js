define(function (){
	
	function Global( vars ) {
		var $ = require( "jquery" )
		, base = require( "app/base" )
		, message = base.message
		, tools = base.tools
		, code = base.code;
		
		base.code.cache( "branch_grp_type" );
		
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
			
			that.selector.find( ".input" ).input( {} );//实例input插件
			
			that.selector.find( "#addBtn" ).bind( "click", function( event ) {
				that.handlers.add();
			} );
			
			that.selector.find( "#editBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.edit( items );
				return false;
			} );
			that.selector.find( "#editBranch" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.editBranch( items );
				return false;
			} );
			
			that.selector.find( "#delBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.del( items );
				return false;
			} );
			
			var config = {
				remote: {
		        	url: "operate/channel/branchgroup/list",
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
			cols[ cols.length ] = { title: "分组编码", name: "groupNo", width: "200px", lockWidth: true };
			cols[ cols.length ] = { title: "组名称", name: "groupName", width: "200px", lockWidth: true };
			cols[ cols.length ] = { title: "组类型", name: "groupTyp" ,width: "60px",lockWidth: true,align:'center',renderer: function( val, item, rowIndex ) {return base.code.getText( "branch_grp_type", val );}
			};
			cols[ cols.length ] = { title: "状态", name: "stat", width: "50px", lockWidth: true,align:'center', renderer: function( val, item, rowIndex ) {
				return base.code.getText( "Is_No", val );
			}};
			cols[ cols.length ] = { title: "备注", name: "remark", width: "350px", lockWidth: true, mouseover:true};

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
		
		handlers.load = function( data ) {
			
		};
		
		handlers.add = function(  ) {
			var that = this.global();
			that.page.open( {
				title: "网点组管理 | 新增",
				url: "operate/channel/branchgroup/form",
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
		
		handlers.edit = function( items ) {
			if ( items.length != 1 ) {
				return message.error( "请选择一条操作数据。" );
			}
			
			var item = items[ 0 ]; //获取一条数据
			
			var that = this.global();
			that.page.open( {
				title: "网点组管理 | 编辑",
				url: "operate/channel/branchgroup/form",
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
		
		handlers.editBranch = function (items){
			
			if ( items.length != 1 ) {
				return message.error( "请选择一条操作数据。" );
			}
			var item = items[ 0 ]; //获取一条数据
			
			var that = this.global();
			that.page.open( {
				title: "网点组管理 | 网点管理",
				url: "operate/channel/branchgroup/branch",
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
					url: "operate/channel/branchgroup/delete",
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