define(function () { 
	
	function Global( vars ) {
		
		//=======================================================
		//获取基础组件
		//=======================================================
		var $ = require( "jquery" )
			, base = require( "app/base" )
			, message = base.message
			, code = base.code
			, tools = base.tools;
		
		code.cache( "orgLevel,orgType,stat,Rule_Type" );
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
			
			that.selector.find( ".select" ).select( {//实例下拉插件
				itemLabel: "label",
				itemValue: "value",
				items: [
					{ label: "启用", value: "00000001" },
					{ label: "禁用", value: "00000002" }
		        ]
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
			
			var config = {
				remote: {
		        	url: "nucleus/bizconfig/sysrule/list",
		            params: {}
		        },
		        multi: true,
		        page: true,
		        query: {
		        	isExpand:true,
		        	target: that.selector.find( ".grid-query" )
		        },
		        customEvents: [],
		        plugins: []
			};
			
			config.cols = cols = [];
			cols[ cols.length ] = { title: "编码", name: "ruleId", width: "200px", lockWidth: true, mouseover:true };
			cols[ cols.length ] = { title: "规则名称", name: "ruleName", width: "200px", lockWidth: true };
			cols[ cols.length ] = { title: "规则类型", name: "ruleType", width: "100px", lockWidth: true ,renderer:function (val, item, rowIndex){
				return base.code.getText( "Rule_Type", val );
			}};
			cols[ cols.length ] = { title: "规则说明", name: "ruleDet", width: "200px", lockWidth: true, mouseover:true };
			cols[ cols.length ] = { title: "备注", name: "ruleRemark", width: "300px", lockWidth: true, mouseover:true };
			that.vars.gridVar = that.selector.find( "#roleGrid" ).grid( config );//renderer
			
			
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		
		handlers.add = function(  ) {
			var that = this.global();
			that.page.open( {
				title: "规则设置 | 新增",
				url: "nucleus/bizconfig/sysrule/form",
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
				title: "规则设置 | 编辑",
				url: "nucleus/bizconfig/sysrule/form",
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
			that.dialog.confirm( "确定删除选择的[ " + items.length + " ]条数据？", function( event, index ) {
				if ( index == 1 ) return false;
				$.ajax( {
					url: "nucleus/bizconfig/sysrule/delete",
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
		
		handlers.openRuleManger = function ( item ){
			that.modal.open( {
				title: "规则设置 | 规则试算",
				url: "nucleus/bizconfig/sysrule/form",
				params: { item: item },
				size: "modal-lg",
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