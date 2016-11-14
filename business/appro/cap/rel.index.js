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
		
		var moment = require( "moment" );
		base.code.cache("Is_No,Cust_Type,Prod_Type,Prod_State");
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
		//验证组件
		that.valdiate = function() {
			var that = this.global(); 
			//jquery-validate 验证form表单元素
			that.vars.validator = that.selector.find( "form" ).validate( {
				rules: {
					flowId: { required: true }
				}
			} );
		};
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			//input
			that.selector.find( ".input" ).input( {} );
			
			that.selector.find( "input[name=ruleId]" ).select( {//实例下拉插件
				remote: {
					url: "appro/rel/rule",
					type: 'POST'
				}
			} );
			//btn
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
			
			var that = this.global();//获取组件的全局对象
			//区域
			var config = {
					remote: {
			        	url: "appro/rel/list",
			            params: {"params[flowId]":that.params.item.flowId}
			        },
			        multi: true,
			        page: {
			        	pageSize: 10
			        },
			        query: {
			        	isExpand:true,
			        	target: that.selector.find( ".grid-query" )
			        },
			        plugins: [],
			        customEvents: []
				};
			config.cols = cols = [];
				cols[ cols.length ] = { title: "审批流程编号", name: "flowId", width: "150px", lockWidth: true };
				cols[ cols.length ] = { title: "规则名称", name: "ruleName", width: "150px", lockWidth: true };
				cols[ cols.length ] = { title: "优先级", name: "rulePrior", width: "150px", lockWidth: true };
				cols[ cols.length ] = { title: "插入时间", name: "instDate", width: "100px", lockWidth: true,align:'center',
						renderer: function( val, item, rowIndex ) {return moment(val).format("YYYY-MM-DD");}
				};
			
			that.vars.gridVar = that.selector.find( "#gridVar" ).grid( config  );//renderer
			
			
		};
		
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {
			that.selector.find( ":input[name=flowId]" ).valChange( item.flowId );
		};
		handlers.add = function() {
			var that = this.global();
			that.page.open( {
				//title: "产品 | 新增",
				url: "appro/rel/form",
				size: "modal-lg",
				params: {item : that.params.item},
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
				//title: "产品 | 编辑",
				url: "appro/rel/form",
				size: "modal-lg",
				params: { item: item},
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.gridVar.load();
					}
				}
			} );
		};
		
		handlers.del = function( items ) {
			var that = this.global();
			if ( items == null || items.length == 0 ) {
				return message.error( "请选择一条操作数据。" );
			}
			var nos = [];
			$.each( items, function( index, item ) {
				nos.push( item.id );
			} );
			that.dialog.confirm( "确定删除选择的[ " + items.length + " ]条数据？", function( event, index ) {
				if ( index == 1 ) return false;
				that.loading.show();
				$.ajax( {
					url: "appro/rel/delete",
					type: "POST",
					data: { nos: nos},
					complete: function() {
						that.loading.hide();
					},
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