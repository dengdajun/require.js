define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
		var moment = require( "moment" );
		base.code.cache( "First_Pay_Type,Apply_Type,Is_No,Loan_Type,Aprov_Result" );
		
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
		};
		
		//初始化远程请求处理
		that.load = function() {
			var that = this.global();
			if ( !that.params.item ) return;
			that.handlers.loanMatchView(that.selector.find("#loanMatchView"));
			that.handlers.matchChan(that.selector.find("#matchChan"));
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			//关闭事件
			that.selector.find( "#closeBtn" ).click( function(event) {
				that.close();
				return false;
			});
			
			that.selector.find( ".input" ).input( {} );//实例input插件
		};
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		

		//动态加载页面
		handlers.loanMatchView = function(content){
			var that = this.global();
			var labelOfHidden = new Array();
			labelOfHidden =["capitalinfo","overdue"];//贷款视图要隐藏的lable
			that.params.item.labelOfHidden = labelOfHidden;
			that.module.open( {
			    url: "cust/manage/loan/index",
			    content: content,
			    params: {item:that.params.item},
			    events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.close();
					},
				}
			});
		};
		
		//资金渠道信息
		handlers.matchChan = function(content){
			var that = this.global();
			that.module.open( {
			    url: "appro/match/bLoLoanFundMatchLog/matchChan",
			    content: content,
			    params: {item:that.params.item},
			    events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.close();
					}
				}
			});
		};
		

	};
	
	return Global;
});