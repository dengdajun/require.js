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
			
			//筛选
			that.selector.find( "input[name=effecStat]" ).select( {//实例下拉插件
				code: { type: "Is_No" },
				events: {
					change: {
						data: {},
						handler: function (event, val, item) {
							//单选参数 event, val, item,
							//多选参数 event, vals, items
							//console.log(arguments);
							//that.vars.gridVar.load();
							$("#repayplanGrid #queryBtn").click();
						}
					}
				}
			} );
			
			that.selector.find( "input[name=getStat]" ).select( {//实例下拉插件
				code: { type: "Is_No" },
				events: {
					change: {
						data: {},
						handler: function (event, val, item) {
							//单选参数 event, val, item,
							//多选参数 event, vals, items
							//console.log(arguments);
							//that.vars.gridVar.load();
							$("#repayplanGrid #queryBtn").click();
						}
					}
				}
			} );
			
			that.selector.find( "input[name=startDate]" ).datetimepicker( {
				//maxDate: moment(that.vars.nowDate).format("YYYY-MM-DD")
			} );
			
			that.selector.find( "input[name=endDate]" ).datetimepicker( {
				//maxDate: moment(that.vars.nowDate).format("YYYY-MM-DD")
			} );
			
			that.selector.find( ".input" ).input( {} );//实例input插件
			
			//导出
			that.selector.find( "#exportData" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.expt(items);
				return false;
			} );
			
			//加载还款计划
			that.selector.find( "#loadRepayPlan" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.loadPlan( items );
				return false;
			} );
			
			var config = {
				remote: {
		        	url: "jiufu/repayplan/list",
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
			cols[ cols.length ] = { title: "贷款编号", name: "loanNo", width: "180px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "工单编号", name: "appId", width: "120px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "前置金额", name: "checkAmt", width: "120px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "签约时间", name: "regDate", width: "180px", lockWidth: true , style:"text-align: center" ,renderer: function( val, item, rowIndex){
				return moment( val ).format( "YYYY-MM-DD HH:mm:ss" );
			}};
			cols[ cols.length ] = { title: "是否有效", name: "effecStat", width: "70px", lockWidth: true, style:"text-align: center",
					renderer: function( val, item, rowIndex){return base.code.getText("Is_No",val)}
			};
			cols[ cols.length ] = { title: "是否已获取计划", name: "getStat", width: "110px", lockWidth: true, style:"text-align: center",
					renderer: function( val, item, rowIndex){return base.code.getText("Is_No",val)}
			};
			cols[ cols.length ] = { title: "获取计划时间", name: "getPlanTime", width: "180px", lockWidth: true, style:"text-align: center",renderer: function( val, item, rowIndex){
				return moment( val ).format( "YYYY-MM-DD HH:mm:ss" );
			}};
			cols[ cols.length ] = { title: "放款时间", name: "loanDate", width: "180px", lockWidth: true, style:"text-align: center",renderer: function( val, item, rowIndex){
				return moment( val ).format( "YYYY-MM-DD HH:mm:ss" );
			}};
			cols[ cols.length ] = { title: "放款金额", name: "loanAmt", width: "120px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "9F结果编码", name: "retCode", width: "120px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "9F结果信息", name: "retMsg", width: "120px", lockWidth: true, style:"text-align: center"};
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
			
			that.vars.gridVar = that.selector.find( "#repayplanGrid" ).grid( config );//renderer
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
		
		//导出excel
		handlers.expt = function(items){
			var that = this.global();//获取组件的全局对象
			//时间限制:
			var startDate = that.selector.find( "input[name=startDate]" ).val();
			var endDate = that.selector.find( "input[name=endDate]" ).val();
			if((undefined == startDate || '' == startDate) || (undefined == endDate || '' == endDate) ){
				return message.error( "必须选择签约起始日期和签约结束日期!" );
			}
			
			//导出excel
			var params = handlers.queryStr();
			var url = "jiufu/repayplan/export";
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
		
		//加载玖富还款计划
		handlers.loadPlan = function(items){
			//如果没有勾选数据,则加载查询条件的所查询的全量数据的还款计划的加载
			var confirmMsg = "";
			var data = {};
			if(!items || items.length ==0){ 
				confirmMsg = "确定加载<span style='color: red;'>[通过条件筛选出]</span>的玖富还款计划?";
				var effecStat = that.selector.find( "input[name=effecStat]" ).val(); //是否有效
				var getStat = that.selector.find( "input[name=getStat]" ).val();//是否获取
				if('13900001' != effecStat || '13900002'!= getStat){
					return message.error("查询条件请筛选【已获取计划】为 否，且状态为有效 的数据");
				}
				data = {
						"oper":"all",
						"loanNo":that.selector.find( "input[name=loanNo]" ).val(),
						"effecStat":that.selector.find( "input[name=effecStat]" ).val(),
						"getStat":that.selector.find( "input[name=getStat]" ).val(),
						"startDate":that.selector.find( "input[name=startDate]" ).val(),
						"endDate":that.selector.find( "input[name=endDate]" ).val()
				}
			}else{ //否则只加载所选数据的还款计划
				confirmMsg = "确定加载<span style='color: red;'>选中的["+items.length+"]条</span>数据的玖富还款计划?";
				var loanNos = [];
				for(var i=0 ; i< items.length; i++){
					var item = items[i];
					var effecStat = item.effecStat; //是否有效
					var getStat = item.getStat;//是否获取
					if('13900001' != effecStat || '13900002'!= getStat){
						return message.error("请选择[未获取还款计划],且[状态为有效]的数据");
					}
					loanNos.push(item.loanNo);
				}
				
				var param = "loanNos[{0}]";
				var data = {};
				for (var i = 0 ; i< loanNos.length; i++){
					var key = tools.format(param,[i]);
		        	data[key] = loanNos[i];
				}
		        data.oper = "part";
			}
			//加载还款计划 
			if(!data) return;
			that.dialog.confirm(confirmMsg, function( event, index ) {
				if ( index == 1 ) return false;
				that.loading.show();
				$.ajax( {
					url: "jiufu/repayplan/loadplan",
					type: "POST",
					data: data,
					complete: function() {
						that.loading.hide();
					},
					success: function( data ) {
						if ( !data.success ) {
							return message.error( data.msg );
						}
						message.success( data.msg );
						that.vars.gridVar.load();
					}
				} );
			});
			
		}
		
		
	};
	return Global;
} );