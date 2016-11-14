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
		code.cache( "Tmpl_Type,Is_No,Branch_Self_Typ" );
		
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
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			that.selector.find( "input[name=branchSelf]" ).select( {
				code: { type: "Branch_Self_Typ" }
			} );
			that.selector.find( "input[name=tmplType]" ).select( {
				code: { type: "Tmpl_Type" }
			} );
			that.selector.find( ".input" ).input( {} );//实例input插件
			that.selector.find( "#addBtn" ).bind( "click", function( event ) {
				that.handlers.add();
			} );
			
			that.selector.find( "#delBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.del( items );
				return false;
			} );
			
			var config = {
				remote: {
		        	url: "bizchan/ctrcttmpl/conf/list",
		        	params: {}
		        },
		        multi: true,
		        page: {
		        	pageSize: 10
		        },
		        query: {
		        	isExpand:true,
		        	target: that.selector.find( ".grid-query")
		        },
		        plugins: [],
		        events: {
		        	loaded:{
		        		handler: function( event, items ) {
		        		}
		        	},
		        	click: {
		        		 handler: function (event, items, rowIndex) {
		        		 }
		        	}
		        },
		        customEvents: []
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "网点自营类型", name: "branchSelf",width: "80px",lockWidth: true, renderer:function (val, item, rowIndex ){
				return base.code.getText("Branch_Self_Typ",val);
			}};
			cols[ cols.length ] = { title: "模板", name: "fileName", width: "80px", lockWidth: true};
			cols[ cols.length ] = { title: "模板主题", name: "tmplType",width:"80px", lockWidth: true,renderer : function (val, item, rowIndex){
				return base.code.getText("Tmpl_Type",val);
			}};
			
			config.customEvents.push( {
				target: ".pro-toggle",
				handler: function( event, item, rowIndex ) {
					
					return false;
				}
			} );
			that.vars.gridVar = that.selector.find( "#tmplGrid" ).grid( config );//renderer
		};
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		
		//新增
		handlers.add = function() {
			var that = this.global();
			that.page.open({
				title: "模板添加",
				url: "bizchan/ctrcttmpl/conf/form",
				size: "modal-lg",
				params: {},
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.gridVar.load();
					}
				}
			});
		};
		
		//删除
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
					url: "bizchan/ctrcttmpl/conf/del",
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