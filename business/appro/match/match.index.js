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
		base.code.cache( "Is_No","Match_Result","Match_Type" );
		
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
			
			that.selector.find( "input[name=osType]" ).select( {//实例下拉插件
				code: { type: "Os_Type" }
			} ); 
			
			that.selector.find( "input[name=prodNo]" ).select( {//实例下拉插件
				remote: {
					url: 'loan/manage/info/prodNoLst',
					type: 'POST'
				}
			} ); 
			
			that.selector.find( "input[name=chanNo]" ).select( {//实例下拉插件
				remote: {
					url: 'loan/manage/info/chanNoLst',
					type: 'POST'
				}
			} ); 
			
			that.selector.find( "input[name=startDate]" ).datetimepicker( {
				//maxDate: moment(that.vars.nowDate).format("YYYY-MM-DD")
			} );
			that.selector.find( "input[name=endDate]" ).datetimepicker( {
				//maxDate: moment(that.vars.nowDate).format("YYYY-MM-DD")
			} );
			
			that.selector.find( ".input" ).input( {} );//实例input插件
			
			that.selector.find( "#editBtn" ).bind( "click", function( event ) {
				var items = that.vars.matchLogGrid.selectedRows();
				//console.log(items);
				that.handlers.edit( items );
				return false;
			} );
			that.selector.find( "#fundMatchedGrid #matchBtn" ).bind( "click", function( event ) {
				var items = that.vars.fundMatchedGrid.selectedRows();
				that.handlers.match( items );
				return false;
			} );
			//待匹配资金
			var fundMatchedGridConfig = {
				remote: {
		        	url: "appro/match/bLoLoanFundMatchLog/process",
		            params: {}
		        },
		        multi: false,
		        page: {
		        	pageSize: 5
		        },
		        query: {
		        	isExpand:true,
		        	target: that.selector.find( "#match-grid-query" )
		        },
		        plugins: [],
		        customEvents: []
			};
			fundMatchedGridConfig.cols = cols = [];
			cols[ cols.length ] = { title: "贷款编号", name: "loanNo", width: "170px", lockWidth: true,align:'center' };
			cols[ cols.length ] = { title: "客户姓名", name: "custName", width: "70px", lockWidth: true,align:'center' };
			cols[ cols.length ] = { title: "身份证", name: "certNo", width: "180px", lockWidth: true,align:'center' };
			cols[ cols.length ] = { title: "产品", name: "prodName", width: "120px", lockWidth: true, align:'center',mouseover:true };
			cols[ cols.length ] = { title: "产品类型", name: "prodTyp", width: "120px", lockWidth: true, align:'center',mouseover:true,
					renderer: function( val, item, rowIndex){return base.code.getText("Prod_Type",item.prodTyp)}		
			};
			cols[ cols.length ] = { title: "贷款金额", name: "loanAmt", width: "120px", lockWidth: true, style:"text-align: center",
				//	renderer: function( val, item, rowIndex){return  tools.moneyFromat(item.loanAmt)}
			};
			cols[ cols.length ] = { title: "申请日期", name: "applyDate", width: "120px", lockWidth: true , style:"text-align: center",
					renderer:function(val,item,rowIndex){return moment(item.applyDate).format("YYYY-MM-DD")}
			};
			cols[ cols.length ] = { title: "处理人", name: "apprName", width: "120px", lockWidth: true,align:'center' };
			that.vars.fundMatchedGrid = that.selector.find( "#fundMatchedGrid" ).grid( fundMatchedGridConfig );
			
			//已匹配资金
			var matchLogGridConfig = {
				remote: {
		        	url: "appro/match/bLoLoanFundMatchLog/list",
		            params: {}
		        },
		        multi: false,
		        page: {
		        	pageSize: 5
		        },
		        query: {
		        	isExpand:true,
		        	target: that.selector.find( "#log-grid-query" )
		        },
		        plugins: [],
		        customEvents: []
			};
			matchLogGridConfig.cols = cols = [];
			cols[ cols.length ] = { title: "贷款编号", name: "loanNo", width: "170px", lockWidth: true,align:'center' };
			cols[ cols.length ] = { title: "贷款金额", name: "loanAmt", width: "120px", lockWidth: true, style:"text-align: center",
						//renderer: function( val, item, rowIndex){return  tools.moneyFromat(item.loanAmt, 2)}
			};
			cols[ cols.length ] = { title: "匹配资方", name: "chanName", width: "120px", lockWidth: true, align:'center',mouseover:true };
			cols[ cols.length ] = { title: "匹配结果", name: "matchResult", width: "100px", lockWidth: true,align:'center',
					renderer:function(val,item,rowIndex){return base.code.getText("Match_Result",val);}
			};
			cols[ cols.length ] = { title: "客户姓名", name: "custName", width: "100px", lockWidth: true, align:'center',mouseover:true };
			cols[ cols.length ] = { title: "身份证", name: "certNo", width: "170px", lockWidth: true,align:'center' };
			cols[ cols.length ] = { title: "产品", name: "prodName", width: "120px", lockWidth: true, align:'center',mouseover:true };
			cols[ cols.length ] = { title: "处理人", name: "apprName", width: "120px", lockWidth: true, align:'center',mouseover:true };
			cols[ cols.length ] = { title: "匹配时间", name: "matchDate", width: "100px", lockWidth: true , style:"text-align: center",
					renderer:function(val,item,rowIndex){return moment(item.matchDate).format("YYYY-MM-DD")}
			};
			cols[ cols.length ] = { title: "备注", name: "remark", width: "150px", lockWidth: true, align:'center',mouseover:true };
			
			that.vars.matchLogGrid = that.selector.find( "#matchLogGrid" ).grid( matchLogGridConfig );
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		
		
		
		
		handlers.match = function( items ) {
			if ( items.length != 1 ) {
				return message.error( "请选择一条操作数据。" );
			}
			var item = items[ 0 ]; //获取一条数据
			var that = this.global();
			that.page.open( {
				title: "资金匹配 | 资金匹配详细信息",
				url: "appro/match/bLoLoanFundMatchLog/form",
				size: "modal-lg",
				params: { item: item },
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.fundMatchedGrid.load();//待匹配刷新
						that.vars.matchLogGrid.load();//已匹配刷新
					}
				}
			} );
		};
		
		handlers.edit = function( items ) {
			if ( items.length != 1 ) {
				return message.error( "请选择一条操作数据。" );
			}
			var item = items[ 0 ]; //获取一条数据
			var that = this.global();
			//console.log(items);
			that.page.open( {
				title: "资金匹配 | 已匹配资金信息",
				url: "appro/match/bLoLoanFundMatchLog/info",
				size: "modal-lg",
				params: { item: item },
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.fundMatchedGrid.load();
					}
				}
			} );
		};
		
		
		
		
	};
	return Global;
} );