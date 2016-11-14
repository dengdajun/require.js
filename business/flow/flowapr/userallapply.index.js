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
		
		//that.selector.find( ".input" ).input( {} );//实例input插件
		
		var config = {
				//style: "width:100%; float: left;",
				remote: {
		        	url: "approve/task/getallapplylist",
		            params: {}
		        },
		        sort: false,
		        checkCol: false,
		        indexCol: true,
		        plugins: [],
		        events: {},
		        customEvents: []
			};
		config.cols = cols = [];
		cols[ cols.length ] = { title: "流程编号", name: "processKey", width: "80px", lockWidth: true};
		cols[ cols.length ] = { title: "受理状态", name: "processStat", width: "80px", lockWidth: true ,
				renderer: function( val, item, rowIndex ) {
					if(val=="" || val==null)
						{
						return "";
						}
					if(val=="17200001")
						{
						  return "运行中";
						}
					else if(val=="17200002")
						{
						return "已完成";
						}
					else if(val=="17200003")
					{
					      return "已取消";
					}
					
				}	
		};	
		cols[ cols.length ] = { title: "任务名称", name: "subject", width: "80px", lockWidth: true};	
		cols[ cols.length ] = { title: "开始时间", name: "startTm", width: "80px", lockWidth: true};	
		cols[ cols.length ] = { title: "结束时间", name: "endTm", width: "80px", lockWidth: true};	

		config.events.click = {
				handler: function( event, items, rowIndex ) {
					//item 当期行数据
					//rowIndex 当前行索引
					//处理其他逻辑
					var item=items[0];
					
					var datamap={};
				    $.ajax( {
						url: "approve/process/getprocessinfo",
						type: "POST",
						data: { id: item.busiKey },
						success: function( data ) {
							if ( !data.success ) {
								return message.error( data.msg );
							}		
							datamap=data.map;
							item.url=datamap.url;
							item.taskKey=datamap.taskKey;
							item.taskStat=datamap.taskStat;
							if(datamap.applicantNo==datamap.executorNo){
								if(item.taskStat=="17100002" || item.taskStat=="17100003"){
									item.busiui=true;
								}
								else
									{
									 item.busiui=false;
									}
							}
							else{
								item.busiui=true;
							}
							that.page.open( {
								title: "审批详情",
								url: "approve/process/index",
								size: "modal-lg",
								params: { item: item },
								events: {
									hiden: function( closed, data ) {
										if ( !closed ) return;
										that.vars.gridtaskVar.load();
									}
								}
							} );
							
							return data;
						}
					} );
				}
			};
		
		that.vars.gridtaskVar = that.selector.find( "#allgrad" ).grid( config );//renderer
		
		
//		var config2 = {
//				style: "width:49.5%; float: right;",
//				remote: {
//		        	url: "aanncmnginfo/aanncmnginfo/querybycondition",
//		            params: {}
//		        },
//		        sort: false,
//		        checkCol: false,
//		        indexCol: false,
//		        plugins: [],
//		        events: {},
//		        customEvents: []
//			};
//
//		config2.cols = cols2 = [];
//		cols2[ cols2.length ] = { title: "标题", name: "title", width: "80px", lockWidth: true };
//		cols2[ cols2.length ] = { title: "发布时间", name: "insertDate", width: "80px", lockWidth: true};
//		cols2[ cols2.length ] = { title: "发布者", name: "publisher", width: "80px", lockWidth: true};
//		
//		config2.events.click = {
//				handler: function( event, items, rowIndex ) {
//					//item 当期行数据
//					//rowIndex 当前行索引
//					//处理其他逻辑
//					that.page.open( {
//						title: "公告管理 | 公告详情",
//						url: "aanncmnginfo/aanncmnginfo/view",
//						size: "modal-lg",
//						params: { item: items[0] },
//						events: {
//							hiden: function( closed, data ) {
//								if ( !closed ) return;
////								that.vars.gridVar.load();
//							}
//						}
//					} );
//				}
//			};
		
		
//		that.vars.gridVar = that.selector.find( "#roleGrid2" ).grid( config2 );//renderer
		
	};
	
	//页面加载
	that.load = function() {};
	
	
	//=======================================================
	// 业务逻辑申明
	//=======================================================
	handlers.load = function(){};
	
	handlers.disp_more = function( val ) {
//		var that = this.global();
//		
//		var _title = "案件管理 | 待办任务";
//		if(val == "xtgg")
//			_title = "公告管理| 公告";
//		
//		that.page.open( {
//			title: _title,
//			url: "safety/sysinfo/index",
//			size: "modal-lg",
//			params: {
//				flag_val: val
//			},
//			events: {
//				hiden: function( closed, data ) {
//					if ( !closed ) return;
//					that.vars.gridVar.load();
//				}
//			}
//		} );
		
	};
};


	
});


//function  disp_more(val)
//{
//	alert("11111");
//	var that = this.global();//获取组件的全局对象
//	that.page.open( {
//		title: "案件管理 | 编辑",
//		url: "safety/sysinfo/index",
//		size: "modal-lg",
//		events: {
//			hiden: function( closed, data ) {
//				if ( !closed ) return;
//				that.vars.gridVar.load();
//			}
//		}
//	} );
//}

