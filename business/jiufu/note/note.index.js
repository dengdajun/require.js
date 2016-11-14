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
			that.selector.find( ".input" ).input( {} );//实例input插件
			
			that.selector.find( "input[name=instDateBegin]" ).datetimepicker( {
				//maxDate: moment(that.vars.nowDate).format("YYYY-MM-DD")
			} );
			that.selector.find( "input[name=instDateEnd]" ).datetimepicker( {
				//maxDate: moment(that.vars.nowDate).format("YYYY-MM-DD")
			} );
			that.selector.find( "input[name=isSucceed]" ).select( {//实例下拉插件
				code: { type: "Is_No" }
			} );
			var config = {
				remote: {
		        	url: "jiufu/note/list",
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
			cols[ cols.length ] = { title: "贷款编号", name: "loanNo", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "贷前状态", name: "isSucceed", width: "90px", lockWidth: true , style:"text-align: center",
					renderer:function(val,item,rowIndex){return base.code.getText("Is_No",val);}
			};
			cols[ cols.length ] = { title: "导入失败信息", name: "errorMsg", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "插入者", name: "instUserNo", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "导入时间", name: "instDate", width: "150px", lockWidth: true, style:"text-align: center",
					renderer: function( val, item, rowIndex ) {return tools.dateUtil.format( item.instDate, "YYYY-MM-DD hh:mm:ss");}
			};
			cols[ cols.length ] = { title: "更新时间", name: "updtDate", width: "150px", lockWidth: true, style:"text-align: center",
					renderer: function( val, item, rowIndex ) {return tools.dateUtil.format( item.updtDate, "YYYY-MM-DD hh:mm:ss");}
			};
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
			
			that.vars.gridVar = that.selector.find( "#userGroupGrid" ).grid( config );//renderer
			
			
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {
		};
		
		
	};
	
	return Global;
	
} );