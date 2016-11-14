define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
		var moment = require( "moment" );
		base.code.cache( "Os_Type,Apply_Type,Is_No,Aprov_Result,Recheck_Pass,Dec_Cause" );
		
		//=======================================================
		// 当前组件
		//=======================================================
		var that = this; //全局对象
		var vars = this.vars = {};//全局变梁
		var handlers = this.handlers = {};//处理程序
		handlers.global = function() { return that; };
		that.vars.izMatchSucc = false;//默认所选资金渠道是匹配失败的.

		//组件入口函数  相当于java.main
		that.init = function() {
			this.layout();
			this.load();
		};
		
		//初始化远程请求处理
		that.load = function() {
			var that = this.global();
			if ( !that.params.item ) return;
			that.handlers.load( that.params.item );
		};
		
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			that.selector.find( "input[name=passReason]" ).select( {//实例下拉插件
				code: { type: "Recheck_Pass" }
			} );
			that.selector.find( "input[name=rejectReason]" ).select( {//实例下拉插件
				code: { type: "Dec_Cause" }
			} );
			$("input[name=rejectReason]").parent().hide();
			
			that.selector.find( "input[name=approveResult]" ).select( {//实例下拉插件
				items:[
				       {label:'通过',value:'pass'},
				       {label:'不通过',value:'notpass'},
				       {label:'驳回',value:'reject'},
				]
			} );
			that.selector.find( "input[name=approveResult]").parent().find("ul li").each(function(){
				$(this).bind( "click", function( event ) {
					 var val=$(this).attr("value");
					 if(val=="pass"){
						 $("input[name=passReason]").parent().show();
						 $("input[name=rejectReason]").parent().hide();
						 $(".rejectRemark").hide();
					 }
					 else if(val=="notpass"){
						 $("input[name=passReason]").parent().hide();
						 $("input[name=rejectReason]").parent().show();
						 $(".rejectRemark").hide();
					 }
					 else if(val=="reject"){
						 $("input[name=passReason]").parent().hide();
						 $("input[name=rejectReason]").parent().hide();
						 $(".rejectRemark").show();
					 }
				});
			});
			//点击通过按钮
			that.selector.find( "#submitButton" ).click( function(event) {
				var val=that.selector.find( "input[name=approveResult]").parent().find("ul .active").attr("value");
				if(typeof(val) == "undefined"|| val==null ||val.length==0){
					 message.error("请选择审批结果！");
					 return;
				 }
				if(val=="pass"){
					var items = that.vars.chan.selectedRows();
					if(!items || items.length ==0) return;
					var item = items[0];
					var matchRemark=that.selector.find( "#matchRemark" ).val();
					item.remark = matchRemark;
					that.dialog.confirm( "提示:确定通过？", function( event, index ) {
						if ( index == 1 ) return false;
						that.handlers.submit(item);
					} );
				}else if(val=="notpass"){
					var items = that.vars.chan.selectedRows();
					var matchRemark=that.selector.find( "#matchRemark" ).val();
					that.dialog.confirm( "提示:确定不通过？", function( event, index ) {
						if ( index == 1 ) return false;
						that.handlers.noPass(items,matchRemark);
					} );
				}else if(val=="reject"){
					that.handlers.reject();
				}
					 	
				return false;
			});
			//点击不通过按钮
