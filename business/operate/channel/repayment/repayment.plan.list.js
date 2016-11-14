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
					url: "operate/channel/fundChan/getSelectList",
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
			        	url: "operate/channel/repayment/planDetailList",
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
			cols[ cols.length ] = { title: "贷款编号", name: "loanNo", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "还款日期", name: "repayDate", width: "80px", lockWidth: true, mouseover:true };
			cols[ cols.length ] = { title: "还款期数", name: "repayNum", width: "80px", lockWidth: true,align:'center'};
			cols[ cols.length ] = { title: "投资人本金", name: "invPrinAmt", width: "100px", lockWidth: true,align:'center'};
			cols[ cols.length ] = { title: "投资人收益", name: "invIntAmt", width: "100px", lockWidth: true,align:'center'};
			cols[ cols.length ] = { title: "资方本金", name: "fundPrinAmt", width: "100px", lockWidth: true,align:'center'};
			cols[ cols.length ] = { title: "资方收益", name: "fundIntAmt", width: "100px", lockWidth: true,align:'center'};
			
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
			
			console.log(that.params.item);
			config.remote.params[ "params[chanNo]" ] = that.params.item["chanNo"];
			config.remote.params[ "params[repayDate]" ] = that.params.item["repayDate"];
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