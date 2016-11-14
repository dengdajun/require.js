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
		var moment = require( "moment" );
		
		//缓存码值
		code.cache( "Prod_Type", "Aprov_Result", "Loan_After","Source_Type","Source_User_Type","Source_Os_Type" );
		
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
			
			that.selector.find( "input[name=prodTyp]" ).select( {//实例下拉插件
				code: { type: "Prod_Type" }
			} );
			that.selector.find( "input[name=afterStat]" ).select( {//实例下拉插件
				code: { type: "Loan_After" }
			} );
			that.selector.find( "input[name=stat]" ).select( {//实例下拉插件
				code: { type: "Aprov_Result" }
			} );
			that.selector.find( "input[name=sourceType]" ).select( {//实例下拉插件
				code: { type: "Source_Type" }
			} );
			that.selector.find( "input[name=sourceUserType]" ).select( {//实例下拉插件
				code: { type: "Source_User_Type" }
			} );
			that.selector.find( "input[name=sourceOsType]" ).select( {//实例下拉插件
				code: { type: "Source_Os_Type" }
			} );
			that.selector.find( "input[name=startDate]" ).datetimepicker( {
				//maxDate: moment(that.vars.nowDate).format("YYYY-MM-DD")
			} );
			that.selector.find( "input[name=endDate]" ).datetimepicker( {
				//maxDate: moment(that.vars.nowDate).format("YYYY-MM-DD")
			} );
			that.selector.find( "input[name=startRegDate]" ).datetimepicker( {
				//maxDate: moment(that.vars.nowDate).format("YYYY-MM-DD")
			} );
			that.selector.find( "input[name=endRegDate]" ).datetimepicker( {
				//maxDate: moment(that.vars.nowDate).format("YYYY-MM-DD")
			} );
			that.selector.find( "input[name=chanNo]" ).select( {
				remote: {
					url: 'loan/manage/info/chanNoLst',
					type: 'POST'
				}
			} );
			
			that.selector.find( "input[name=prodNo]" ).select( {
				remote: {
					url: 'loan/manage/info/prodNoLst',
					type: 'POST'
				}
			} );
			
			that.selector.find( "input[name=orgCode]" ).selectTree( {
				multi: false,
				itemLabel: "orgName",
				itemValue: "orgCode",
				itemId: "id",
				itemPId: "parentId",
				itemOtherValues: [ "orgName:orgName"],
				remote: {
					url: "system/asysorg/queryOrgByParentOrgName",
					type: 'POST',
					data:{"params['parentOrgName']":"销售部"},
					params: {}
				},
				events: {
					change: {
						data: {},
						handler: function (event, val, item) {
							
						}
					}
				}
			} );
			
			that.selector.find( "input[name=fileNo]" ).select( {
				items: [{"label":"0","value":"0"},{"label":"1","value":"1"},{"label":"2","value":"2"},{"label":"3","value":"3"}]
			} );
			
			//贷款视图
			that.selector.find( "#manageGrid #queryBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.query(items);
				return false;
			} );
			
			var config = {
				remote: {
		        	url: "loan/manage/info/list",
		            params: {}
		        },
		        multi: false,
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
			cols[ cols.length ] = { title: "贷款编号", name: "loanNo", width: "200px", lockWidth: true ,mouseover: true};
			cols[ cols.length ] = { title: "客户名称", name: "custName", width: "70px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "身份证号码", name: "certNo", width: "170px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "产品类型", name: "prodTyp", width: "90px", lockWidth: true , style:"text-align: center",
					renderer:function(val,item,rowIndex){return base.code.getText("Prod_Type",val);}
			};
			cols[ cols.length ] = { title: "产品", name: "prodName", width: "90px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "渠道", name: "chanName", width: "90px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "来源客户端类型", name: "sourceType", width: "120px", lockWidth: true , style:"text-align: center",
					renderer:function(val,item,rowIndex){return base.code.getText("Source_Type",val);}
			};

			cols[ cols.length ] = { title: "贷款本金", name: "loanAmt", width: "120px", lockWidth: true, style:"text-align: right",
					renderer: function( val, item, rowIndex ) {return tools.moneyFromat(val, 2,"￥");}
			};
			cols[ cols.length ] = { title: "分期期数", name: "instNum", width: "70px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "每月还款日", name: "mthRepayDate", width: "90px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "月还款金额", name: "mthRepayAmt", width: "120px", lockWidth: true, style:"text-align: right",
					renderer: function( val, item, rowIndex ) {return tools.moneyFromat(val, 2,"￥");}
			};
			cols[ cols.length ] = { title: "贷前状态", name: "stat", width: "90px", lockWidth: true , style:"text-align: center",
					renderer:function(val,item,rowIndex){return base.code.getText("Aprov_Result",val);}
			};
			cols[ cols.length ] = { title: "贷后状态", name: "afterStat", width: "90px", lockWidth: true, style:"text-align: center",
					renderer:function(val,item,rowIndex){return base.code.getText("Loan_After",val);}
			};
			cols[ cols.length ] = { title: "申请日期", name: "applyDate", width: "110px", lockWidth: true, style:"text-align: center",	
					renderer: function( val, item, rowIndex ) {return tools.dateUtil.format( val, "YYYY-MM-DD" );}
			};
			cols[ cols.length ] = { title: "审批日期", name: "aprvDate", width: "110px", lockWidth: true, style:"text-align: center", 	
					renderer: function( val, item, rowIndex ) {return tools.dateUtil.format( val, "YYYY-MM-DD");}
			};
			cols[ cols.length ] = { title: "签约日期", name: "regDate", width: "110px", lockWidth: true, style:"text-align: center",
					renderer: function( val, item, rowIndex ) {return tools.dateUtil.format( val, "YYYY-MM-DD");}
			};
			cols[ cols.length ] = { title: "销售姓名", name: "staffName", width: "70px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "网点名称", name: "branchName", width: "200px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "挂单商户", name: "putBranchName", width: "200px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "档案编号", name: "fileNo", width: "70px", lockWidth: true, style:"text-align: center"};
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
			
			that.vars.gridVar = that.selector.find( "#manageGrid" ).grid( config );//renderer
			
			
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {
			
		};
		
		//加载贷款信息的展示页面
		handlers.query = function(items){
			if ( items.length != 1 ) {
				return message.error( "请选择一条操作数据。" );
			}
			
			var item = items[ 0 ]; //获取一条数据
			
			var that = this.global();
			that.page.open( {
				title: "贷款视图",
				url: "loan/manage/info/form",
				size: "modal-lg",
				params: { item: item },
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.gridVar.load();
					}
				}
			} );
		};
		
	};
	return Global;
	
} );