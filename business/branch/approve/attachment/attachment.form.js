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
		
		handlers.load = function ( item ){
			var that = this.global();
			that.handlers.getAttInfo(item.certNo,item.busLicsNo);
//			that.selector.find( "#custNo" ).valChange( items.custNo ); 
		};
		
		//获取附件信息
	    handlers.getAttInfo = function(cretNo, busLicsNo){
			that.loading.show();
			$.ajax( {
				url: "cust/manage/loan/attachment",
				type: "POST",
				data: {"loanNo":cretNo},
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
						html+='<p class="text-align"><input class="border-red color-red downloadAttButton" type="button" value="下载"  data-value="'+list[i].id+'" data-type="'+list[i].type+'" /></p>';
						html+='</li>';
					}
					$.ajax( {
						url: "cust/manage/loan/attachment",
						type: "POST",
						data: {"loanNo":busLicsNo},
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
								html+='<p class="text-align"><input class="border-red color-red downloadAttButton" type="button" value="下载"  data-value="'+list[i].id+'" data-type="'+list[i].type+'" /></p>';
								html+='</li>';
							}
							 $("#attUl").append(html)
							$("#"+pageid).find(".downloadAttButton").click(function(){
								var id = $(this).attr("data-value");
								var type = $(this).attr("data-type");
								that.handlers.downloadAtt(id,type);
							});
						}
					} );
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
	};
	return Global;
} );