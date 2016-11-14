define( [ "myflow.editors" ], function () {
	//可以为省略 会有默认值
	//$.myflow.config.absolutePath = "assets/component/myflow-min/myflow";
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
		
		var moment = require( "moment" );
		
		//=======================================================
		// 当前组件
		//=======================================================
		var that = this; //全局对象
		var vars = this.vars = {};//全局变梁
		var handlers = this.handlers = {};//处理程序
		handlers.global = function() { return that; };
		
		//组件入口函数  相当于java.main
		that.init = function() {
			this.layout();
			this.load();
			this.valdiate();
		};
		
		//初始化远程请求处理
		that.load = function() {
			var that = this.global();
		};
		
		//验证组件
		that.valdiate = function() {
			var that = this.global(); 
			//jquery-validate 验证form表单元素
			that.vars.validator = that.selector.find( "form" ).validate( {
				rules: {
				}
			} );
		};
		
		//页面布局
		that.layout = function() {
			that.handlers.workflowchart();
//			that.selector.find('#myflow')
//			.myflow(
//				$.extend(
//					true,
//					{
//					basePath : "",
//					restore : eval(
//						"({" 
//							+"states:" 
//							+ "{" 
//								+"rect1:{type:'task',text:{text:'任务1'}, attr:{ x:10, y:100, width:100, height:50}, props:{text:{value:'任务1'},assignee:{value:''},form:{value:''},desc:{value:''}}},"
//								+"rect2:{type:'task',text:{text:'任务2'}, attr:{ x:210, y:100, width:100, height:50}, props:{text:{value:'任务2'},assignee:{value:''},form:{value:''},desc:{value:''}}}," 
//								+"rect3:{type:'task',text:{text:'任务3'}, attr:{ x:410, y:100, width:100, height:50}, props:{text:{value:'任务3'},assignee:{value:''},form:{value:''},desc:{value:''}}}," 
//								+"rect4:{type:'task',text:{text:'任务4'}, attr:{ x:610, y:100, width:100, height:50}, props:{text:{value:'任务4'},assignee:{value:''},form:{value:''},desc:{value:''}}},"
//								+"rect5:{type:'task',text:{text:'任务5'}, attr:{ x:810, y:100, width:100, height:50}, props:{text:{value:'任务5'},assignee:{value:''},form:{value:''},desc:{value:''}}}," 
//								+"rect6:{type:'task',text:{text:'任务6'}, attr:{ x:1010, y:100, width:100, height:50}, props:{text:{value:'任务6'},assignee:{value:''},form:{value:''},desc:{value:''}}}," 
//								+"rect7:{type:'task',text:{text:'任务7'}, attr:{ x:1210, y:100, width:100, height:50}, props:{text:{value:'任务7'},assignee:{value:''},form:{value:''},desc:{value:''}}}" 
//							+"}," 
//							+"paths:{" 
//								+"path1:{from:'rect1',to:'rect2', dots:[],text:{text:'TO 任务2'},textPos:{x:-5,y:0}, props:{text:{value:''}}}," 
//								+"path2:{from:'rect2',to:'rect3', dots:[],text:{text:'TO 任务3'},textPos:{x:-5,y:0}, props:{text:{value:''}}}," 
//								+"path3:{from:'rect2',to:'rect4', dots:[{x:260,y:25}, {x:660,y:25}],text:{text:'TO 任务4'},textPos:{x:-5,y:0}, props:{text:{value:''}}}," 
//								+"path4:{from:'rect3',to:'rect4', dots:[],text:{text:'TO 任务4'},textPos:{x:-5,y:0}, props:{text:{value:''}}}," 
//								+"path5:{from:'rect4',to:'rect5', dots:[],text:{text:'TO 任务5'},textPos:{x:-5,y:0}, props:{text:{value:''}}}," 
//								+"path6:{from:'rect4',to:'rect6', dots:[{x:660,y:70}, {x:1060,y:70}],text:{text:'TO 任务6'},textPos:{x:-5,y:0}, props:{text:{value:''}}}," 
//								+"path7:{from:'rect5',to:'rect6', dots:[],text:{text:''},textPos:{x:-5,y:0}, props:{text:{value:''}}}," 
//								+"path8:{from:'rect6',to:'rect7', dots:[],text:{text:'TO 任务7'},textPos:{x:-5,y:0}, props:{text:{value:''}}}," 
//								+"path9:{from:'rect7',to:'rect4', dots:[{x:1260,y:220}, {x:660,y:220}],text:{text:'TO 任务4'},textPos:{x:0,y:-10}, props:{text:{value:'TO 任务4'}}}"
//							+"}," 
//							+"props:{" 
//								+"props:{name:{value:'新建流程'},key:{value:''},desc:{value:''}}"
//							+"}" 
//						+"})"),
//					editable : false
//					},
//					{
//						'activeRects':{'rects':[{'paths':[],'name':'任务4'}]},
//						'historyRects':{
//							'rects':[
//						         {'paths':['TO 任务2'],'name':'任务1'},{'paths':['TO 任务4'],'name':'任务2'}
//						     ]
//						}
//					}
//				)
//			);
		};
		
		handlers.workflowchart = function()
		{
			var that = this.global();
			var data = [];
			data.push("params[taskKey]=" + that.params.taskKey);
			data.push("params[templateKey]=" + that.params.templateKey);
			
			$.ajax( {
				url: "flow/flowapr/workflowchartdata",
				type: "POST",
				data: data.join("&"),
				complete: function() {
//					that.loading.hide();
				},
				success: function( data ) {
					
					if ( !data.success ) {
						return message.error( data.msg );
					}
					
					var node_path = data.map.node_path;
					var act_his = data.map.act_his;
					
					var page_width = data.map.flow_chart_width_len;
					var page_height = data.map.flow_chart_height_len;
					
					that.selector.find('#myflow')
					.myflow(
						$.extend(
							true,
							{
							width:page_width,
							height:page_height,
							basePath:"",
							restore:eval("(" + node_path + ")"),
							editable:false
							},
							 eval("(" + act_his + ")")
						)
					);
				}
			} );
		}
	};
	
	
	return Global;
});