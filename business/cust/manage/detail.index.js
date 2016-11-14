define(function () { 
	require( [ "css2!assets/business/cust/manage/manage.base" ] );
	require( [ "css2!assets/business/cust/manage/detail.index" ] );
	
	function Global( vars ) {
		
		//=======================================================
		//获取基础组件
		//=======================================================
		var $ = require("jquery")
			, base = require("app/base")
			, message = base.message
			, tools = base.tools;
		var moment = require("moment");
		base.code.cache("Is_No,Sex,Cust_Type,Work_Job,Marriage_Status,Live_Build_Type,House_State,Car_Type,Acct_Stat,Education");
		
		//=======================================================
		//当前组件
		//=======================================================
		var that = this;
		var vars = that.vars = $.extend( true, {}, vars );
		var handlers = that.handlers = {};//处理程序
		handlers.global = function() { return that; };
		
		//入口
		that.init = function() {
			this.css();
			this.layout(); 
			this.load();
		};
		//css
		that.css = function() {
			var that = this.global();
			
		};
		
		//页面布局
		that.layout = function(){
			var that = this.global();
			//切换效果
			that.selector.find(".c-nav li").bind("click",function(event){
				var custNo=that.params.item.custNo;
				//客户视图数据加载
				var id = $(this).attr("id");
				
				if(id=="custbaseinfo"){
					that.handlers.getCustBaseInfo(custNo);
				}
				else if(id=="custdata"){
					that.handlers.getHouseLoanInfo(custNo);			
				}
				else if(id=="loaninfo"){
					that.handlers.getLoanInfo(custNo);
				}
				else if(id=="callinfo"){
					that.handlers.getCallInfo(custNo);
				}
	    		
				
		        $(this).addClass("active");
		        $(this).siblings().removeClass("active");
		        var cliObj = $(".c-nav li");
		        var cdivObj = $(".c-main-text .loan-info-box");
		        for(var i = 0;i < cliObj.length;i++) {
		            for (var j = 0; j < cdivObj.length; j++) {
		                var liClass = $(cliObj).eq(i).attr("class");
		                if (liClass=="active"){
		                    if(j == i){
		                        $(cdivObj).hide();
		                        $(cdivObj).eq(j).show();
		                        return false
		                    }
		                }
		            }
		        }
		    });
			
			//显示/隐藏更多电话号码
    		that.selector.find(".c-main-text .more-phone-btn").bind("click",function(event){
        		var thisObj = $(this).parent().find(".more-phone");

        		if($(thisObj).css("display") == "none"){
        			that.selector.find(".c-main-text .more-phone").hide();
            		$(thisObj).show();
        		}else{
            		$(thisObj).hide();
        		}
    			var custNo = that.params.item.custNo;
    			that.handlers.moreOtherConct(custNo);
    		});
    		//    客户信息-客户基本信息-点击更多电话号码弹框以外的地方关闭更多电话号码
    		$(document).bind("click", function (e) {
        		var thisClass = $(e.target).attr("class");
        		if (thisClass != undefined&&thisClass.indexOf("more-phone-btn") > -1) {}
        		else {
            		if ($(e.target).closest(".more-phone").length == 0) {
                		that.selector.find(".c-main-text .more-phone").hide();
            		}
        		}
    		});
			
			//    客户信息-客户资料信息-查询条件
   		    that.selector.find("#loan-info").bind("change", function(event){
        	var thisVal = $(this).val();
        	var thisP = $(this).closest(".query-info").find(".query-term");
        	$(thisP).attr("id",thisVal);

        	var changeDiv = $(".c-main-text .loan-info-one");
        	$(changeDiv).hide();
        	for(var i = 0;i < changeDiv.length;i++) {
            	var thisClass = $(changeDiv).eq(i).attr("class").replace("loan-info-one ","");
            	if(thisClass == thisVal){
                	$(changeDiv).eq(i).show();
            	}
        	}
            //客户资料信息-下拉切换显示加载数据
        	var id=$('#loan-info option:selected').attr("id");
        	var custNo=that.params.item.custNo;
			if(id=="houseloaninfo"){
				that.handlers.getHouseLoanInfo(custNo);
			}
			else if(id=="carloaninfo"){
				that.handlers.getCarLoanInfo(custNo);			
			}
			else if(id=="bankinfo"){
				that.handlers.getBankInfo(custNo);
			}
			else if(id=="otherloaninfo"){
				that.handlers.getOtherLoanInfo(custNo);
			}
			
    	});

   		    //客户信息-来电记录-查询条件 初始化时间筛选框
   		    that.selector.find( "input[name=beginDate]" ).datetimepicker( {
				//maxDate: moment(that.vars.nowDate).format("YYYY-MM-DD")
			} );
			that.selector.find( "input[name=endDate]" ).datetimepicker( {
				//maxDate: moment(that.vars.nowDate).format("YYYY-MM-DD")
			} );
    		//客户信息-来电记录-添加记录
    		that.selector.find("#add-info").bind("click", function(event){
    			var custNo = that.params.item.custNo;
    			that.handlers.callopen(custNo);
    		});
    		//初始化客户信息--来电记录--筛选框样式
    		that.selector.find( ".input" ).input( {} );
		};
		
		

		//初始化远程请求处理
		that.load = function() {
			var that = this.global();
			if ( !that.params.item ) return;
			that.handlers.load( that.params.item );
		};
		//=======================================================
		//业务逻辑申明
		//=======================================================
		
		handlers.load = function ( items ){
			$(".detailInfo li:first").trigger("click");
		};
		//获取客户基本信息
	    handlers.getCustBaseInfo = function(custNo){
			that.loading.show();
			$.ajax( {
				url: "cust/manage/detail/info",
				type: "GET",
				data: {"custNo":custNo},
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
					var custType = base.code.getText("Cust_Type",data.custType);
					$("#custType").html($(custType).html());
					
					$("#custName").html(data.custName);
					
					var sex = base.code.getText("sex",data.sex);
					var workJob = base.code.getText("WORK_JOB",data.workJob);
					$("#job").html($(workJob).html()+"/"+$(sex).html()+"/"+data.ethnic);
	                				
					$("#qq").html(data.qq);
					$("#weixin").html(data.weiChat);
					if(data.qq!=null){
						$("#email").html(data.qq+"@qq.com");
					}
					$("#creditLimit").html(data.creditLimit);
					$("#remainLimit").html(data.remainLimit);
					
					var level=data.level;
					for(var i=0;i<level;i++){
						$("#"+i).removeClass("color-gray");
						$("#"+i).addClass("color-yellow");
					};
					$("#score").html(data.score);
					$("#levelUser").html(data.levelUser);
					$("#levelDate").html(data.levelDate);
					$("#certNo").html(data.certNo);
					$("#certValidDate").html(data.certValidDate);
					//发证机构
					$("#certOrg").html(data.certOrg);
					var marriage = base.code.getText("Marriage_Status",data.marriage);
					$("#marriage").html($(marriage).html());
					
					var contctOtherList=data.custContctOtherList;
					var html="";
					var length = contctOtherList.length>4?4:contctOtherList.length;
					for(var i=0;i<length;i++){
						var dto = contctOtherList[i];
						html+='<div class="col-xs-12 two-info">';
						html+='<p class="info-one border float-left">';
						html+='<span class="float-left"><span>'+dto.contactRel+'：</span><span>'+dto.contactName+'</span></span>';
						html+='<span class="float-right"><i class="fa fa-phone color-yellow"></i><span>'+dto.contactTel+'</span></span>';
						html+='</p>';
						html+='</div>';
					}
					$("#contctOther").html(html);
                    
                        
					$("#regAddr").html(data.regAddr);
					$("#liveAddr").html(data.liveAddr);
					
					var liveBuildType= base.code.getText("Live_Build_Type",data.liveBuildType);
					$("#liveBuildType").html($(liveBuildType).html());
					
					$("#mthAmt").html(data.mthAmt);
					
					
				}
			} );
	   };
	   //更多其他联系人
	   handlers.moreOtherConct = function(custNo){
			that.loading.show();
			$.ajax( {
				url: "cust/manage/detail/moreotherconct",
				type: "GET",
				data: {"custNo":custNo},
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
					var html='';
					for(var i=0;i<data.length;i++){
						html+='<span><i class="fa fa-phone color-yellow"></i><a href="#">'+data[i].contactTel+'</a></span>';
					}
					$('#moreOtherConctShow').html(html);
				}
			} );
	   }
    	//获取房产贷款信息
	    handlers.getHouseLoanInfo = function(custNo){
	    	var config = {
					remote: {
			        	url: "cust/manage/detail/houseloaninfo",
			            params: {"custNo":custNo}
			        },
			        multi: false,
			        page: true,
//			        query: {
////			        	target: that.selector.find( ".grid-query" )
//			        },
			        plugins: [],
			        events: {},
			        customEvents: []
				};
				config.cols = cols = [];
				cols[ cols.length ] = { title: "客户编号", name: "custNo", width: "120px", lockWidth: true};
				cols[ cols.length ] = { title: "房产开始日期", name: "beginDate", width: "120px", lockWidth: true , style:"text-align: center",
						renderer:function(val,item,rowIndex){return moment(item.beginDate).format("YYYY-MM-DD")}
				};
				cols[ cols.length ] = { title: "房产剩余期限(月)", name: "estateMonth", width: "120px", lockWidth: true , style:"text-align: center"}
				cols[ cols.length ] = { title: "每月还款日", name: "estateMthDay", width: "120px", lockWidth: true , style:"text-align: center"};
				cols[ cols.length ] = { title: "每月还款金额", name: "estateMthAmt", width: "120px", lockWidth: true, style:"text-align: center",
						renderer: function( val, item, rowIndex){return  tools.moneyFromat(item.estateMthAmt, 2)}
				};
				cols[ cols.length ] = { title: "房产购买年限", name: "estateBuyYear", width: "120px", lockWidth: true, style:"text-align: center"};
				cols[ cols.length ] = { title: "客服人员编码", name: "instUserNo", width: "120px", lockWidth: true, style:"text-align: center"};
				cols[ cols.length ] = { title: "贷款状态", name: "estateType", width: "120px", lockWidth: true, style:"text-align: center",
						renderer: function( val, item, rowIndex){return base.code.getText("House_State",item.estateType)}
				};
				
				config.events.click = {
					handler: function( event, item, rowIndex ) {
						//item 当期行数据
						//rowIndex 当前行索引
						//处理其他逻辑
						that.handlers.getHouseLoanDetailInfo(item[0].id);
					}
				};
				
				config.customEvents.push( {

				} );
				
				that.vars.gridVarHouseLoanInfo = that.selector.find( "#houseloanInfoGrid" ).grid( config );//renderer

	   };
	   /**
	    * 房产详细信息
	    */
	   handlers.getHouseLoanDetailInfo=function(id){
				that.loading.show();
				$.ajax( {
					url: "cust/manage/detail/houseaddress",
					type: "GET",
					data: {"id":id},
					complete: function() {
						that.loading.hide();
					},
					success: function( data ) {
						that.selector.find( "input[name=estateProv]").valChange(data.estateProv);
						that.selector.find( "input[name=estateCity]").valChange(data.estateCity);
						that.selector.find( "input[name=estateArea]").valChange(data.estateArea);
						that.selector.find( "input[name=estateAddr]").valChange(data.estateAddr);
						
					}
				} );
	   };
   	    /**
   	     * 获取车辆贷款信息
   	     * */
	    handlers.getCarLoanInfo = function(custNo){
	    	var config = {
					remote: {
			        	url: "cust/manage/detail/carloaninfo",
			            params: {"custNo":custNo}
			        },
			        multi: false,
			        page: true,
			        //query: {
			        //    	target: that.selector.find( ".grid-query" )
			        //},
			        plugins: [],
			        events: {},
			        customEvents: []
				};
				config.cols = cols = [];
				cols[ cols.length ] = { title: "客户编号", name: "custNo", width: "120px", lockWidth: true};
				cols[ cols.length ] = { title: "车牌", name: "carPlate", width: "120px", lockWidth: true , style:"text-align: center"};
				cols[ cols.length ] = { title: "车辆品牌", name: "carBrand", width: "120px", lockWidth: true , style:"text-align: center"}
				cols[ cols.length ] = { title: "型号", name: "carModel", width: "120px", lockWidth: true , style:"text-align: center"};
				cols[ cols.length ] = { title: "贷款开始日期", name: "beginDate", width: "120px", lockWidth: true, style:"text-align: center",
						renderer:function(val,item,rowIndex){return moment(item.beginDate).format("YYYY-MM-DD")}
				};
				cols[ cols.length ] = { title: "贷款逾期限(月)", name: "carMonth", width: "120px", lockWidth: true, style:"text-align: center"};
				cols[ cols.length ] = { title: "每月还款日", name: "carMthDay", width: "120px", lockWidth: true, style:"text-align: center"};
				cols[ cols.length ] = { title: "每月还款金额", name: "carMthAmt", width: "120px", lockWidth: true, style:"text-align: center",
						renderer: function( val, item, rowIndex){return  tools.moneyFromat(item.carMthAmt, 2)}
				};
				cols[ cols.length ] = { title: "车辆购买年限", name: "carBuyYear", width: "120px", lockWidth: true, style:"text-align: center"};
				cols[ cols.length ] = { title: "客服人员编码", name: "instUserNo", width: "120px", lockWidth: true, style:"text-align: center"};
				cols[ cols.length ] = { title: "车辆状态", name: "carType", width: "120px", lockWidth: true, style:"text-align: center",
						renderer: function( val, item, rowIndex){return base.code.getText("Car_Type",item.carType)}
				};
				config.events.click = {
					handler: function( event, item, rowIndex ) {
						//item 当期行数据
						//rowIndex 当前行索引
						
						//处理其他逻辑
					}
				};
				
				config.customEvents.push( {

				} );
				
				that.vars.gridVarCarLoanInfo = that.selector.find( "#carloaninfoGrid" ).grid( config );//renderer

	   };
  	    /**
  	     * 获取银行账号信息
  	     * */
	    handlers.getBankInfo = function(custNo){
	    	var config = {
					remote: {
			        	url: "cust/manage/detail/bankinfo",
			            params: {"custNo":custNo}
			        },
			        multi: false,
			        page: true,
			        //query: {
			        //    	target: that.selector.find( ".grid-query" )
			        //},
			        plugins: [],
			        events: {},
			        customEvents: []
				};
				config.cols = cols = [];
				cols[ cols.length ] = { title: "客户编号", name: "custNo", width: "120px", lockWidth: true};
				cols[ cols.length ] = { title: "开户机构", name: "acctName", width: "120px", lockWidth: true , style:"text-align: center"};
				cols[ cols.length ] = { title: "开户机构所在省", name: "openProv", width: "120px", lockWidth: true , style:"text-align: center"}
				cols[ cols.length ] = { title: "开户机构所在市", name: "openCity", width: "120px", lockWidth: true , style:"text-align: center"};
				cols[ cols.length ] = { title: "开户机构详细地址", name: "openAddr", width: "150px", lockWidth: true, style:"text-align: center"};
				cols[ cols.length ] = { title: "账号", name: "acctNo", width: "120px", lockWidth: true, style:"text-align: center"};
				cols[ cols.length ] = { title: "开卡姓名", name: "acctName", width: "120px", lockWidth: true, style:"text-align: center"};
				cols[ cols.length ] = { title: "客服人员编码", name: "instUserNo", width: "120px", lockWidth: true, style:"text-align: center"};
				cols[ cols.length ] = { title: "是否有效", name: "stat", width: "120px", lockWidth: true, style:"text-align: center",
						renderer: function( val, item, rowIndex){return base.code.getText("Acct_Stat",item.stat)}
				};
				config.events.click = {
					handler: function( event, item, rowIndex ) {
						//item 当期行数据
						//rowIndex 当前行索引
						
						//处理其他逻辑
					}
				};
				
				config.customEvents.push( {

				} );
				
				that.vars.gridVarBankInfo = that.selector.find( "#bankacctinfoGrid" ).grid( config );//renderer

	   };
 	    /**
 	     * 获取客户其他贷款信息
 	     * */
	    handlers.getOtherLoanInfo = function(custNo){
	    	var config = {
					remote: {
			        	url: "cust/manage/detail/otherloaninfo",
			            params: {"custNo":custNo}
			        },
			        multi: false,
			        page: true,
			        //query: {
			        //    	target: that.selector.find( ".grid-query" )
			        //},
			        plugins: [],
			        events: {},
			        customEvents: []
				};
				config.cols = cols = [];
				cols[ cols.length ] = { title: "客户编号", name: "custNo", width: "120px", lockWidth: true};
				cols[ cols.length ] = { title: "个人收入(月)", name: "income", width: "120px", lockWidth: true , style:"text-align: center"};
				cols[ cols.length ] = { title: "办理过的月还款额", name: "mthRepay", width: "150px", lockWidth: true , style:"text-align: center"};
				cols[ cols.length ] = { title: "受教育程度", name: "edu", width: "120px", lockWidth: true , style:"text-align: center",
						renderer: function( val, item, rowIndex){return base.code.getText("Education",item.edu)}
				};
				cols[ cols.length ] = { title: "家庭收入", name: "famIncome", width: "120px", lockWidth: true, style:"text-align: center"};
				cols[ cols.length ] = { title: "贷款开始日期", name: "beginDate", width: "120px", lockWidth: true, style:"text-align: center"};
				cols[ cols.length ] = { title: "客服人员编码", name: "instUserNo", width: "120px", lockWidth: true, style:"text-align: center"};
				cols[ cols.length ] = { title: "是否办理过类似分期业务", name: "isLoaned", width: "180px", lockWidth: true, style:"text-align: center"};
				cols[ cols.length ] = { title: "是否有效", name: "isValid", width: "120px", lockWidth: true, style:"text-align: center",
						renderer: function( val, item, rowIndex){return base.code.getText("Is_No",item.isValid)}
				};
				config.events.click = {
					handler: function( event, item, rowIndex ) {
						//item 当期行数据
						//rowIndex 当前行索引
						
						//处理其他逻辑
					}
				};
				
				config.customEvents.push( {

				} );
				
				that.vars.gridVarOtherLoanInfo = that.selector.find( "#otherloaninfoGrid" ).grid( config );//renderer

	   };
		//获取客户贷款信息
	    handlers.getLoanInfo = function(custNo){
	    	that.handlers.getTotalLoanInfo(custNo);
	      	var config = {
					remote: {
			        	url: "cust/manage/detail/loaninfo",
			            params: {"custNo":custNo}
			        },
			        multi: false,
			        page: true,
			        //query: {
			        //    	target: that.selector.find( ".grid-query" )
			        //},
			        plugins: [],
			        events: {},
			        customEvents: []
				};
				config.cols = cols = [];
				cols[ cols.length ] = { title: "货款编号", name: "loanNo", width: "120px", lockWidth: true};
				cols[ cols.length ] = { title: "贷款金额", name: "loanAmt", width: "70px", lockWidth: true , style:"text-align: center"};
				cols[ cols.length ] = { title: "在贷余额", name: "loanbal", width: "70px", lockWidth: true , style:"text-align: center"};
				cols[ cols.length ] = { title: "贷款期数", name: "instNum", width: "70px", lockWidth: true , style:"text-align: center"};
				cols[ cols.length ] = { title: "还款日", name: "thRepayDat", width: "70px", lockWidth: true, style:"text-align: center"};
				cols[ cols.length ] = { title: "月还款金额", name: "mthRepayAmt", width: "90px", lockWidth: true, style:"text-align: center"};
				cols[ cols.length ] = { title: "当前逾期金额", name: "overdueAmt", width: "120px", lockWidth: true, style:"text-align: right"};
				cols[ cols.length ] = { title: "操作", name: "isLoaned", width: "120px", lockWidth: true, style:"text-align: right"};
				config.events.click = {
					handler: function( event, item, rowIndex ) {
						//item 当期行数据
						//rowIndex 当前行索引
						
						//处理其他逻辑
					}
				};
				
				config.customEvents.push( {

				} );
				
				that.vars.gridVarLoanInfo = that.selector.find( "#loaninfoGrid" ).grid( config );
	   };
	   //获取客户贷款汇总信息
	    handlers.getTotalLoanInfo = function(custNo){
			that.loading.show();
			$.ajax( {
				url: "cust/manage/detail/totalloaninfo",
				type: "GET",
				data: {"custNo":custNo},
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
                             $('#loanAmt').html(data.loanAmt);
					         $('#loanBal').html(data.loanBal);
					         $('#loanCnt').html(data.loanCnt);
					         $('#lastDate').html(data.lastDate);
					
				}
			} );
	   };
	   
		//获取客户来电信息
	    handlers.getCallInfo = function(custNo){
	      	
	    	var config = {
					remote: {
			        	url: "cust/manage/detail/callinfo",
			            params: {"custNo":custNo}
			        },
			        multi: false,
			        page: true,
			        query: {
			            	target: that.selector.find( ".grid-query" )
			        },
			        plugins: [],
			        events: {},
			        customEvents: []
				};
				config.cols = cols = [];
				cols[ cols.length ] = { title: "客户姓名", name: "custName", width: "70px", lockWidth: true, style:"text-align: center"};
				cols[ cols.length ] = { title: "来电号码", name: "callNo", width: "120px", lockWidth: true};
				cols[ cols.length ] = { title: "来电时间", name: "callTime", width: "70px", lockWidth: true , style:"text-align: center",
						renderer:function(val,item,rowIndex){return moment(item.callTime).format("YYYY-MM-DD")}
				};
				cols[ cols.length ] = { title: "来电内容", name: "callContent", width: "70px", lockWidth: true , style:"text-align: center"};
				cols[ cols.length ] = { title: "客服编号", name: "instUserNo", width: "70px", lockWidth: true , style:"text-align: center"};
				config.events.click = {
					handler: function( event, item, rowIndex ) {
						//item 当期行数据
						//rowIndex 当前行索引
						
						//处理其他逻辑
					}
				};
				
				config.customEvents.push( {

				} );
				
				that.vars.gridVarCallInfo = that.selector.find( "#callinfoGrid" ).grid( config );
	   }; 
	    //添加来电记录弹窗
		handlers.callopen = function(custNo) {
			var that = this.global();
			that.modal.open( {
				title: "添加来电信息",
				url: "cust/manage/detail/callopen",
				size: "modal-xs",
				params: {
					item: custNo
				},
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.gridVarCallInfo.load();
					}
				}
			} );
		}
	};
	return Global;
   
});