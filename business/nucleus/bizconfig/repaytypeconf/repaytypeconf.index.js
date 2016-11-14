define(function (){
	function Global( vars ){
		//=======================================================
		//获取基础组件
		//=======================================================
		var $ = require( "jquery" )
			, base = require( "app/base" )
			, message = base.message
			, code = base.code
			, tools = base.tools;
		
		code.cache( "orgLevel,orgType,stat" );
		//=======================================================
		//当前组件
		//=======================================================
		var that = this;
		var vars = that.vars = $.extend( true, {}, vars );//全局变量
		var handlers = that.handlers = {};//处理程序
		handlers.global = function() { return that; };
		
		//组件入口函数  相当于java.main
		that.init = function() {
			var that = this.global();
			that.layout(); 
		};
		
		//初始化远程请求处理
		that.load = function() {};
		
		//页面布局 绑定事件
		that.layout = function (){
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
			
			var config = {
				remote: {
		        	url: "nucleus/bizconfig/repaytypeconf/list",
		            params: {}
		        },
		        multi: false,
		        page: true,
		        query: {
		        	isExpand:true,
		        	target: that.selector.find( ".grid-query" )
		        },
		        customEvents: [],
		        plugins: []
			};
			
			config.cols = cols = [];
			cols[ cols.length ] = { title: "编号", name: "confNo", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "名称", name: "confName", width: "200px", lockWidth: true };
			cols[ cols.length ] = { title: "规则", name: "ruleName", width: "200px", lockWidth: true };
			cols[ cols.length ] = { title: "还款条件", name: "repayCond", width: "200px", lockWidth: true };
			cols[ cols.length ] = { title: "备注", name: "confRemark", width: "300px", lockWidth: true, mouseover:true };
			cols[ cols.length ] = { title: "操作", name: "id", width: "80px", lockWidth: true, renderer: function( val, item, rowIndex ) {
				return format( [ '<a href="javascript:;" class="open-group-manager"><i class="fa fa-calculator"></i> 试算</a>' ] )
			} };
			
			config.customEvents.push({
				target: ".open-group-manager", //目标 选择器
				//data: "" //参数
				handler: function( event, item, rowIndex ) {
					//event.data 获取参数
					that.handlers.openRuleManger( item );
					return false;
				}
			});
			that.vars.gridVar = that.selector.find( "#roleGrid" ).grid( config );//renderer
		};
		
		//业务逻辑实现
		handlers.add = function(  ) {
			var that = this.global();
			that.page.open( {
				title: "还款类型配置 | 新增",
				url: "nucleus/bizconfig/repaytypeconf/form",
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
				title: "还款类型配置 | 编辑",
				url: "nucleus/bizconfig/repaytypeconf/form",
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
					url: "nucleus/bizconfig/repaytypeconf/delete",
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
			if ( item == null || item.length == 0 ) {
				return message.error( "请选择至少一条操作数据。" );
			}
			that.modal.open( {
				title: "还款类型 | 试算",
				url: "nucleus/bizconfig/repaytypeconf/toCalc",
				params: { item: item },
				size: "ws",
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.gridVar.load();
					}
				}
			} );
		}
	};
	
	return Global;
});