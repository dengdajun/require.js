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
			
			var config = {
				remote: {
		        	url: "jiufu/workorder/list",
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
			cols[ cols.length ] = { title: "工单号", name: "appId", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "工单状态", name: "appStatus", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "审批期限", name: "approveLimit", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "合同金额", name: "contractAmt", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "退回原因", name: "upBackReason", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "结束原因", name: "endReason", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "退回原因注释", name: "upBackReasonRemark", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "申请金额", name: "appayAmt", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "签约时间", name: "signDate", width: "150px", lockWidth: true, style:"text-align: center",
					renderer: function( val, item, rowIndex ) {return tools.dateUtil.format( item.signDate, "YYYY-MM-DD HH:mm:ss");}
			};
			cols[ cols.length ] = { title: "放款时间", name: "loanDate", width: "150px", lockWidth: true, style:"text-align: center",
					renderer: function( val, item, rowIndex ) {return tools.dateUtil.format( item.loanDate, "YYYY-MM-DD HH:mm:ss");}
			};
			cols[ cols.length ] = { title: "年化利率", name: "yearRate", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "平息利率", name: "monthRate", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "罚息利率", name: "punishRate", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "审批金额", name: "approveAmt", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "审批备注", name: "suggestRemark", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "插入时间", name: "instDate", width: "150px", lockWidth: true, style:"text-align: center",
					renderer: function( val, item, rowIndex ) {return tools.dateUtil.format( item.instDate, "YYYY-MM-DD HH:mm:ss");}
			};
			cols[ cols.length ] = { title: "插入人员编号", name: "instUserNo", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "更新时间", name: "updtDate", width: "150px", lockWidth: true, style:"text-align: center",
					renderer: function( val, item, rowIndex ) {return tools.dateUtil.format( item.updtDate, "YYYY-MM-DD HH:mm:ss");}
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