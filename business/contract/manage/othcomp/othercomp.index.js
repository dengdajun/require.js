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
		code.cache( "Is_No" );
		
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
			//新增
			that.selector.find( "#addBtn" ).bind( "click", function( event ) {
				that.handlers.add();
				return false;
			} );
			//编辑
			that.selector.find( "#editBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.edit( items );
				return false;
			} );
			//合同模板添加
			that.selector.find( "#tmplAddBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.tmplAdd( items );
				return false;
			} );
			//删除
			that.selector.find( "#delBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.del( items );
				return false;
			} );
			
			var config = {
				remote: {
		        	url: "other/comp/list",
		        	params: {}
		        },
		        multi: true,
		        page: true,
		        query: {
		        	isExpand:true,
		        	target: that.selector.find( ".grid-query" )
		        },
		        plugins: [],
		        customEvents: []
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "机构编号", name: "compNo", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "机构名称", name: "compName", width: "100px", lockWidth: true ,mouseover:true};
			cols[ cols.length ] = { title: "机构地址", name: "compAddr", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "联系电话", name: "phone", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "邮箱", name: "email", width: "100px", lockWidth: true };
			that.vars.gridVar = that.selector.find( "#compGrid" ).grid( config );
		};
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {};
		
		//新增
		handlers.add = function(){
			var that = this.global();
			that.page.open( {
				title: "第三方机构 | 新增",
				url: "other/comp/form",
				size: "modal-lg",
				params: {},
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.gridVar.load();
					}
				}
			});
		}
		
		//编辑
		handlers.edit = function( items ) {
			if (!items || items.length != 1 ) {
				return message.error( "请选择一条操作数据。" );
			}
			var item = items[ 0 ]; //获取一条数据
			var that = this.global();
			that.page.open( {
				title: "第三方机构 | 编辑",
				url: "other/comp/form",
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
		
		//删除
		handlers.del = function(items){
			if(!items || items.length == 0){
				return message.error( "请至少选择一条操作数据。" );
			}
			var ids = [];
			$.each( items, function( index, item ) {
				ids.push( item.id );
			} ); 
			that.dialog.confirm( "确定删除选择的[ " + items.length + " ]条操作数据？", function( event, index ) {
				if ( index == 1 ) return false;
				$.ajax( {
					url: "other/comp/del",
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
			});
		}
		
		//模板添加
		handlers.tmplAdd = function(items){
			
		}
		
	};
	
	return Global;
} );