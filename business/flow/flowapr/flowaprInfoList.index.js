define(function () { 
	
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
			var that = this.global();//获取组件的全局对象
			
			var config = {
					style: "width:100%; float: left;",
					remote: {
			        	url: "flow/flowapr/aprinfolist",
			            params: {taskKey:that.params.taskKey}
			        },
			        checkCol: false,
			        multi: false,
			        page: false,
//			        query: {
//			        	target: that.selector.find( ".grid-query" )
//			        },
			        plugins: [],
			        events: {},
			        customEvents: []
				};
				config.cols = cols = [];
				cols[ cols.length ] = { title: "处理人", name: "executor",lockWidth: true };
				cols[ cols.length ] = { title: "处理节点", name: "nodeName",lockWidth: true };
				cols[ cols.length ] = { title: "处理时间", name: "endTm",lockWidth: true };
				cols[ cols.length ] = { title: "处理意见", name: "memo",lockWidth: true };
				cols[ cols.length ] = { title: "状态", name: "taskStat",lockWidth: true , renderer: function( val, item, rowIndex ) {
					return base.code.getText( "Pr_Eng_Task_Type", val );
				}  };
				
				
				config.events.click = {
						handler: function( event, items, rowIndex ) {
							var memo=items[0].memo;
							if((typeof memo=="undefined") || $.trim(memo).length==0)
								{
								    return;
								}
							that.dialog.alert(
							 {
								 title:"审批意见",
								 content:memo
							 }		
							)
						}
					};
				that.vars.gridVar = that.selector.find( "#aprInfoListgrid" ).grid( config );//renderer
		};
	};
	
	
	return Global;
});