define(function() {
	var base = require( "app/base" )
		/*, message = base.message
		, tools = base.tools;
		, code = base.code*/;
	
return function ( vars ) {
	//=======================================================
	// 当前组件
	//=======================================================
	var that = this; //全局对象
	var vars = this.vars = {};//全局变梁
	var handlers = this.handlers = {};//处理程序
	handlers.global = function() { return that; };		
	
	//入口函数 java.main
	that.init = function(){
		that.layout();
//		that.load();
	};
	
	//页面渲染
	that.layout = function() {
		var that = this.global();//获取组件的全局对象
		
		that.selector.find( "#dbrw" ).bind( "click", function( event ) {
			that.handlers.disp_more("dbrw");
		} );
		
		that.selector.find( "#xtgg" ).bind( "click", function( event ) {
			that.handlers.disp_more1("xtgg");
		} );
		
		var config = {
				//style: "width:49.5%; float: left;",
				remote: {
		        	url: "approve/task/index",
		            params: {}
		        },
		        sort: false,
		        checkCol: false,
		        indexCol: false,
		        plugins: [],
		        events: {},
		        customEvents: []
			};
		config.cols = cols = [];
		cols[ cols.length ] = { title: "流程编号", name: "processKey", width: "80px", lockWidth: true};
		cols[ cols.length ] = { title: "申请部门", name: "applicantOrgname", width: "80px", lockWidth: true };
		cols[ cols.length ] = { title: "任务名称", name: "subject", width: "80px", lockWidth: true};
		cols[ cols.length ] = { title: "任务状态", name: "taskStat", width: "80px", lockWidth: true,
				renderer: function( val, item, rowIndex ) {
					if(val=="" || val==null)
						{
						return "";
						}
					if(val=="17100001")
						{
						  return "待处理";
						}
					else if(val=="17100002")
						{
						return "已处理";
						}
					else if(val=="17100003")
					{
					      return "已取消";
					}
					else
						{
						   return "驳回";
						}
					
				}	
		};	
		
		
		
		config.events.click = {
				handler: function( event, items, rowIndex ) {
					//item 当期行数据
					//rowIndex 当前行索引
					//处理其他逻辑
					that.page.open( {
						title: "任务 | 审批",
						url: "approve/process/index",
						size: "modal-lg",
						params: { item: items[0] },
						events: {
							hiden: function( closed, data ) {
								if ( !closed ) return;
								that.vars.gridtaskVar.load();
							}
						}
					} );
				}
			};
		
		that.vars.gridtaskVar = that.selector.find( "#agentinfo" ).grid( config );//renderer		
		
	};
	
	//页面加载
	that.load = function() {};
	
	
	//=======================================================
	// 业务逻辑申明
	//=======================================================
	handlers.load = function(){};
	
	handlers.disp_more = function( val ) {
		var that = this.global();
		
		var _title = "审批管理 | 所有任务";
		that.page.open( {
			title: _title,
			url: "approve/task/getall",
			size: "modal-lg",
			params: {
				flag_val: val
			},
			events: {
				hiden: function( closed, data ) {
					if ( !closed ) return;
					that.vars.gridtaskVar.load();
				}
			}
		} );
		
	};
};



	
});




