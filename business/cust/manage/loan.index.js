define([
"charts"
],function () { 
	require( [ "css2!assets/business/cust/manage/manage.base" ] );
	require( [ "css2!assets/business/cust/manage/loan.index" ] );
	require( [ "css2!assets/business/cust/manage/detail.index" ] );
	
	function Global( vars ) {
		
		//=======================================================
		//获取基础组件
		//=======================================================
		var $ = require("jquery")
			, base = require("app/base")
			, charts = require("charts")
			, message = base.message
			, tools = base.tools;
		base.code.cache("Work_Job","Cust_Type","Aprov_Result","Loan_After",
		        "Prod_Type","Handle_Type","Relation","Unit_Type",
		        "Unit_Scale","Industry","Position_Level",
		        "Educational_System","School_Name","Live_Build_Type",
		        "Open_Org","Nation");
		var moment = require("moment");
		//电话系统
		var call = require("call");

		
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
			that.selector.find( ".input" ).input( {} );
			
			var labelOfHidden = that.params.item.labelOfHidden;
			if(typeof(labelOfHidden)!= undefined&&labelOfHidden!=null&&labelOfHidden.length>0){
				for(var i=0;i<labelOfHidden.length;i++){
					var id = labelOfHidden[i];
					$("#"+id).hide();
				}
			}
			//查看贷款信息
			that.selector.find( "#loanHistoryinfoGrid1 #loanBtn1" ).bind( "click", function( event ) {
				var items = that.vars.gridVarLoanInfo1.selectedRows();
				that.handlers.loanInfo( items );
				return false;
			} );
			//查看贷款信息
			that.selector.find( "#loanHistoryinfoGrid2 #loanBtn2" ).bind( "click", function( event ) {
				var items = that.vars.gridVarLoanInfo2.selectedRows();
				that.handlers.loanInfo( items );
				return false;
			} );
			//查看贷款信息
			that.selector.find( "#loanHistoryinfoGrid3 #loanBtn3" ).bind( "click", function( event ) {
				var items = that.vars.gridVarLoanInfo3.selectedRows();
				that.handlers.loanInfo( items );
				return false;
			} );
			//查看贷款信息
			that.selector.find( "#loanHistoryinfoGrid4 #loanBtn4" ).bind( "click", function( event ) {
				var items = that.vars.gridVarLoanInfo4.selectedRows();
				that.handlers.loanInfo( items );
				return false;
			} );
			
			
			//切换效果
			that.selector.find(".c-nav li").bind("click",function(event){
				var loanNo=that.params.item.loanNo;
				var custNo = that.params.item.custNo;
				var applyDate = that.params.item.applyDate;
				//贷款信息
				var id = $(this).attr("id");
				if(id=="loanbaseinfo"){//贷款基本信息
					that.handlers.getLoanBaseInfo(loanNo);
				}
				else if (id=="custBaseinfo") {//客户基本信息
					that.handlers.getCustBaseInfo(custNo,loanNo);
				}
				else if (id=="custOtherInfo") {//历史贷款信息
//					handlers.getLoanInfo(custNo);
					handlers.getCardInfo(loanNo,applyDate);
					
					handlers.getCertInfo(custNo,applyDate);
					handlers.getPhoneInfo(custNo,applyDate);
					handlers.getWorkInfo(custNo,applyDate);
				}
				else if(id=="capitalinfo"){//资方信息
					that.handlers.getCapitalInfo(loanNo);			
				}
				else if(id=="overdue"){//逾期信息
					that.handlers.getOverdueList(loanNo);
				}
				else if (id=="handInfo") {//贷款经办信息
					that.handlers.getLoanHandInfo(loanNo);
				}
				else if(id=="attachment"){//附件
					that.handlers.getAttInfo(loanNo);
				}
				else if(id=="windControl"){//风控信息
					that.handlers.getWindControl(loanNo,custNo);
				}
				var prevLabel="";
		        $(".c-nav li").each(function(){
		        	
		        	if($(this).hasClass("active")){
		        		$(this).removeClass("active");
		        		prevLabel = $(this).attr("id");
		        	}
		        	if($(this).attr("id")==id){
		        		$(this).addClass("active");
		        	}
		        });
		        $("."+prevLabel).hide();
		        $("."+id).show();
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
    		});
   		//客户联系电话拨打事件--电话号码
   		that.selector.find("#phoneNum").bind("click", function(event){
   			var loanNo=that.params.item.loanNo;
	     	var thisVal = $(this).text();
			if(null == thisVal || thisVal == ''){
				return;
			}
			call.callPhone(loanNo,thisVal);
	 	}); 
   		//客户联系电话拨打事件--图标
   		$(".custPhone").each(function(){
   			$(this).click(function(){
   	   			var phone=$(this).next().html();
   	   			console.log(phone);
   	   			var loanNo=that.params.item.loanNo;
   		     	var thisVal = $("#phoneNum").text();
   				if(null == thisVal || thisVal == ''){
   					return;
   				}
   				call.callPhone(loanNo,thisVal);
   			});
	    }); 
	};
		//初始化远程请求处理
		that.load = function() {
			$(".loaninfo li:first").trigger("click");
		};
		//=======================================================
		//业务逻辑申明
		//=======================================================
		
		handlers.load = function ( items ){
			var that = this.global();
//			that.selector.find( "#custNo" ).valChange( items.custNo ); 
		};
		//获取贷款基本信息
	    handlers.getLoanBaseInfo = function(loanNo){
	    	var that = this.global();
			that.loading.show();
			$.ajax( {
				url: "cust/manage/loan/info",
				type: "GET",
				data: {"loanNo":loanNo},
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
					var dto = data.t;
					if(dto==null||dto.length==0){
						return;
					}
					var pageid;
				    $("#sectionTabs li").each(function(){
				       if($(this).hasClass("active")){
				    	   pageid=$(this).attr("pageid");
				    	   return;
				       }	
				    });
				    //头像
				    var sourceType = dto.sourceType
				    if(sourceType=='26600001'||sourceType=='26600002'){//进件来源为IOS或ANDROID
					    $("#"+pageid).find('.headPic').each(function(){
					    	$(this).attr("src","pub/asysatt/show/"+loanNo+"/20800013");
					    });
				    }else{
					    $("#"+pageid).find('.headPic').each(function(){
					    	$(this).attr("src","assets/business/cust/manage/images/head.png");
					    });
				    }
				    //客户姓名
				    $("#"+pageid).find('#custName').html(dto.custName);
				    var workJob=$(base.code.getText("Work_Job",dto.workJob)).html();
				    if(workJob!=null){
						$("#"+pageid).find('#custName').html(dto.custName+"/"+workJob);
				    }
			        //职业类型
					$("#"+pageid).find('#custType').html($(base.code.getText("Cust_Type",dto.custType)).html());
					//是否销售本人
					var isSaler = base.code.getText("Is_No",dto.getIsSaler);
					$("#"+pageid).find('#isSaler').html($(isSaler).html());
	              //贷款编号
					$("#"+pageid).find('#loanNo').html(dto.loanNo);
                  //贷款状态
				  var stat = base.code.getText("Aprov_Result",dto.stat);
				  $("#"+pageid).find('#stat').html($(stat).html());
				  //贷后状态
				  var afterStat = base.code.getText("Loan_After",dto.afterStat);
				  $("#"+pageid).find("#afterStat").html($(afterStat).html());
				  //申请时间
				  if(dto.applyDate!=null){
					  var applyDate = moment(dto.applyDate).format("YYYY-MM-DD HH:mm:ss");
					  $("#"+pageid).find("#applyDate").html(applyDate);
				  }
				  //审批时间
				  if(dto.aprvDate!=null){
					  var aprvDate = moment(dto.aprvDate).format("YYYY-MM-DD HH:mm:ss");
					  $("#"+pageid).find("#aprvDate").html(aprvDate);
				  }
				  //放款时间
				  if(dto.distrDate!=null){
					  var distrDate = moment(dto.distrDate).format("YYYY-MM-DD");
					  $("#"+pageid).find("#distrDate").html(distrDate);
				  }
				   //首次还款时间
				  if(dto.fstRepayDate!=null){
					   var fstRepayDate = moment(dto.fstRepayDate).format("YYYY-MM-DD");
					   $("#"+pageid).find("#fstRepayDate").html(fstRepayDate);
				  }

				   //五级分类
				  if(dto.fivCls!=null){
					  $("#"+pageid).find("#fivCls").html(dto.fivCls);
				  }
				   //办理地点
				  if(dto.bLoLoanBranchDto.branchAdd!=null){
					  $("#"+pageid).find("#branchAdd").html(dto.bLoLoanBranchDto.branchAdd);
				  }
				   //分期数
				  $("#"+pageid).find("#instNum").html(dto.instNum);
				   //贷款本金
				  $("#"+pageid).find("#loanAmt").html("￥"+dto.loanAmt);
				   //首付金额
				  $("#"+pageid).find("#fstPayAmt").html("￥"+dto.fstPayAmt);
				   //月还款日
				  $("#"+pageid).find("#mthRepayDate").html("月还款("+dto.mthRepayDate+"号)");
				   //月还款金额
				  $("#"+pageid).find("#fstRepayAmt").html("￥"+dto.fstRepayAmt);
				   //利率
				   if(dto.rat!=null){
					   $("#"+pageid).find("#feeVal").html(dto.rat+"%");
				   }
				   //产品类型
				   var prodTyp = base.code.getText("Prod_Type",dto.bLoLoanProdDto.prodTyp);
				   $("#"+pageid).find("#loanTyp").html($(prodTyp).html());
				   //商品信息--商品品牌及型号
				   $("#"+pageid).find("#brandQue").html(dto.bLoLoanGoodsDto.brandQue);
				   //商品信息--商品总价
				   $("#"+pageid).find("#pric").html("￥"+dto.bLoLoanGoodsDto.pric);
				   //商品信息--是否勾选灵活还款包
				   $("#"+pageid).find("#flexibleRepay").html(dto.flexibleRepay);
				   //商品信息--保险手续费占比
				   if(dto.insuranceCommission!=null){
					   $("#"+pageid).find("#insuranceCommission").html(dto.insuranceCommission+"%");
				   }
				   
				   //销售信息--销售人员
				   $("#"+pageid).find("#staffName").html(dto.bLoLoanSalerDto.staffName);
				   //销售信息--档案编号
				   if (dto.fileNo!=null) {
					   var fileNoInt = dto.fileNo%4
					   $("#"+pageid).find("#staffNo").html(fileNoInt);
				   }
				   //销售信息--销售电话
				   $("#"+pageid).find("#moblNo").html(dto.bLoLoanSalerDto.moblNo);
				   //销售信息--区域经理
				   if(dto.bLoLoanSalerDto.areaMgerName!=null){
					   $("#"+pageid).find("#areaMgerName").html(dto.bLoLoanSalerDto.areaMgerName);
				   }
				  
				   //销售信息--区域经理编号
				   if(dto.bLoLoanSalerDto.areaMgerNo!=null){
					   $("#"+pageid).find("#areaMgerNo").html(dto.bLoLoanSalerDto.areaMgerNo);
				   }
				   
				   
				   
				   //产品信息--产品编号
				   $("#"+pageid).find("#prodNo").html(dto.bLoLoanProdDto.prodNo);
				   //产品信息--产品名称
				   $("#"+pageid).find("#prodName").html(dto.bLoLoanProdDto.prodName);
				   //产品信息--产品类型
				   var prodTyp = base.code.getText("Prod_Type",dto.bLoLoanProdDto.prodTyp);
				   $("#"+pageid).find("#prodTyp").html($(prodTyp).html());
				   //产品信息--产品利率
				   if(dto.rat!=null){
					   $("#"+pageid).find("#rat").html(dto.rat+"%");
				   }
				   //产品信息--产品说明
				   $("#"+pageid).find("#prodRemark").html(dto.bLoLoanProdDto.prodRemark);
				   
				   
				   //网点信息--网点名称
				   $("#"+pageid).find("#branchName").html(dto.bLoLoanBranchDto.branchName);
				   //网点信息--网点名称
				   if(dto.bLoLoanBranchDto.branchScore!=null){
					    $("#"+pageid).find("#branchScore").html(dto.bLoLoanBranchDto.branchScore+"分")
				   }
				    var level=dto.bLoLoanBranchDto.branchLevel;
				    if(level!=null){
				    	var html=''
					    for(var i=0;i<level;i++){
							html+='<i class="fa fa-star color-yellow"></i>';
						};
						for(var i=0;i<(5-level);i++){
							html+='<i class="fa fa-star color-gray"></i>';
						}
						$("#"+pageid).find('#branchLevel').html(html);
				    }
				

				   //网点信息--负责人
				   $("#"+pageid).find("#contctPer").html(dto.bLoLoanBranchDto.contctPer);
				   //网点信息--联系电话
				   $("#"+pageid).find("#contctTel").html(dto.bLoLoanBranchDto.contctTel);
				   //网点信息--网点地址
				   if(dto.bLoLoanBranchDto.branchAdd!=null){
					   $("#"+pageid).find(".branchAdd").html(dto.bLoLoanBranchDto.branchAdd);
				   }
				}
			} );
	   };
	   
		//获取客户基本信息
	    handlers.getCustBaseInfo = function(custNo,loanNo){
			that.loading.show();
			$.ajax( {
				url: "cust/manage/loan/base",
				type: "GET",
				data: {"custNo":custNo,"loanNo":loanNo},
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
					var dto = data.t;
					if(dto==null||dto.length==0){
						return;
					}
					var pageid;
				    $("#sectionTabs li").each(function(){
				       if($(this).hasClass("active")){
				    	   pageid=$(this).attr("pageid");
				    	   return;
				       }	
				    });
					var custType = base.code.getText("Cust_Type",dto.custType);
					$("#"+pageid).find("#custType").html($(custType).html());
					var sex = base.code.getText("sex",dto.sex);
					$("#"+pageid).find("#job").html(dto.custName+"/"+$(sex).html()+"/"+$(base.code.getText("Nation",dto.ethnic)).html());
	                if(dto.workJob=='20700002'){//客户学校信息
	                	var studyDto = dto.bLoCustStudy;
	                	if(studyDto.schoolName!=null){
		                	$("#"+pageid).find("#schoolName").html($(base.code.getText("School_Name",studyDto.schoolName)).html());
	                	}
	                	if (studyDto.collegeName!=null) {
		                	$("#"+pageid).find("#collegeName").html(studyDto.collegeName);

						}
	                	if (studyDto.educ!=null) {
		                	$("#"+pageid).find("#educ").html($(base.code.getText("Educational_System",studyDto.educ)).html());

						}
	                	if (studyDto.major!=null) {
		                	$("#"+pageid).find("#major").html(studyDto.major);

						}
	                	
	                	if (studyDto.tie!=null) {
		                	$("#"+pageid).find("#tie").html(studyDto.tie);

						}
	                	if (studyDto.custClass!=null) {
		                	$("#"+pageid).find("#custClass").html(studyDto.custClass);

						}
	                	if (studyDto.intoSchoolDate!=null) {
		                	$("#"+pageid).find("#intoSchoolDate").html(studyDto.intoSchoolDate);

						}
	                	if (studyDto.schoolProv!=null) {
		                	$("#"+pageid).find("#schoolProv").html(studyDto.schoolProv);

						}
	                	if (studyDto.schoolCity!=null) {
		                	$("#"+pageid).find("#schoolCity").html(studyDto.schoolCity);

						}
	                	if (studyDto.schoolArea!=null) {
		                	$("#"+pageid).find("#schoolArea").html(studyDto.schoolArea);

						}
	                	if (studyDto.schoolAddr!=null) {
		                	$("#"+pageid).find("#schoolAddr").html(studyDto.schoolAddr);

						}
	                	if (studyDto.schoolMan!=null) {
		                	$("#"+pageid).find("#schoolMan").html(studyDto.schoolMan);

						}
	                	if (studyDto.schoolTel!=null) {
	                		$("#"+pageid).find("#schoolTel").html(studyDto.schoolTel);
						}
	                	
	                	$(".cust-work").hide();
	                	$(".cust-study").show();    
	                }else{//客户单位信息
	                	var workDto = dto.bLoCustWork;
	                	if (workDto.workUnit!=null) {
		                	$("#"+pageid).find("#workUnit").html(workDto.workUnit);

						}
	                	if (workDto.unitType!=null) {
		                	$("#"+pageid).find("#unitType").html($(base.code.getText("Unit_Type",workDto.unitType)).html());

						}
	                	if (workDto.unitTel!=null) {
		                	$("#"+pageid).find("#unitTel").html(workDto.unitTel);

						}
	                	if (workDto.unitSca!=null) {
		                	$("#"+pageid).find("#unitSca").html($(base.code.getText("Unit_Scale",workDto.unitSca)).html());

						}
	                	if (workDto.industry!=null) {
		                	$("#"+pageid).find("#industry").html($(base.code.getText("Industry",workDto.industry)).html());

						}
	                	if (workDto.dept!=null) {
		                	$("#"+pageid).find("#dept").html(workDto.dept);

						}
	                	if (workDto.workPost!=null) {
		                	$("#"+pageid).find("#workPost").html($(base.code.getText("Position_Level",workDto.workPost)).html());

						}
	                	if (workDto.workJob!=null) {
		                	$("#"+pageid).find("#workJob").html($(base.code.getText("Work_Job",workDto.workJob)).html());

						}
	                	if (workDto.workTime!=null) {
		                	$("#"+pageid).find("#workTime").html(workDto.workTime);

						}
	                	if (workDto.unitProv!=null) {
		                	$("#"+pageid).find("#unitProv").html(workDto.unitProv);

						}
	                	if (workDto.unitCity!=null) {
		                	$("#"+pageid).find("#unitCity").html(workDto.unitCity);

						}
	                	if (workDto.unitArea!=null) {
		                	$("#"+pageid).find("#unitArea").html(workDto.unitArea);

						}
	                	if (workDto.unitAddr!=null) {
		                	$("#"+pageid).find("#unitAddr").html(workDto.unitAddr);

						}
	                	if (workDto.linkMan!=null) {
		                	$("#"+pageid).find("#linkMan").html(workDto.linkMan);

						}
	                	if (workDto.linkTel!=null) {
		                	$("#"+pageid).find("#linkTel").html(workDto.linkTel);

						}
	                	if(workDto.payDay!=null){
		                	$("#"+pageid).find("#payDay").html(workDto.payDay);

	                	}
	                	$(".cust-work").show();
	                	$(".cust-study").hide();
	                }
	                //客户银行账号信息
	                var bankDto = dto.bloLoanBankAcct;
	                if (bankDto.acctNo!=null) {
	                	$("#"+pageid).find("#acctNo").html(bankDto.acctNo);
					}
	                if (bankDto.acctName!=null) {
		                $("#"+pageid).find("#acctName").html(bankDto.acctName);

					}
	                if (bankDto.openOrg!=null) {
		                $("#"+pageid).find("#openOrg").html($(base.code.getText("Open_Org",bankDto.openOrg)).html());

					}
	                if (bankDto.openProv!=null) {
		                $("#"+pageid).find("#openProv").html(bankDto.openProv);

					}
	                if (bankDto.openCity!=null) {
		                $("#"+pageid).find("#openCity").html(bankDto.openCity);

					}
	                if (bankDto.openAddr!=null) {
		                $("#"+pageid).find("#openAddr").html(bankDto.openAddr);

					}
	                //qq
					$("#"+pageid).find("#qq").html(dto.qq);
					//微信
					$("#"+pageid).find("#weixin").html(dto.weiChat);
					//备用号码
					$("#"+pageid).find("#stPhone").html(dto.stPhone);
					if(dto.qq!=null){
						$("#"+pageid).find("#email").html(dto.qq+"@qq.com");
					}
					//主号码
					$("#"+pageid).find("#phoneNum").html(dto.phoneNo);
					if(dto.qq!=null){
						$("#"+pageid).find("#email").html(dto.qq+"@qq.com");
					}
					$("#"+pageid).find("#creditLimit").html(dto.creditLimit);
					$("#"+pageid).find("#remainLimit").html(dto.remainLimit);
					
					var level=dto.level;
					for(var i=0;i<level;i++){
						$("#"+pageid).find("#"+i).removeClass("color-gray");
						$("#"+pageid).find("#"+i).addClass("color-yellow");
					};
					//客户评分
					if(dto.scroe!=null){
						$("#"+pageid).find("#score").html(dto.score);
					}
					//登记人
					if(dto.levelUser!=null){
						$("#"+pageid).find("#levelUser").html(dto.levelUser);
					}
					//登记时间
					if(dto.levelDate!=null){
						$("#"+pageid).find("#levelDate").html(dto.levelDate);
					}
					$("#"+pageid).find("#certNo").html(dto.certNo);
					$("#"+pageid).find("#certValidDate").html(dto.certValidDate);
					//发证机构
					if(dto.certOrg!=null){
						$("#"+pageid).find("#certOrg").html(dto.certOrg);
					}
					
					var marriage = base.code.getText("Marriage_Status",dto.marriage);
					$("#"+pageid).find("#marriage").html($(marriage).html());
					
					var contctOtherList=dto.bloCustContctOtherDtoList;
					
					if(contctOtherList.length<=4){
						$("#moreOtherConct").remove();
					}
					var html="";
					var moreHtml=""
					for(var i=0;i<contctOtherList.length;i++){
						var contctOther = contctOtherList[i];
						var relation = base.code.getText("Relation",contctOther.contactRel);
						if(i<4){
							html+='<div class="col-xs-12 two-info">';
							html+='<p class="info-one border float-left">';
						
							
							html+='<span class="float-left"><span>'+$(relation).html()+'：</span><span>'+contctOther.contactName+'</span></span>';
							html+='<span class="float-right other-contacts-phone" style="cursor:pointer"><i class="fa fa-phone color-yellow"></i><span>'+contctOther.contactTel+'</span></span>';
							html+='</p>';
							html+='</div>';
						}else{//更多
								moreHtml+='<span class="other-contacts-phone" style="cursor:pointer"><i class="fa fa-phone color-yellow"></i>'+$(relation).html()+"："+"&nbsp&nbsp"+contctOther.contactName+"&nbsp&nbsp<span>"+contctOther.contactTel+'</span></span>';
						}

					}
					$("#"+pageid).find("#contctOther").html(html);
					$("#"+pageid).find('#moreOtherConctShow').html(moreHtml);
                       
					$("#"+pageid).find("#regAddr").html(dto.regAddr);
					$("#"+pageid).find("#liveAddr").html(dto.liveAddr);
					
					var liveBuildType= base.code.getText("Live_Build_Type",dto.liveBuildType);
					$("#"+pageid).find("#liveBuildType").html($(liveBuildType).html());
					
					$("#"+pageid).find("#mthAmt").html(dto.mthAmt);
					
					
					//其他联系人列表电话拨打事件
			   		that.selector.find(".other-contacts-phone").bind("click", function(event){
			   			var loanNo=that.params.item.loanNo;
			   			var thisVal = $(this).find("span").html();
						if(null == thisVal || thisVal == ''){
							return;
						}
						call.callPhone(loanNo,thisVal);
				 	});
			   		
			   		//学校/单位电话拨打事件
			   		that.selector.find(".work-tel").bind("click", function(event){
			   			var loanNo=that.params.item.loanNo;
			   			var thisVal = $(this).text();
						if(null == thisVal || thisVal == ''){
							return;
						}
						call.callPhone(loanNo,thisVal);
				 	}); 
				}
			} );
	   };
	   //获取资方信息
	   handlers.getCapitalInfo = function (loanNo){
		   that.loading.show();
			$.ajax( {
				url: "cust/manage/loan/capital",
				type: "GET",
				data: {"loanNo":loanNo},
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
					var dto = data.t;
					if(dto==null||dto.length==0){
						return;
					}
					var pageid;
				    $("#sectionTabs li").each(function(){
				       if($(this).hasClass("active")){
				    	   pageid=$(this).attr("pageid");
				    	   return;
				       }	
				    });
					//资方名称
					$("#"+pageid).find("#chanName").html(dto.chanName);
					//还款开始日期
					$("#"+pageid).find("#repayStartDate").html(dto.startDate);
					//还款结束日期
					$("#"+pageid).find("#repayEndDate").html(dto.endDate);
					that.handlers.loanPlan(dto);
					that.handlers.rcvAmt(dto);
					that.handlers.repayComp(dto);
					that.handlers.repayType(dto);
				}
			} );
	   }
	   //还款计划信息饼状图
	   handlers.loanPlan = function (item){
			var loanPlanOption = {
				    title : {
				        text: '',
				        subtext: '',
				        x:''
				    },
				    tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c}元 ({d}%)"
				    },
				    legend: {
				        orient: 'vertical',
				        left: 'center',
				        data: ['应收总金额','实收总金额']
				    },
				    series : [
				        {
				            name: '',
				            type: 'pie',
				            radius : '50%',//饼图的半径
				            center: ['50%', '50%'],//饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标
				            data:[
				                {value:item.actTotalAmt, name:'实收总金额'},
				                {value:item.rcvTotalAmt, name:'应收总金额'}
				            ],
				            itemStyle: {
				                emphasis: {
				                    shadowBlur: 10,
				                    shadowOffsetX: 0,
				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
				                }
				            }
				        }
				    ]
			};
			var loanPlan = charts.init(that.selector.find('#loanplan')[0]);
			loanPlan.setOption(loanPlanOption);
	   }
	   //在贷余额饼状图
	   handlers.rcvAmt = function (item){
			var rcvAmtOption = {
				    title : {
				        text: '',
				        subtext: '',
				        x:''
				    },
				    tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c}元 ({d}%)"
				    },
				    legend: {
				        orient: 'vertical',
				        left: 'center',
				        data: ['贷款总额','在贷余额']
				    },
				    series : [
				        {
				            name: '',
				            type: 'pie',
				            radius : '50%',//饼图的半径
				            center: ['50%', '50%'],//饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标
				            data:[
				                {value:item.rcvTotalAmt, name:'贷款总额'},
				                {value:item.remainAmt, name:'在贷余额'}
				            ],
				            itemStyle: {
				                emphasis: {
				                    shadowBlur: 10,
				                    shadowOffsetX: 0,
				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
				                }
				            }
				        }
				    ]
			};
			var rcvAmt = charts.init(that.selector.find('#rcvAmt')[0]);
			rcvAmt.setOption(rcvAmtOption);
	   }
	   //还款构成饼状图
	   handlers.repayComp = function (item){
			var repayCompOption = {
				    title : {
				        text: '',
				        subtext: '',
				        x:''
				    },
				    tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} {d}%"
				    },
				    legend: {
				        orient: 'vertical',
				        left: 'center',
				        data: ['利息','本金','其他']
				    },
				    series : [
				        {
				            name: '',
				            type: 'pie',
				            radius : '50%',//饼图的半径
				            center: ['50%', '50%'],//饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标
				            data:[
				                {value:item.rcvIntScale, name:'利息'},
				                {value:item.rcvPrinScale, name:'本金'},
				                {value:item.otherScale, name:'其他'}
				            ],
				            itemStyle: {
				                emphasis: {
				                    shadowBlur: 10,
				                    shadowOffsetX: 0,
				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
				                }
				            }
				        }
				    ]
			};
			var repayComp = charts.init(that.selector.find('#repayComp')[0]);
			repayComp.setOption(repayCompOption);
	   }
	   //还款方式饼状图
	   handlers.repayType = function (item){
			var repayTypeOption = {
				    title : {
				        text: '',
				        subtext: '',
				        x:''
				    },
				    tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} {d}%"
				    },
				    legend: {
				        orient: 'vertical',
				        left: 'center',
				        data: ['支付宝','微信','银行卡','财付通']
				    },
				    series : [
				        {
				            name: '',
				            type: 'pie',
				            radius : '50%',//饼图的半径
				            center: ['50%', '50%'],//饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标
				            data:[
				                {value:item.zfbScale, name:'支付宝'},
				                {value:item.wxScale, name:'微信'},
				                {value:item.yhkScale, name:'银行卡'},
				                {value:item.cftScale, name:'财付通'}
				            ],
				            itemStyle: {
				                emphasis: {
				                    shadowBlur: 10,
				                    shadowOffsetX: 0,
				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
				                }
				            }
				        }
				    ]
			};
			var repayType = charts.init(that.selector.find('#repayType')[0]);
			repayType.setOption(repayTypeOption);
	   }
    	//逾期信息
	    handlers.getOverdueList = function(loanNo){
	    	that.handlers.getOverdue(loanNo);
	    	var config = {
					remote: {
			        	url: "cust/manage/loan/overdue/list",
			            params: {"loanNo":loanNo}
			        },
			        multi: false,
			        page: true,
//			        query: {
//		        	target: that.selector.find( ".grid-query" )
//			        },
			        plugins: [],
			        events: {},
			        customEvents: []
				};
				config.cols = cols = [];
				cols[ cols.length ] = { title: "货款编号", name: "loanNo", width: "120px", lockWidth: true};
				cols[ cols.length ] = { title: "逾期开始日期", name: "bgnDate", width: "120px", lockWidth: true , style:"text-align: center"};
				cols[ cols.length ] = { title: "逾期结束日期", name: "endDate", width: "120px", lockWidth: true , style:"text-align: center"};
				cols[ cols.length ] = { title: "逾期金额", name: "ovduLoanAmt", width: "120px", lockWidth: true , style:"text-align: center",
						renderer:function(val,item,rowIndex){return moment(item.handDate).format("YYYY-MM-DD")}
				};
				cols[ cols.length ] = { title: "滞纳金", name: "ovduAmt", width: "120px", lockWidth: true, style:"text-align: center"};
				cols[ cols.length ] = { title: "操作", name: "", width: "120px", lockWidth: true, style:"text-align: center"};

				config.events.click = {
					handler: function( event, item, rowIndex ) {
						//item 当期行数据
						//rowIndex 当前行索引
						//处理其他逻辑
						//that.handlers.getHouseLoanDetailInfo(item[0].id);
					}
				};
				
				config.customEvents.push( {

				} );
				
				that.vars.gridVarOverdueList = that.selector.find( "#overdueGrid" ).grid( config );//renderer

	   };
	   //获取当前逾期信息
	   handlers.getOverdue = function(loanNo){
			that.loading.show();
			$.ajax( {
				url: "cust/manage/loan/overdue",
				type: "GET",
				data: {"loanNo":loanNo},
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
					var dto = data.t;
					if(dto==null||dto.length==0){
						return;
					}
					var pageid;
				    $("#sectionTabs li").each(function(){
				       if($(this).hasClass("active")){
				    	   pageid=$(this).attr("pageid");
				    	   return;
				       }	
				    });
                    //当前逾期总额
					$("#"+pageid).find("#ovduLoanAmt").html(dto.ovduLoanAmt);
					//当前逾期本金
					$("#"+pageid).find("#ovduPrin").html(dto.ovduPrin);
					//当前逾期期数
					$("#"+pageid).find("#ovduLev").html(dto.ovduLev);
					//催收员
					$("#"+pageid).find("#dealUserName").html(dto.dealOrgName+"&nbsp;&nbsp;"+dto.dealUserName);
					//状态
					
				}
			} );
	   };
     	//贷款经办信息
	    handlers.getLoanHandInfo = function(loanNo){
	    	var config = {
					remote: {
			        	url: "cust/manage/loan/handinfo",
			            params: {"loanNo":loanNo}
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
				cols[ cols.length ] = { title: "类型", name: "typ", width: "120px", lockWidth: true, style:"text-align: center",
						renderer: function( val, item, rowIndex){return base.code.getText("Handle_Type",item.typ)}		
				};
				cols[ cols.length ] = { title: "经办人", name: "handPersonName", width: "120px", lockWidth: true , style:"text-align: center"};
				cols[ cols.length ] = { title: "工号", name: "handPersonNo", width: "120px", lockWidth: true , style:"text-align: center"};
				cols[ cols.length ] = { title: "时间", name: "handDate", width: "120px", lockWidth: true , style:"text-align: center",
						renderer:function(val,item,rowIndex){return moment(item.handDate).format("YYYY-MM-DD HH:mm:ss")}
				};
				cols[ cols.length ] = { title: "备注", name: "remark", width: "120px", lockWidth: true, style:"text-align: center"};
				config.events.click = {
					handler: function( event, item, rowIndex ) {
						//item 当期行数据
						//rowIndex 当前行索引
						//处理其他逻辑
					}
				};
				
				config.customEvents.push( {

				} );
				
				that.vars.gridVarLoanHandInfo = that.selector.find( "#loanHandInfoGrid" ).grid( config );//renderer

	   };
		//获取附件信息
	    handlers.getAttInfo = function(loanNo){
			that.loading.show();
			$.ajax( {
				url: "cust/manage/loan/attachment",
				type: "POST",
				data: {"loanNo":loanNo},
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
					var pageid;
				    $("#sectionTabs li").each(function(){
				       if($(this).hasClass("active")){
				    	   pageid=$(this).attr("pageid");
				    	   return;
				       }	
				    });
					var list  = data.list;
					var html=''
					for(var i=0;i<list.length;i++){
						html+='<li class="col-lg-2 col-sm-3 col-xs-4">';
						html+='<div class="doc-box">'+list[i].fileName+'</div>';
						html+='<div>'+moment(list[i].instDate).format("YYYY-MM-DD HH:mm:ss")+'</div>';
						html+='<p class="text-align"><input class="border-red color-red downloadAttButton" type="button" value="下载"  data-value="'+list[i].id+'" data-type="'+list[i].type+'" /></p>';
						html+='</li>';
					}
					$("#"+pageid).find('#attUl').html(html);
					$("#"+pageid).find(".downloadAttButton").click(function(){
						var id = $(this).attr("data-value");
						var type = $(this).attr("data-type");
						that.handlers.downloadAtt(id,type);
					});
				}
			} );
	   };
	   //下载附件
	    handlers.downloadAtt = function(id,type){
			var pageid;
		    $("#sectionTabs li").each(function(){
		       if($(this).hasClass("active")){
		    	   pageid=$(this).attr("pageid");
		    	   return;
		       }	
		    });
		    var action;
		    if("attachment"==type){
		    	 action ="pub/asysatt/download/"+id;
		    }else{
		    	 action ="loan/ctrct/download/"+id;
		    }
	    	$("#"+pageid).find("#downloadAttForm").attr("action",action);
	    	$("#"+pageid).find("#downloadAttForm").submit();
	   };
		//获取客户居住信息
	   handlers.getLiveInfo = function(custNo){
	     	var config = {
					remote: {
			        	url: "cust/manage/loan/liveinfo",
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
				cols[ cols.length ] = { title: "客户编号", name: "custNo", width: "200px", lockWidth: true, style:"text-align: center"};
				cols[ cols.length ] = { title: "居住地省/直辖市", name: "liveProv", width: "120px", lockWidth: true , style:"text-align: center"};
				cols[ cols.length ] = { title: "居住市", name: "liveCity", width: "70px", lockWidth: true , style:"text-align: center"};
				cols[ cols.length ] = { title: "居住区/县", name: "liveArea", width: "120px", lockWidth: true , style:"text-align: center"};
				cols[ cols.length ] = { title: "居住详细地址", name: "liveAddr", width: "120px", lockWidth: true, style:"text-align: center"};
				cols[ cols.length ] = { title: "居住地址是否同户籍", name: "isRegLive", width: "180px", lockWidth: true, style:"text-align: center",
						renderer: function( val, item, rowIndex){return base.code.getText("Is_No",val)}
				};
				cols[ cols.length ] = { title: "房产所有权", name: "liveBuildType", width: "90px", lockWidth: true, style:"text-align: center",
						renderer: function( val, item, rowIndex){return base.code.getText("Live_Build_Type",val)}	
				};
				cols[ cols.length ] = { title: "月租金", name: "mthAmt", width: "120px", lockWidth: true, style:"text-align: center"};
				cols[ cols.length ] = { title: "合同到期日", name: "contrEndDate", width: "120px", lockWidth: true, style:"text-align: center"};

				config.events.click = {
					handler: function( event, item, rowIndex ) {
						//item 当期行数据
						//rowIndex 当前行索引
						
						//处理其他逻辑
					}
				};
				
				config.customEvents.push( {

				} );
				
				that.vars.gridVarLiveInfo = that.selector.find( "#liveInfoGrid" ).grid( config );
	  };
	    /**
	     * 获取银行账号信息
	     * */
   handlers.getBankInfo = function(loanNo){
   	var config = {
				remote: {
		        	url: "cust/manage/loan/bankinfo",
		            params: {"loanNo":loanNo}
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
			cols[ cols.length ] = { title: "贷款编号", name: "loanNo", width: "180px", lockWidth: true};
			cols[ cols.length ] = { title: "账号", name: "acctNo", width: "180px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "账号名称", name: "acctName", width: "120px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "开户机构", name: "openOrg", width: "120px", lockWidth: true , style:"text-align: center",
					renderer: function( val, item, rowIndex){return base.code.getText("Open_Org",val)}
			};		
         	cols[ cols.length ] = { title: "开户机构所在省", name: "openProv", width: "120px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "开户机构所在市", name: "openCity", width: "120px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "开户机构详细地址", name: "openAddr", width: "150px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "开卡姓名", name: "acctName", width: "120px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "是否有效", name: "stat", width: "120px", lockWidth: true, style:"text-align: center",
					renderer: function( val, item, rowIndex){return base.code.getText("Is_No",val)}
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
			
			that.vars.gridVarBankInfo = that.selector.find( "#bankinfoGrid" ).grid( config );//renderer

  };
  
//加载贷款信息的展示页面
	handlers.loanInfo = function(items){
		
		if ( items.length != 1 ) {
			return message.error( "请选择一条操作数据。" );
		}
		
		var item = items[ 0 ]; //获取一条数据
		var that = this.global();
		var loanNo = item.loanNo;
		var labelOfHidden = new Array();
		$.ajax( {
			url: "appro/history/info/custNo",
			type: "POST",
			data: {"loanNo":loanNo},
			success: function( data ) {
				item.custNo = data.params.custNo;
				
				labelOfHidden =["custOtherInfo"];//贷款视图要隐藏的lable
				item.labelOfHidden = labelOfHidden;
				that.modal.open( {
					title: "贷款视图",
					url: "appro/history/info/form",
					size: "modal-lg",
					params: { item: item },
					events: {
						hiden: function( closed, data ) {
							if ( !closed ) return;
							that.vars.gridVar.load();
						}
					}
				} );
			}
		});
		
	};
  
//获取客户贷款信息
  handlers.getLoanInfo = function(custNo){
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
 			cols[ cols.length ] = { title: "贷款编号", name: "loanNo", width: "120px", lockWidth: true};
 			cols[ cols.length ] = { title: "贷款金额", name: "loanAmt", width: "70px", lockWidth: true , style:"text-align: center"};
 			cols[ cols.length ] = { title: "在贷余额", name: "loanbal", width: "70px", lockWidth: true , style:"text-align: center"};
 			cols[ cols.length ] = { title: "贷款期数", name: "instNum", width: "70px", lockWidth: true , style:"text-align: center"};
 			cols[ cols.length ] = { title: "还款日", name: "thRepayDat", width: "70px", lockWidth: true, style:"text-align: center"};
 			cols[ cols.length ] = { title: "月还款金额", name: "mthRepayAmt", width: "90px", lockWidth: true, style:"text-align: center"};
 			cols[ cols.length ] = { title: "当前逾期金额", name: "overdueAmt", width: "120px", lockWidth: true, style:"text-align: right"};
 			config.events.click = {
 				handler: function( event, item, rowIndex ) {
 					//item 当期行数据
 					//rowIndex 当前行索引
 					
 					//处理其他逻辑
 				}
 			};
 			
 			config.customEvents.push( {

 			} );
 			
 			that.vars.gridVarLoanInfo = that.selector.find( "#loanHistoryinfoGrid" ).grid( config );
 			
 };
	//获取工作单位信息 
   handlers.getWorkInfo = function(custNo,applyDate){
     	var config = {
				remote: {
		        	url: "cust/manage/detail/workinfo",
		            params: {"custNo":custNo,"applyDate":applyDate}
		        },
		        multi: false,
		        page: true,
		        query: {
		        	target: that.selector.find( ".loanHistoryinfoGrid1" )
		        },
		        plugins: [],
		        events: {},
		        customEvents: []
			};
			config.cols = cols = [];

			cols[ cols.length ] = { title: "贷款编号", name: "loanNo", width: "140px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "【单位名称】", name: "workUnit", width: "100px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "审批状态", name: "apprStat", width: "90px", lockWidth: true ,align:'center',
					renderer:function(val,item,rowIndex){return base.code.getText("Appr_Stat",val);}};
			cols[ cols.length ] = { title: "是否逾期", name: "ovduFlag", width: "70px", lockWidth: true ,align:'center',
					renderer:function(val,item,rowIndex){return base.code.getText("Is_No",val);}};
			cols[ cols.length ] = { title: "审批备注", name: "remark", width: "120px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "申请日期", name: "applyDate", width: "100px", lockWidth: true , style:"text-align: center",
					renderer:function(val,item,rowIndex){return moment(item.applyDate).format("YYYY-MM-DD")}
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
			
			that.vars.gridVarLoanInfo1 = that.selector.find( "#loanHistoryinfoGrid1" ).grid( config );
			
  };
  
//获取银行卡信息
  handlers.getCardInfo = function(custNo,applyDate){
    	var config = {
				remote: {
		        	url: "cust/manage/detail/cardinfo",
		            params: {"custNo":custNo,"applyDate":applyDate}
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
			
			cols[ cols.length ] = { title: "贷款编号", name: "loanNo", width: "140px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "【银行卡号】", name: "acctNo", width: "100px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "账户名称", name: "acctName", width: "100px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "审批状态", name: "apprStat", width: "100px", lockWidth: true ,align:'center',
					renderer:function(val,item,rowIndex){return base.code.getText("Appr_Stat",val);}};
			
			cols[ cols.length ] = { title: "是否逾期", name: "ovduFlag", width: "70px", lockWidth: true ,align:'center',
					renderer:function(val,item,rowIndex){return base.code.getText("Is_No",val);}};
			cols[ cols.length ] = { title: "审批备注", name: "remark", width: "120px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "申请日期", name: "applyDate", width: "100px", lockWidth: true , style:"text-align: center",
					renderer:function(val,item,rowIndex){return moment(item.applyDate).format("YYYY-MM-DD")}
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
			
			that.vars.gridVarLoanInfo2 = that.selector.find( "#loanHistoryinfoGrid2" ).grid( config );
			
 };

//获取电话号码信息
handlers.getPhoneInfo = function(custNo,applyDate){
  	var config = {
				remote: {
		        	url: "cust/manage/detail/phoneinfo",
		            params: {"custNo":custNo,"applyDate":applyDate}
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
			
			cols[ cols.length ] = { title: "贷款编号", name: "loanNo", width: "140px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "【手机号码】", name: "contactTel", width: "100px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "关系", name: "contactRel", width: "100px", lockWidth: true ,align:'center',
					renderer:function(val,item,rowIndex){return base.code.getText("Relation",val);}};
			cols[ cols.length ] = { title: "审批状态", name: "apprStat", width: "100px", lockWidth: true ,align:'center',
					renderer:function(val,item,rowIndex){return base.code.getText("Appr_Stat",val);}};
			
			cols[ cols.length ] = { title: "是否逾期", name: "ovduFlag", width: "70px", lockWidth: true ,align:'center',
					renderer:function(val,item,rowIndex){return base.code.getText("Is_No",val);}};
			cols[ cols.length ] = { title: "审批备注", name: "remark", width: "120px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "申请日期", name: "applyDate", width: "100px", lockWidth: true , style:"text-align: center",
					renderer:function(val,item,rowIndex){return moment(item.applyDate).format("YYYY-MM-DD")}
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
			
			that.vars.gridVarLoanInfo3 = that.selector.find( "#loanHistoryinfoGrid3" ).grid( config );
			
};
//获取身份证信息 
handlers.getCertInfo = function(custNo,applyDate){
  	var config = {
				remote: {
		        	url: "cust/manage/detail/certinfo",
		            params: {"custNo":custNo,"applyDate":applyDate}
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
			
			cols[ cols.length ] = { title: "贷款编号", name: "loanNo", width: "140px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "【身份证号码】", name: "certNo", width: "100px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "审批状态", name: "apprStat", width: "90px", lockWidth: true ,align:'center',
					renderer:function(val,item,rowIndex){return base.code.getText("Appr_Stat",val);}};
			
			cols[ cols.length ] = { title: "是否逾期", name: "ovduFlag", width: "70px", lockWidth: true ,align:'center',
					renderer:function(val,item,rowIndex){return base.code.getText("Is_No",val);}};
			cols[ cols.length ] = { title: "审批备注", name: "remark", width: "120px", lockWidth: true , style:"text-align: center"};
			
			cols[ cols.length ] = { title: "申请日期", name: "applyDate", width: "100px", lockWidth: true , style:"text-align: center",
					renderer:function(val,item,rowIndex){return moment(item.applyDate).format("YYYY-MM-DD")}
			};	

			config.customEvents.push( {

			} );
			
			that.vars.gridVarLoanInfo4 = that.selector.find( "#loanHistoryinfoGrid4" ).grid( config );
			
};
  /**
   * 获取资料评分和违约率
   */  
  handlers.getWindControl = function(loanNo,custNo){
		that.loading.show();
		$.ajax( {
			url: "cust/manage/loan/datascore",
			type: "POST",
			data: {"loanNo":loanNo,"custNo":custNo},
			complete: function() {
				that.loading.hide();
			},
			success: function( data ) {
				var pageid;
			    $("#sectionTabs li").each(function(){
			       if($(this).hasClass("active")){
			    	   pageid=$(this).attr("pageid");
			    	   return;
			       }	
			    });
				var dto  = data.t;
				if(dto.loanGrade!=null){
					$("#"+pageid).find('#loanGrade').html(dto.loanGrade);
					$("#"+pageid).find('#loanGradeProgressBar').attr("style","width:"+dto.loanGrade+"%;background: #FFA727;");
				}
				if(dto.loanBreak!=null){
					$("#"+pageid).find('#loanBreak').html(dto.loanBreak+"%");
					$("#"+pageid).find('#loanBreakProgressBar').attr("style","width:"+dto.loanBreak+"%;background: #FFA727;");
				}
				$("#matchUrl").attr("href",dto.matchUrl);
				$("#callOrder").attr("href",dto.callOrder);
				$("#callList").attr("href",dto.appMobileContact);
				$("#callDetail").attr("href",dto.appMobileRecord);
				if(dto.showUnionPayInfo){
					$("#unionPayInfo").show();
					$("#unionPayInfo").attr("href",dto.unionPayInfo);
				}
			}
		} );
  		};
	};
	return Global;
} );