//			that.selector.find( "#noPassBtn" ).click( function(event) {
//				var items = that.vars.chan.selectedRows();
//				var matchRemark=that.selector.find( "#matchRemark" ).val();
//				that.dialog.confirm( "提示:确定不通过？", function( event, index ) {
//					if ( index == 1 ) return false;
//					that.handlers.noPass(items,matchRemark);
//				} );
//				return false;
//			});
			//关闭事件
			that.selector.find( "#closeBtn" ).click( function(event) {
				that.close();
				return false;
			});
			
			that.selector.find( ".input" ).input( {} );//实例input插件
			
			var chanConfig = {
				remote: {
		        	url: "appro/match/bLoLoanFundMatchLog/getChan",
		            params: { "params[prodNo]": that.params.item.prodNo,
		            		  "params[loanNo]": that.params.item.loanNo,
		            		  "params[matchPsn]": that.params.item.matchPsn
		            		}
		        },
		        multi: false,
		        page: {
		        	pageSize: 10
		        },
		        plugins: [],
		        events: {
		        	 loaded: {
		        		data: false,
		        		 handler: function (event, items) {
		        			 if(!items || items.length ==0) return;
		        			 for(var i=0 ; i<items.length; i++){
		        				 var item = items[i];
		        				 if('checked' == item.checked){
		        					 that.vars.chan.select(i);
		        				 }
		        			 }
		        		 }
		        	 }
		         }
			};
			chanConfig.cols = cols = [];
			cols[ cols.length ] = { title: "渠道编号", name: "chanNo", width: "150px", lockWidth: true,align:'center' };
			cols[ cols.length ] = { title: "渠道名称", name: "chanName", width: "120px", lockWidth: true,align:'center' };
			
			that.vars.chan = that.selector.find( "#chanGrid" ).grid( chanConfig );
		};
		
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		/** 加载数据*/
		handlers.load = function( item ) {
			var that = this.global();
			that.selector.find( "#matchRemark" ).valChange( that.params.item.remark ); 
		};
		
		
		 /** 资金渠道信息页面*/
		 //资金匹配
		 handlers.submit = function(item){
			var url = item.matchUrl;	
			if(!url || ''==$.trim(url) ){
				handlers.save(item);
				return;
			}
			//url='jiufu/loanWorkImport/index';//写死
			//需要进行第三方判断是否匹配成功的
			that.modal.open( {
				title: "资金匹配 | 工单导入",
				url: url,
				size: "modal-md",
				//async: false,
				params: { item: item },
				events: {
					hiden: function( closed, data ) {
						//if ( !closed ) return;
						if(!data){
							return;
						}
						if(data.success){
							that.handlers.save(item);
						};
					}
				}
			} );
		 }
		 
		 /** 资金匹配(通过)*/
		handlers.save = function(it) {
			var that = this.global();
			that.loading.show(); 
			$.ajax( {
				url: "appro/match/bLoLoanFundMatchLog/match",
				type: "POST",
				data: {
					"id":it.id,//matchLog id
					"loanNo":it.loanNo,//贷款id
					"fid":that.params.item.fid,//节点id
					"flowId":that.params.item.flowId,//节点编码
					"chanNo":it.chanNo,//渠道编号
					"loanAmt": it.loanAmt,
					"custNo": it.custNo,
					"custName": it.custName,
					"remark": it.remark,
					"passReason":that.selector.find( ":input[name=passReason]" ).val()
				},
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
					if ( !data.success ) {
						return message.error( data.msg );
					}
					message.success( data.msg );
					that.close( data );
				}
			} );
		};
			
			
			/** 资金匹配(不通过)*/
			handlers.noPass = function(its,matchRemark) {
				var that = this.global();
				var it = that.params.item;
				if ( its.length != 1 ) {
					return message.error( "请选择一条资金渠道。" );
				}
				//console.log(it);
				that.loading.show(); 
				$.ajax( {
					url: "appro/match/bLoLoanFundMatchLog/noPass",
					type: "POST",
					data: { 
						"id":it.id,//matchLog id
						"lid":it.lid,//贷款id
						"fid":it.fid,//节点id
						"chanNo":its[0].chanNo,//渠道编号
						"loanNo": it.loanNo,
						"loanAmt": it.loanAmt,
						"custNo": it.custNo,
						"custName": it.custName,
						"remark":  that.selector.find( "#matchRemark" ).val(),
						"rejectReason":that.selector.find( ":input[name=rejectReason]" ).val()
					},
					complete: function() {
						that.loading.hide();
					},
					success: function( data ) {
						if ( !data.success ) {
							return message.error( data.msg );
						}
						message.success( data.msg );
						that.close( data );
					}
				} );
			};
			
			//驳回
			handlers.reject = function(){
				
				var that = this.global();
				var it = that.params.item;
				console.log(it)
				that.loading.show();
				$.ajax( {
					url: "appro/match/bLoLoanFundMatchLog/reject",
					type: "POST",
					data: {
						"loanNo":it.loanNo,//贷款编号
						"fid":that.params.item.fid,//节点id
						"remark": that.selector.find( "#matchRemark" ).val(),
						"rejectRemark": that.selector.find( "#rejectRemark" ).val()
					},
					complete: function() {
						that.loading.hide();
					},
					success: function( data ) {
	                        that.loading.hide();
	                        message.success("操作成功");
	                        that.close( data );
					}
				} );
			};
			
		
	};
	
	return Global;
});