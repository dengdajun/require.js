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
		code.cache( "Branch_Type,Is_No" );
		
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
			
			that.selector.find( "input[name=chanNo]" ).select( {//实例下拉插件
				remote: {
					url: "operate/channel/receipts/rule",
					type: 'POST'
				}
			} );
			that.selector.find( "input[name=payDate]" ).datetimepicker({
				format : "YYYYMMDD"
			});
			that.selector.find( "input[name=batchNo]" ).datetimepicker({
				format : "YYYYMMDD"
			});
			that.selector.find( "input[name=begIntDate]" ).datetimepicker({
				format : "YYYYMMDD"
			});
			that.selector.find( "input[name=dueDate]" ).datetimepicker({
				format : "YYYYMMDD"
			});
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
			        	url: "operate/channel/receipts/list",
			            params: {}
			        },
			        multi: true,
			        page: true,
			        query: {
			        	isExpand:true,
			        	target: that.selector.find( ".bizChannelGrid" )
			        },
			        plugins: [],
			        events: {},
			        customEvents: []
				};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "渠道号", name: "chanNo", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "渠道名称", name: "chanName", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "批次号", name: "batchNo", width: "80px", lockWidth: true, mouseover:true };
			cols[ cols.length ] = { title: "总金额", name: "totalAmt", width: "80px", lockWidth: true,align:'center'};
			cols[ cols.length ] = { title: "放款日", name: "payDate", width: "100px", lockWidth: true,align:'center'};
			cols[ cols.length ] = { title: "起息日", name: "begIntDate", width: "100px", lockWidth: true,align:'center'};
			cols[ cols.length ] = { title: "到期日", name: "dueDate", width: "100px", lockWidth: true,align:'center'};
			cols[ cols.length ] = { title: "投资人利率", name: "invIntRate", width: "100px", lockWidth: true,align:'center' ,renderer : function (val, item, rowIndex){
				var invIntRate = val/100;
				return invIntRate.toFixed(4);
			}};
			cols[ cols.length ] = { title: "资方费率", name: "fundIntRate", width: "100px", lockWidth: true,align:'center' ,renderer : function (val, item, rowIndex){
				var fundIntRate = val/100;
				return fundIntRate.toFixed(4);
			}};
			cols[ cols.length ] = { title: "执行状态", name: "execFlag", width: "100px", lockWidth: true,align:'center',renderer : function (val, item, rowIndex){
				return base.code.getText("Is_No",val);
			}};
			cols[ cols.length ] = { title: "创建时间", name: "instDate", width: "150px", lockWidth: true, style:"text-align: center",
					renderer: function( val, item, rowIndex ) {return tools.dateUtil.format( item.instDate, "YYYY-MM-DD hh:mm:ss");}
			};
			
			config.events.click = {
				handler: function( event, item, rowIndex ) {
				}
			};
			
			config.customEvents.push( {
				target: ".pro-toggle",
				handler: function( event, item, rowIndex ) {
					that.handlers.toggle(item,event.currentTarget.text);
					return false;
				}
			} );
			
			
			that.vars.gridVar = that.selector.find( "#bizChannelGrid" ).grid( config );//renderer
		}
			
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {
			
		};
		handlers.add = function( item ) {
			var that = this.global();
			that.page.open( {
				title: "回执单管理 | 新增",
				url: "operate/channel/receipts/form",
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
			if(item.execFlag == '13900001'){
				return message.error( "该回执单已执行，不可以编辑" );
			}
			var that = this.global();
			that.page.open( {
				title: "回执单管理 | 编辑",
				url: "operate/channel/receipts/form",
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
					url: "operate/channel/receipts/del",
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