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
		code.cache( "Appr_Type,Appr_Step,Is_No" );
		//=======================================================
		//当前组件
		//=======================================================
		var that = this;
		var vars = that.vars = $.extend( true, {}, vars );//全局变量
		var handlers = that.handlers = {};//处理程序
		handlers.global = function() { return that; };
		
		//组件入口函数  相当于java.main
		that.init = function() {
			this.layout(); 
			this.load();
		};
		
		//初始化远程请求处理
		that.load = function() {
			var that = this.global();
			if ( !that.params.item ) return;
			that.handlers.load( that.params.item );
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			that.selector.find( ".input" ).input( {} );//实例input插件
			
			that.selector.find( "input[name=isLastNode]" ).select( {//实例下拉插件
				code: { type: "Is_No" }
			} );
			that.selector.find( "input[name=apprType]" ).select( {//实例下拉插件
				code: { type: "Appr_Type" }
			} );
			that.selector.find( "input[name=apprStep]" ).select( {//实例下拉插件
				code: { type: "Aprov_Step" }
			} );
			that.selector.find( "#addBtn" ).bind( "click", function( event ) {
				that.handlers.add(that.params.item);
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
		        	url: "appro/cap/listnode",
		            params: {}
		        },
		        multi: true,
		        page: true,
		        query: {
		        	target: that.selector.find( ".grid-query" )
		        },
		        plugins: [],
		        events: {},
		        customEvents: []
			};
			config.cols = cols = [];

			cols[ cols.length ] = { title: "岗位", name: "post", width: "80px", lockWidth: true };
			cols[ cols.length ] = { title: "节点编码", name: "nodeNo", width: "120px", lockWidth: true };
			cols[ cols.length ] = { title: "节点名称", name: "nodeNames", width: "80px", lockWidth: true };
			cols[ cols.length ] = { title: "节点顺序", name: "nodeOrder", width: "80px", lockWidth: true };
			cols[ cols.length ] = { title: "是否最后节点", name: "isLastNode", width: "120px", lockWidth: true ,align:'center',
					renderer:function(val,item,rowIndex){return base.code.getText("Is_No",val);}};
			cols[ cols.length ] = { title: "审批类型", name: "apprType", width: "100px", lockWidth: true ,align:'center',
					renderer:function(val,item,rowIndex){return base.code.getText("Appr_Type",val);}};
			cols[ cols.length ] = { title: "审批阶段", name: "apprStep", width: "100px", lockWidth: true ,align:'center',
					renderer:function(val,item,rowIndex){return base.code.getText("Appr_Step",val);}};
			cols[ cols.length ] = { title: "规则编码", name: "ruleId", width: "120px", lockWidth: true };
			cols[ cols.length ] = { title: "分配规则编码", name: "disRuleId", width: "120px", lockWidth: true };
			cols[ cols.length ] = { title: "审批组编号", name: "groupNo", width: "120px", lockWidth: true };
			cols[ cols.length ] = { title: "审批界面", name: "url", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "创建时间", name: "instDate", width: "100px", lockWidth: true, style:"text-align: center",
					renderer: function( val, item, rowIndex ) {return tools.dateUtil.format( item.instDate, "YYYY-MM-DD hh:mm:ss");}
			};
			if ( that.params.item ) {
				config.remote.params["params[id]"] = that.params.item.id;
				config.remote.params["params[flowId]"] = that.params.item.flowId;
				config.remote.params["params[flowName]"] = that.params.item.flowName;
			}
			config.events.click = {
				handler: function( event, item, rowIndex ) {
					//item 当期行数据
					//rowIndex 当前行索引
					
					//处理其他逻辑
				}
			};
			
			config.customEvents.push( {
				target: ".edit",
				handler: function( event, item, rowIndex ) {
					
				}
			} );
			
			that.vars.gridVar = that.selector.find( "#userGrid" ).grid( config );//renderer
			
			
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {
			that.selector.find( ":input[name=flowId]" ).valChange( data.flowId );
			that.selector.find( ":input[name=flowName]" ).valChange( data.flowName );
		};
		
		//用户组-组员添加
		handlers.add = function(item) {
			var that = this.global();
			that.page.open( {
				title: "审批流程管理 | 组员添加",
				url: "appro/cap/formnode",
				size: "modal-lg",
				params: {item:item},
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
				title: "节点管理 | 编辑",
				url: "appro/cap/formupdate",
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
					url: "appro/cap/deletenode",
					type: "POST",
					data: { ids: ids},
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