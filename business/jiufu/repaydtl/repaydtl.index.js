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
		code.cache( "Is_No,Cust_Settle_Stat,Jf_Repay_Status,Jf_Debit_Stat,Is_No" );
		
		var moment = require( "moment" );
		
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
			
			that.selector.find( "input[name=byRepayStat]" ).select( {//实例下拉插件
				code: { type: "Jf_Repay_Status" }
			} );
			
			that.selector.find( "input[name=custSettleStat]" ).select( {//实例下拉插件
				code: { type: "Cust_Settle_Stat" }
			} );
			
			that.selector.find( "input[name=jfDebitStat]" ).select( {//实例下拉插件
				code: { type: "Jf_Debit_Stat" }
			} );
			
			that.selector.find( "input[name=byEffecStat]" ).select( {//实例下拉插件
				code: { type: "Is_No" }
			} );
			
			
			that.selector.find( "input[name=startPlanRepayDate]" ).datetimepicker( {
			} );
			
			that.selector.find( "input[name=endPlanRepayDate]" ).datetimepicker( {
			} );
			
			that.selector.find( "input[name=startPlanRepayDate]" ).val(moment(new Date()).format("YYYY-MM-DD"));
			that.selector.find( "input[name=endPlanRepayDate]" ).val(moment(new Date()).format("YYYY-MM-DD"));
			that.selector.find( ".input" ).input( {} );//实例input插件
			
			//导出
			that.selector.find( "#exportData" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.expt(items);
				return false;
			} );
			
			//发送实际还款
			that.selector.find( "#sendRepayPlan" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.sendRepayPlan( items );
				return false;
			} );
			
			var config = {
				remote: {
		        	url: "jiufu/repaydtl/list",
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
			cols[ cols.length ] = { title: "贷款编号", name: "loanNo", width: "200px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "工单编号", name: "appId", width: "120px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "还款类型(玖富)", name: "repayType", width: "120px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "还款卡号", name: "repayAccount", width: "200px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "期数", name: "stage", width: "60px", lockWidth: true , style:"text-align: center" };
			cols[ cols.length ] = { title: "计划还款日期(玖富)", name: "planRepayDate", width: "150px", lockWidth: true, style:"text-align: center" };
			cols[ cols.length ] = { title: "计划还款金额(玖富)", name: "planRepayAmt", width: "150px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "本金(玖富)", name: "principal", width: "80px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "利息(玖富)", name: "interest", width: "80px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "客户已还(博雅)", name: "custRepaidAmt", width: "120px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "客户已还_含滞纳金(博雅)", name: "custRepaidAll", width: "200px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "客户结清标志(博雅)", name: "custSettleStat", width: "180px", lockWidth: true, style:"text-align: center", renderer: function( val, item, rowIndex){
				return base.code.getText("Cust_Settle_Stat",val);
			}};
			
			cols[ cols.length ] = { title: "冲账状态", name: "byRepayStat", width: "80px", lockWidth: true, style:"text-align: center", renderer: function( val, item, rowIndex){
				return base.code.getText("Jf_Repay_Status",val);
			}};
			cols[ cols.length ] = { title: "冲账结果码", name: "byRepayCode", width: "90px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "冲账失败原因", name: "byRepayMsg", width: "120px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "冲账时间", name: "byRepayTime", width: "200px", lockWidth: true, style:"text-align: center" ,renderer: function( val, item, rowIndex){
				return val && moment( val ).format( "YYYY-MM-DD HH:mm:ss" );
			}};
			
			cols[ cols.length ] = { title: "扣款状态", name: "jfDebitStat", width: "80px", lockWidth: true, style:"text-align: center",renderer: function( val, item, rowIndex){
				return base.code.getText("Jf_Debit_Stat",val);
			}};
			cols[ cols.length ] = { title: "扣款失败原因", name: "jfDebitReason", width: "120px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "扣款金额", name: "jfDebitAmt", width: "100px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "获取扣款结果时间", name: "jfDebitTime", width: "200px", lockWidth: true, style:"text-align: center",renderer: function( val, item, rowIndex){
				return val && moment( val ).format( "YYYY-MM-DD HH:mm:ss" );
			}};
			
			cols[ cols.length ] = { title: "是否有效", name: "byEffecStat", width: "80px", lockWidth: true, style:"text-align: center" , renderer: function( val, item, rowIndex){
				return base.code.getText("Is_No",val);
			}};
			cols[ cols.length ] = { title: "失效原因", name: "byEffecReason", width: "120px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "失效时间", name: "byEffecTime", width: "200px", lockWidth: true, style:"text-align: center",renderer: function( val, item, rowIndex){
				return val && moment( val ).format( "YYYY-MM-DD HH:mm:ss" );
			}};

			cols[ cols.length ] = { title: "提前结清(玖富)", name: "repayOffAmt", width: "120px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "违约金(玖富)", name: "violateAmt", width: "120px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "应还罚息(玖富)", name: "punishAmt", width: "120px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "应还风险管理费(玖富)", name: "riskAmt", width: "150px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "实际还款金额(玖富)", name: "repayRelAmt", width: "150px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "实际已还本金(玖富)", name: "repayPrincipal", width: "150px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "实际已还利息(玖富)", name: "repayInterest", width: "150px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "实际已还罚息(玖富)", name: "repayPunish", width: "150px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "实际已还风险管理费(玖富)", name: "repayRisk", width: "180px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "实际已还违约金(玖富)", name: "repayViolate", width: "150px", lockWidth: true, style:"text-align: center"};
			
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
			
			that.vars.gridVar = that.selector.find( "#repayDtlGrid" ).grid( config );//renderer
		};
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {
		};
		
		//获取查询参数
		handlers.queryStr = function() {
			var that = this.global();
			var $query = that.selector.find( ".grid-query" );
			var  n, v;
			var queryStr = "";
	        var $inputs = $query.find(":input[name]").each(function(){
	            n = $(this).attr("name");
	            if(n){
	                v = $(this).val();
	                if (typeof v != "undefined" && v != null ) {
	                	v = $.trim(v);
	                	queryStr+= n + "=" +v + "&";
	                }
	            }
	        });
	        return queryStr.substring(0,queryStr.length-1);
		};
		
		//检查发起冲账的参数正确性
		handlers.checkParams = function() {
			var that = this.global();
			
			var byEffecStat = that.selector.find( "input[name=byEffecStat]" ).val(); //是否有效
			var byRepayStat = that.selector.find( "input[name=byRepayStat]" ).val(); //冲账状态
			var jfDebitStat = that.selector.find( "input[name=jfDebitStat]" ).val(); //扣款状态
			var custSettleStat = that.selector.find( "input[name=custSettleStat]" ).val(); //结清标志
			
			var result = {rs:true,msg:""};
			
			//判断有效性
			if('13900001' != byEffecStat){
				result.rs = false;
				result.msg = "必须是[有效]的数据才能进行此操作!";
				return result;
			}
			
			//判断冲账状态与扣款状态
			if( !('74000004' == byRepayStat || '74000006' == byRepayStat) ){
				if(undefined == byRepayStat || '' == byRepayStat ){ //冲账状态为空
					result.rs = false;
					result.msg = "必须是[未冲账]或[冲账失败]的数据才能进行此操作!";
					return result;
				}
				if('74000005' == byRepayStat && !( '29600002' == jfDebitStat || '29600003' == jfDebitStat )){
					result.rs = false;
					result.msg = "冲账成功的情况下只有[扣款失败]或[部分扣款成功]的数据才能进行此操作!";
					return result;
				}
			}
			
			//判断结清标志
			if(  !('33900001' == custSettleStat || '33900002' == custSettleStat)  ){
				result.rs = false;
				result.msg = "必须是[已结清或者部分结清]的数据才能进行此操作";
				return result;
			}
			
			return result;
		}
		
		//导出excel
		handlers.expt = function(items){
			var that = this.global();//获取组件的全局对象
			//时间限制:
			var startPlanRepayDate = that.selector.find( "input[name=startPlanRepayDate]" ).val();
			var endPlanRepayDate = that.selector.find( "input[name=endPlanRepayDate]" ).val();
			if((undefined == startPlanRepayDate || '' == startPlanRepayDate) || (undefined == endPlanRepayDate || '' == endPlanRepayDate) ){
				return message.error( "必须选择计划还款开始日期和计划还款结束日期!" );
			}
			
			//导出excel
			var params = handlers.queryStr();
			var url = "jiufu/repaydtl/export";
			if(''!=params){
				url+="?"+params;
			}
			
			//文件下载
			that.loading.show();
			$.fileDownload( url , {
				//下载成功
				successCallback: function (url) {
					//要进入successCallback方法,后端响应头必须这样设置:response.setHeader("Set-Cookie", "fileDownload=true; path=/");
					that.loading.hide();
	            },
	            //下载失败
	            failCallback: function (responseHtml, url) {
	            	that.loading.hide();
	            	var regExp=new RegExp(/Exception.*/g);
					var matchedArr = responseHtml.match(regExp);
					var errMsg = "";
					if(matchedArr && matchedArr.length > 0 ){
						errMsg = matchedArr[0];
						errMsg = errMsg.replace("Exception","系统异常")
					}
					if(undefined != errMsg || '' != errMsg){
						return message.error(errMsg);
					}
	            }
	        });
			
		}
		
		//发送实际还款
		handlers.sendRepayPlan = function(items){
			var that = this.global();//获取组件的全局对象
			
			//判断查询参数的正确性
			var checkRs = that.handlers.checkParams();
			if(!checkRs.rs){
				return message.error( checkRs.msg );
			}
			
			that.dialog.confirm( "是否确定将筛选的数据发送实际还款？</br><font color='red'>如果确定,系统将以3000作为一个批次发起!<font color='red'>", function( event, index ) {
				if ( index == 1 ) return false;
				var params = that.handlers.queryStr();
				console.log(params);
				//发起冲账
				that.loading.show();
				$.ajax( {
					url: "jiufu/repaydtl/sendRepay",
					type: "POST",
					data: params,
					complete: function() {
						that.loading.hide();
					},
					success: function( data ) {
						if ( !data.success ) {
							return message.error( data.msg );
						}
						message.success( data.msg );
						$("#repayDtlGrid #queryBtn").click();
					}
				} );
			});
		}
		
		
	};
	return Global;
} );