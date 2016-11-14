define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools
			, log=base.log;
		base.code.cache( "Is_No" );
		var moment = require( "moment" );
		
		
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
			this.valdiate();
			this.load();
		};
		
		//初始化远程请求处理
		that.load = function() {
			var that = this.global();
			if ( !that.params.item ) return;
			that.handlers.load( that.params.item );
		};
		
		//验证组件
		that.valdiate = function() {
			var that = this.global(); 
//			that.vars.validator = that.selector.find( "#data" ).validate( {
//				rules: {
//					memo: { required: true },
//				}
//			} );
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
						
			that.selector.find( ".input" ).input( {} );//实例input插件	
			
			that.selector.find("input[name=isnotify]").select({
				code: { type: "Is_No",
					callback: function (data) {
						that.selector.find("input[name=isnotify]").val("13900001");
		                return data;
		            }	
				}
			});
			var busikey=that.selector.find("input[name=busiKey]").val();		
			//提交流程
			that.selector.find("#submitprocess").click( function(event) {
				that.handlers.submitBtn();
				return false;	
		    });		
			//驳回上一级
		    that.selector.find("#rejectchief").click(function(event){			   
		      that.handlers.rejectchief();
		      return false;
		     });
		    //驳回申请人
		    that.selector.find("#rejectapply").click(function(event){
		    	that.handlers.rejectapply();
		    	return false;
		      
		    });
		    //通过并关闭
		    that.selector.find("#finishclose").click(function(event){		    	  
		    	  that.handlers.finishclose();		
		    	  return false;
		      });
		    //取消流程
		    that.selector.find("#cancelprocess").click(function(event){
		    	
		    	that.handlers.cancelBtn();
		    });
		 }		
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		/** 加载数据*/
		handlers.load = function( item ) {
			var that = this.global();
			that.vars.busiui=item.busiui;	
			//得到业务数据
			that.selector.find("input[name=url]").valChange(item.url);
			that.selector.find("input[name=taskKey]").valChange(item.taskKey);
			that.selector.find("input[name=busiKey]").valChange(item.busiKey);
			that.vars.taskKey=item.taskKey;
			that.handlers.getbusidata(item.url);	
			
			that.handlers.workflowchart(item.taskKey,item.templateKey);
			that.handlers.insertapprListNodeInfo(item.taskKey,item.templateKey);
//			//判断是不是业务界面调用
//			alert(item.busiui);
//      		if(item.busiui!=null && item.busiui==true){
//				that.selector.find("#flowinfo").hide();
//			}else if(item.busiui==null || item.busiui==false ){
//				that.selector.find("#flowinfo").show();
//			}

			
		};
		/**
		 * 得到业务数据
		 * */
		handlers.getbusidata=function(url)
		{
			
			var urll=url.substring(0,url.indexOf("?"));
			var busikey=that.selector.find("input[name=busiKey]").val();
			var nodeplace=that.handlers.getCruNodePlace(that.vars.taskKey,busikey);
			that.module.open({
				title: "业务数据",
				style: "margin-top: 15px; margin-bottom: 15px;",
				url:urll,
				toggleOpen:true,
				content: "#approvedata",
				params: {
					"busiKey":busikey,
					"nodePlace":nodeplace
				},
				events: {
					shown:  function ( apps ) {
						
						//判断是不是业务界面调用						
			      		if(that.vars.busiui!=null && that.vars.busiui==true){
			      			that.selector.find("#flowinfo").hide();
						}else if(that.vars.busiui==null || that.vars.busiui==false ){
							that.selector.find("#flowinfo").show();
						}
						
					},//打开后事件
					hiden: function ( closed, data ) {}//关闭后事件
				}
			} );
		}
		
		handlers.getCruNodePlace=function(taskKey,busikey)
		{
			var nodepalce="";
			$.ajax( {
				url: "approve/process/getcurnodeplace",
				type: "POST",
				data:{"taskKey":taskKey,"busiKey":busikey},
				async:false,
				complete: function() {
					//$button.disabled( false );
					that.loading.hide();
				},
				success: function( data ) {
					if ( !data.success ) {
						return message.error( data.msg );
					}
					var map=data.map;
					var status=map["CurNode"];
					if(status=="0001"){
						that.selector.find("#rejectchief").hide();
						that.selector.find("#rejectapply").hide();
						that.selector.find("#finishclose").hide();
						/**
						 * 
						 * 这里这样写是因为 在申请人查看自己的已处理流程时，还是会返回0001，
						 * 这样业务界面就会把自己的按钮放出来
						 * */
						if(that.vars.busiui!=null && that.vars.busiui==true)
						{
							  status="0004";
						}
					}
					if(status=="0002"){
						that.selector.find("#finishclose").hide();
						that.selector.find("#cancelprocess").hide();
					}
					if(status=="0003"){
						that.selector.find("#submitprocess").hide();
						that.selector.find("#cancelprocess").hide();
					}					
					nodepalce=status;
				}
			} );
			return nodepalce;
		}
		
		handlers.serizable=function()
		{
            
			var taskKey=that.selector.find("input[name=taskKey]").val();
			var busiKey=that.selector.find("input[name=busiKey]").val();
			var memo=that.selector.find("textarea[name=memo]").val();
			var notify=that.selector.find("input[name=isnotify]").val();
            if(memo=="" || $.trim(memo).length==0)
            	{
            	   message.error("意见不能为空");
            	   return false;
            	  
            	}
			var data={};
			data.taskKey=taskKey;
			data.busiKey=busiKey;
			data.memo=memo;
			data.notify=notify;
			return data;
		}
		
		
		/** 提交流程*/
		handlers.submitBtn = function() {
			var that = this.global();
			//验证		
			var data = that.handlers.serizable();
			if(!data)
			{
			  return;
			}
			that.loading.show(); 			
			$.ajax( {
				url: "approve/process/submitbtn",
				type: "POST",
				data: data,
				complete: function() {
					//$button.disabled( false );
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
		
		/** 驳回上一级*/
		handlers.rejectchief = function() {
			var that = this.global();
			//验证
			//if ( !that.vars.validator.form() ) return;
			
			var data = that.handlers.serizable();
			if(!data)
				{
				  return;
				}
			that.loading.show(); 			
			$.ajax( {
				url: "approve/process/rejectchief",
				type: "POST",
				data: data,
				complete: function() {
					//$button.disabled( false );
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
		/** 驳回申请人*/
		handlers.rejectapply = function() {
			var that = this.global();
			//验证
			//if ( !that.vars.validator.form() ) return;
			
			var data = that.handlers.serizable();
			if(!data)
			{
			  return;
			}
			that.loading.show(); 			
			$.ajax( {
				url: "approve/process/rejectapply",
				type: "POST",
				data: data,
				complete: function() {
					//$button.disabled( false );
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
		/** 通过并关闭*/
		handlers.finishclose = function() {
			var that = this.global();
			//验证
			//if ( !that.vars.validator.form() ) return;
			
			
			
			var data = that.handlers.serizable();
			if(!data)
			{
			  return;
			}
			that.loading.show(); 			
			$.ajax( {
				url: "approve/process/finishclose",
				type: "POST",
				data: data,
				complete: function() {
					//$button.disabled( false );
					that.loading.hide();
				},
				success: function( data ) {
					if ( !data.success ) {
						return message.error( data.msg );
					}
					//message.success( data.msg );
					var closefavlg=that.selector.find("#approvedata #callbackBtn").attr("id");	
					if(typeof closefavlg=="undefined" || closefavlg=="undefined")
						{
						  that.close(data);
						}
					else
						{
						  that.selector.find("#approvedata #callbackBtn").click();
						}
				}
			} );
			
		};
		/** 取消流程*/
		handlers.cancelBtn = function() {
			var that = this.global();
			//验证
			//if ( !that.vars.validator.form() ) return;
			
			var data = that.handlers.serizable();
			if(!data)
			{
			  return;
			}
			that.loading.show(); 			
			$.ajax( {
				url: "approve/process/cancelbtn",
				type: "POST",
				data: data,
				complete: function() {
					//$button.disabled( false );
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
		
		handlers.workflowchart = function(taskKey, templateKey)
		{
			var that = this.global();
			that.vars.aprinfolistModule = that.module.open({
				title: "流程图",
				style: "margin-top: 15px; margin-bottom: 15px;",
				url:"flow/flowapr/workflowchart",
				toggleOpen:false,
				content: "#workflowchart",
				params: {
					taskKey: taskKey,
					templateKey: templateKey
				}
			} );
		};

		// 审批列表信息
		handlers.insertapprListNodeInfo = function(taskKey, templateKey)
		{
			var that = this.global();
			that.vars.aprinfolistModule = that.module.open({
				title: "历史处理信息列表",
				style: "margin-top: 15px; margin-bottom: 15px;",
				url:"flow/flowapr/aprinfolistview",
				toggleOpen:false,
				content: "#aprlistinfo",
				params: {
					taskKey: taskKey,
					templateKey: templateKey
				}
			} );
		};
		
	};
	
	return Global;
});