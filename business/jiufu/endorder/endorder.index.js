define(function () { 
	
	function Global( vars ) {
		
		//=======================================================
		//获取基础组件
		//=======================================================
		var $ = require( "jquery" )
			, base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
		var moment = require( "moment" );
		base.code.cache( "Is_No" );
		
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
			
			that.selector.find( "#endOrderBtn" ).bind( "click", function( event ) {
				
				that.handlers.endOrder();
				return false;
			} );
			
			var orderGridConfig = {
				remote: {
		        	url: "jiufu/loan/order/list",
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
			orderGridConfig.cols = cols = [];
			cols[ cols.length ] = { title: "贷款编号", name: "loanNo", width: "200px", lockWidth: true,align:'center' };
			cols[ cols.length ] = { title: "工单号", name: "appId", width: "120px", lockWidth: true, align:'center',mouseover:true };
			cols[ cols.length ] = { title: "姓名", name: "custName", width: "120px", lockWidth: true,align:'center' };
			cols[ cols.length ] = { title: "客户身份证", name: "custCertNo", width: "200px", lockWidth: true,align:'center' };		
			cols[ cols.length ] = { title: "是否结束成功", name: "endStat", width: "100px", lockWidth: true,align:'center',
					renderer: function( val, item, rowIndex ) {return base.code.getText( "Is_No", val );}
			};
			cols[ cols.length ] = { title: "响应码", name: "respCode", width: "120px", lockWidth: true,align:'center' };	
			
			cols[ cols.length ] = { title: "响应信息", name: "respMsg", width: "200px", lockWidth: true,align:'center' };
			cols[ cols.length ] = { title: "结束时间", name: "instDate", width: "120px", lockWidth: true , style:"text-align: center",
					renderer:function(val,item,rowIndex){return item.instDate && moment(item.instDate).format("YYYY-MM-DD")}
			};
			cols[ cols.length ] = { title: "结束人", name: "instUserNo", width: "120px", lockWidth: true,align:'center' };
			cols[ cols.length ] = { title: "更新时间", name: "updtDate", width: "120px", lockWidth: true , style:"text-align: center",
					renderer:function(val,item,rowIndex){return item.updtDate && moment(item.updtDate).format("YYYY-MM-DD")}
			};
			cols[ cols.length ] = { title: "更新人", name: "updtUserNo", width: "120px", lockWidth: true,align:'center' };
			that.vars.orderGrid = that.selector.find( "#orderGrid" ).grid( orderGridConfig );
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		
		handlers.endOrder = function(  ) {
			var that = this.global();
			that.modal.open( {
				title: "结束工单",
				url: "jiufu/loan/order/form",
				size: "modal-lg",
				async: false,
				params: { item: that.params.item },
				events: {
					hiden: function( closed, data ) {	
						//if ( !closed ) return;
						that.vars.orderGrid.load();
					}
				}
			} );
		};
		
		
		
		
		
	};
	return Global;
} );