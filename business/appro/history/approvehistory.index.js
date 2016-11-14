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
		code.cache( "Prod_Type,Aprov_Result,Case_Appr_Stat" );
		
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
			that.selector.find( "input[name=startApprEndDate]" ).datetimepicker( {
				//maxDate: moment(that.vars.nowDate).format("YYYY-MM-DD")
			} );
			that.selector.find( "input[name=endApprEndDate]" ).datetimepicker( {
				//maxDate: moment(that.vars.nowDate).format("YYYY-MM-DD")
			} );
			//查看贷款信息
			that.selector.find( "#approveListGrid #loanBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.loanInfo(items);
				return false;
			} );
			
			var config = {
				remote: {
		        	url: "appro/history/info/list",
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
			cols[ cols.length ] = { title: "节点名称", name: "nodeNo", width: "120px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "贷款编号", name: "loanNo", width: "180px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "处理人", name: "apprName", width: "120px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "产品编号", name: "prodNo", width: "120px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "产品类型", name: "prodType", width: "120px", lockWidth: true , style:"text-align: center",
					renderer: function( val, item, rowIndex){return base.code.getText("Prod_Type",item.prodType)}

			};
			cols[ cols.length ] = { title: "客户姓名", name: "custName", width: "70px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "身份证号", name: "certNo", width: "180px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "进件次数", name: "instNum", width: "70px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "申请时间", name: "applyDate", width: "120px", lockWidth: true, style:"text-align: center",
					renderer: function( val, item, rowIndex ) {return tools.dateUtil.format( item.applyDate, "YYYY-MM-DD");}
			};
			cols[ cols.length ] = { title: "贷款状态", name: "loanStat", width: "120px", lockWidth: true, style:"text-align: center",
					renderer: function( val, item, rowIndex){return base.code.getText("Aprov_Result",item.loanStat)}
			};
			cols[ cols.length ] = { title: "审批状态", name: "apprStat", width: "120px", lockWidth: true, style:"text-align: center",
					renderer: function( val, item, rowIndex){return base.code.getText("Case_Appr_Stat",item.apprStat)}
			};
			cols[ cols.length ] = { title: "审批时间", name: "apprEndDate", width: "170px", lockWidth: true, style:"text-align: center",
					renderer: function( val, item, rowIndex){return val && tools.dateUtil.format( val, "YYYY-MM-DD HH:mm:ss");}
			};
			
			config.events.click = {
				handler: function( event, item, rowIndex ) {
					//item 当期行数据
					//rowIndex 当前行索引
					
					//处理其他逻辑
				}
			};
			
			config.customEvents.push( {
//				target: ".edit",
//				handler: function( event, item, rowIndex ) {
//					
//				}
			} );
			
			that.vars.gridVar = that.selector.find( "#approveListGrid" ).grid( config );//renderer
			
			
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {
			
		};
		
		//加载贷款信息的展示页面
		handlers.loanInfo = function(items){
			if ( items.length != 1 ) {
				return message.error( "请选择一条操作数据。" );
			}
			
			var item = items[ 0 ]; //获取一条数据
			
			var that = this.global();
			that.page.open( {
				title: "贷款视图",
				url: "appro/history/info/form",
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
	};
	return Global;
	
} );