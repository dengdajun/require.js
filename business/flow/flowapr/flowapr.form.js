define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
		
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
			this.load();
			this.valdiate();
		};
		
		//初始化远程请求处理
		that.load = function() {
			var that = this.global();
			that.handlers.load( that.params.taskKey, that.params.templateKey );
		};
		
		//验证组件
		that.valdiate = function() {
			var that = this.global(); 
			//jquery-validate 验证form表单元素
			that.vars.validator = that.selector.find( "form" ).validate( {
				rules: {
				}
			} );
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			
			//click事件
			that.selector.find( "#nextExecutorName" ).click( function(event) {
				that.handlers.nameclick();
				return false;
			});
			that.selector.find( ".input" ).input();
			/*that.selector.find( ".input" ).input( {
				cssCol: "col-xs-12",
				cssLabel: "col-xs-6 col-md-4"
			} );*/	
		};
		
		
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		/** 加载数据*/
		handlers.load = function( taskKey,  templateKey) {
			var that = this.global();
			if(taskKey == "")
				that.selector.find( "#tr_memo" ).hide();
			
			that.selector.find( ":input[name=taskKey]" ).valChange( taskKey);
			that.selector.find( ":input[name=templateKey]" ).valChange( templateKey);
			
			//审批信息节点
			that.handlers.apprNodeInfo(taskKey, templateKey);
			
		};
		
		handlers.nameclick = function()
		{
			var that = this.global();

			var taskKey = that.selector.find( ":input[name=taskKey]" ).val();
			var nextNodeKey =  $('input:radio[name=nextNodeKey]:checked').val();
			var templateKey = that.selector.find( ":input[name=templateKey]" ).val();
			if(nextNodeKey == undefined)
			{
				that.dialog.alert( "没有选择下一处理节点,不能进行处理人员查询选择!" );
				return;
			}
			
			that.modal.open( {
				title: "流程管理| 人员选择",
//				url: "pub/asysatt/seletuser",    // 公用
//				url: "safety/sysinfo/userOrgSfty",  //  安全案件审批
				url: "flow/flowapr/userOrgSfty",  //  安全案件审批
				size: "modal-md",
				params: {
					taskKey: taskKey,
					nextNodeKey: nextNodeKey,
					templateKey: templateKey,
					settings: {
						multi: false,
						selectedUserNo: that.selector.find( ":input[name=nextExecutorNo]" ).val(),
						
					}
				},
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						
						// 多选
//						that.selector.find( ":input[name=nextExecutorNo]" ).valChange( data.userNos.join( "," ) );
//						$nextExecutorName.valChange( data.userNames.join( ",") );
						// 单选
						that.selector.find( ":input[name=nextExecutorName]" ).valChange( data.userName );
						that.selector.find( ":input[name=nextExecutorNo]" ).valChange( data.userNo );
					}
				}
			} );
		};
		
		
		handlers.apprNodeInfo = function(taskKey, templateKey)
		{
			var data = [];
			data.push( "params[taskKey]=" + taskKey);
			data.push("params[templateKey]=" + templateKey);
			
			$.ajax( {
//				url: "safety/sysinfo/queryTreeUserInfo",
				url: "flow/flowapr/queryNextNodeInfo",
				type: "POST",
				data: data.join("&"),
				complete: function() {
//					that.loading.hide();
				},
				success: function( data ) {
					if ( !data.success ) {
						return message.error( data.msg );
					}
					var list = data.list || [], obj;
					var shtml = "";
					for(var i = 0; i < list.length; i++)
					{
						obj = list[i];
						if(i == 0)
							shtml = "<input type=\"radio\" name=\"nextNodeKey\" value=\"" + obj.nodeKey + "\" /> " + obj.nodeName;
						else
							shtml += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type=\"radio\" name=\"nextNodeKey\" value=\"" + obj.nodeKey + "\" /> " + obj.nodeName;
					}
//					alert(shtml);
					
					$("#nextNodekeyid").html(shtml);
					
					if(list.length > 0)
						that.selector.find( "input:radio[name=nextNodeKey]" ).change(
							function() {
								that.selector.find( ":input[name=nextExecutorNo]" ).val("");
								that.selector.find( ":input[name=nextExecutorName]" ).val("");
							}
							
						);
				}
			});
		};
		
		
	};
	
	
	return Global;
});