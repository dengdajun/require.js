define(function () { 
	
	function Global( vars ) {
		
		//=======================================================
		//获取基础组件
		//=======================================================
		var $ = require( "jquery" )
			, base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
		//base.code.cache( "yon" );
		
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
			
			that.selector.find( "#repaykindconfGrid #addBtn" ).bind( "click", function( event ) {
				that.handlers.add();
			} );
			that.selector.find( "#repaykindconfGrid #editBtn" ).bind( "click", function( event ) {
				var items = that.vars.repaykindconfGrid.selectedRows();
				that.handlers.edit( items );
				return false;
			} );
			that.selector.find( "#repaykindconfGrid #delBtn" ).bind( "click", function( event ) {
				var items = that.vars.repaykindconfGrid.selectedRows();
				that.handlers.del( items );
				return false;
			} );
			
			var repaykindconfGridConfig = {
				remote: {
		        	url: "nucleus/bizconfig/repaykindconf/list",
		            params: {}
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
			repaykindconfGridConfig.cols = cols = [];
			cols[ cols.length ] = { title: "编号", name: "repayNo", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "名称", name: "repayName", width: "200px", lockWidth: true };
			cols[ cols.length ] = { title: "规则", name: "ruleName", width: "200px", lockWidth: true };
			cols[ cols.length ] = { title: "备注", name: "repayRemark", width: "350px", lockWidth: true, mouseover:true };
			cols[ cols.length ] = { title: "操作", name: "id", width: "80px", lockWidth: true, renderer: function( val, item, rowIndex ) {
				return format( [ '<a href="javascript:;" class="open-calc"><i class="fa fa-calculator"></i> 试算</a>' ] )
			} };
			
			//自定义事件
			repaykindconfGridConfig.customEvents.push( {
				target: ".open-calc", //目标 选择器
				//data: "" //参数
				handler: function( event, item, rowIndex ) {
					//event.data 获取参数
					that.handlers.calc( item );
					return false;
				}
			} );
			that.vars.repaykindconfGrid = that.selector.find( "#repaykindconfGrid" ).grid( repaykindconfGridConfig );
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		
		handlers.add = function(  ) {
			var that = this.global();
			that.page.open( {
				title: "还款方式 | 新增",
				url: "nucleus/bizconfig/repaykindconf/form",
				size: "modal-lg",
				params: {},
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.repaykindconfGrid.load();
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
				title: "还款方式 | 编辑",
				url: "nucleus/bizconfig/repaykindconf/form",
				size: "modal-lg",
				params: { item: item },
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.repaykindconfGrid.load();
					}
				}
			} );
		};
		
		handlers.del = function( items ) {
			if ( items == null || items.length == 0 ) {
				return message.error( "请选择一条操作数据。" );
			}
			var ids = [];
			$.each( items, function( index, item ) {
				ids.push( item.id );
			} );
			that.dialog.confirm( "确定删除选择的[ " + items.length + " ]条数据？", function( event, index ) {
				if ( index == 1 ) return false;
				$.ajax( {
					url: "nucleus/bizconfig/repaykindconf/delete",
					type: "POST",
					data: { ids: ids },
					success: function( data ) {
						if ( !data.success ) {
							return message.error( data.msg );
						}
						message.success( data.msg );
						that.vars.repaykindconfGrid.load();
					}
				} );
			} );
		};
		
		handlers.calc = function( item ) {
			var that = this.global();
			that.modal.open( {
				title: "还款方式计算",
				url: "nucleus/bizconfig/repaykindconf/calc",
				size: "modal-xs",
				params: {
					item: item
				},
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.repaykindconfGrid.load();
					}
				}
			} );
		}
	};
	return Global;
} );