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
					url: "operate/channel/repayment/rule",
					type: 'POST'
				}
			} );
			that.selector.find( "input[name=transDate]" ).datetimepicker({
				format : "YYYYMMDD"
			});
			that.selector.find( "input[name=repayDate]" ).datetimepicker({
				format : "YYYYMMDD"
			});
			var config = {
					remote: {
			        	url: "operate/channel/repayment/list",
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
			cols[ cols.length ] = { title: "贷款编号", name: "loanNo", width: "80px", lockWidth: true, mouseover:true };
			cols[ cols.length ] = { title: "账单日", name: "repayDate", width: "80px", lockWidth: true,align:'center'};
			cols[ cols.length ] = { title: "交易日期", name: "transDate", width: "100px", lockWidth: true,align:'center'};
			cols[ cols.length ] = { title: "当前期数", name: "repayNum", width: "100px", lockWidth: true,align:'center'};
			cols[ cols.length ] = { title: "投资人利息金额", name: "rcvPrinAmt", width: "100px", lockWidth: true,align:'center'};
			cols[ cols.length ] = { title: "资方利息金额", name: "fundIntAmt", width: "60px", lockWidth: true,align:'center' };
			cols[ cols.length ] = { title: "投资人总费用", name: "invTotalAmt", width: "60px", lockWidth: true,align:'center' };
			cols[ cols.length ] = { title: "资方总费用", name: "fundTotalAmt", width: "60px", lockWidth: true,align:'center' };
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
	};
	return Global;
	
} );