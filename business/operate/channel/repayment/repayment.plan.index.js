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
			
			that.selector.find("#planDetail").bind("click",function ( event ){
				 var items = that.vars.planListGrid.selectedRows();
				 that.handlers.planList(items);
				 return false;
			});
			
			that.selector.find("#exportDayBtn").bind("click",function ( event ){
				 that.handlers.exportDay();
				 return false;
			});
			
			that.selector.find("#exportMonthBtn").bind("click",function ( event ){
				 that.handlers.exportMonth();
				 return false;
			});
			
			that.selector.find( "input[name=stat]" ).select( {//实例下拉插件
				code: { type: "Sett_Stat" }
			} );
			
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
		        	url: "operate/channel/repayment/list",
		            params: {}
		        },
		        multi: false,
		        page: {
		        	pageSize: 5
		        },
		        query: {
		        	isExpand:true,
		        	target: that.selector.find( ".bizChannelGrid" )
		        },
		        plugins: [],
		        events:{
		        	loaded: {
		        		handler: function( event, items ) {
		        			that.vars.gridVar.select( 0 );
		        			var item = items[ 0 ] || { typeCode: "$NO$" };
		        			var params = {"params[chanNo]": item.chanNo,"params[repayDate]":item.repayDate};
		        			that.vars.planListGrid.load(params);
		        		}
		        	},
		        	click: {
		        		 handler: function (event, items, rowIndex) {
		        			 var item = items[ 0 ] || { typeCode: "$NO$" };
		        			 var params = {"params[chanNo]": item.chanNo,"params[repayDate]":item.repayDate};
			        		 that.vars.planListGrid.load(params);
		        		 }
		        	}
		        },
		        customEvents: []
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "资金渠道", name: "chanName", width: "80px", lockWidth: true, mouseover:true };
			cols[ cols.length ] = { title: "还款日", name: "repayDate", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "还款本金", name: "repayPrinAmt", width: "80px", lockWidth: true,align:'center'};
			cols[ cols.length ] = { title: "月还款额", name: "repayTotalAmt", width: "100px", lockWidth: true,align:'center'};
			cols[ cols.length ] = { title: "投资人收益", name: "invIntAmt", width: "100px", lockWidth: true,align:'center'};
			cols[ cols.length ] = { title: "信息服务费", name: "fundIntAmt", width: "100px", lockWidth: true,align:'center'};
			cols[ cols.length ] = { title: "汇总笔数", name: "repayCnt", width: "60px", lockWidth: true,align:'center' };
			
			config.customEvents.push( {
				target: ".pro-toggle",
				handler: function( event, item, rowIndex ) {
					that.handlers.toggle(item,event.currentTarget.text);
					return false;
				}
			} );
			
			that.vars.gridVar = that.selector.find( "#bizChannelGrid" ).grid( config );//renderer
			
			///还款计划
			
			var planListConfig = {
				remote: {
		        	url: "operate/channel/repayment/planlist",
		        	params: {}
		        },
		        query: {
		        	isExpand:true,
		        	target: that.selector.find( ".repaymentPlanGrid" )
		        },
		        autoLoad:false,
		        multi: false,
		        page: {
		        	pageSize: 5
		        }
			};
			planListConfig.cols = cols = [];
			cols[ cols.length ] = { title: "批次号", name: "batchNo", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "资金渠道", name: "chanName", width: "80px", lockWidth: true, mouseover:true };
			cols[ cols.length ] = { title: "还款期数", name: "repayNum", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "还款日", name: "repayDate", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "还款本金", name: "repayPrinAmt", width: "80px", lockWidth: true,align:'center'};
			cols[ cols.length ] = { title: "月还款额", name: "repayTotalAmt", width: "100px", lockWidth: true,align:'center'};
			cols[ cols.length ] = { title: "投资人收益", name: "invIntAmt", width: "100px", lockWidth: true,align:'center'};
			cols[ cols.length ] = { title: "信息服务费", name: "fundIntAmt", width: "100px", lockWidth: true,align:'center'};
			cols[ cols.length ] = { title: "结算状态", name: "stat", width: "100px", lockWidth: true,align:'center',
					renderer:function(val,item,rowIndex){return base.code.getText("Sett_Stat",val);}};
			
			that.vars.planListGrid = that.selector.find( "#repaymentPlanList" ).grid( planListConfig );
		};
			
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {
			
		};
		
		
		handlers.planList = function ( items ){
			var that = this.global();
			if ( items.length <= 0 ) {
                return message.error( "请选择一条还款汇总数据。" );
            }
			if( items.length >1){
				return message.error( "请选择一条还款汇总数据。" );
			}
			var item = items[0];
			
			that.modal.open( {
                title: "还款计划明细",
                url: "operate/channel/repayment/planlist",
                size: "modal-lg",
                params:{item:item},
                events: {
                    hiden: function( closed, data ) {
                        that.vars.gridVar.load();
                    }
                }
            } );
			
		};
		
		handlers.exportDay = function (){
			that.modal.open( {
                title: "导出日结文件",
                url: "operate/channel/repayment/exportDay",
                size: "modal-md",
                params:{},
                events: {
                    hiden: function( closed, data ) {
                        that.vars.gridVar.load();
                    }
                }
            } );
		};
		
		handlers.exportMonth = function (){
			that.modal.open( {
                title: "导出月结文件",
                url: "operate/channel/repayment/exportMonth",
                size: "modal-md",
                params:{},
                events: {
                    hiden: function( closed, data ) {
                        that.vars.gridVar.load();
                    }
                }
            } );
		};
		
	};
	return Global;
	
} );