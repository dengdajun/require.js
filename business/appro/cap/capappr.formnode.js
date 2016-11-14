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
			if ( !that.params.item ) return;
			that.handlers.load( that.params.item );
		};
		
		//验证组件
		that.valdiate = function() {
			var that = this.global(); 
			//jquery-validate 验证form表单元素
			that.vars.validator = that.selector.find( "form" ).validate( {
				rules: {
					apprStep: { required: true }
				}
			} );
		};
		
		//页面布局
		that.layout = function() {
			
			var that = this.global();//获取组件的全局对象
			
			that.selector.find( ".input" ).input( {} );//实例input插件
			that.selector.find( "input[name=isLastNode]" ).select( {//实例下拉插件
				code: { type: "Is_No" }
			} );
			that.selector.find( "input[name=apprStep]" ).select( {//实例下拉插件
				code: { type: "Aprov_Step" },
			} );
			that.selector.find( "input[name=apprType]" ).select( {//实例下拉插件
				code: { type: "Appr_Type" },
				events:{
					change:{
						data: {},
						handler: function (event, val, item) {
							if('24100001'==val){//占比
								$(".groupNo").parent().hide();
								$(".url").parent().hide();
								$(".groupNo").attr("disabled",true);
								$(".url").attr("disabled",true);
							}else if('24100002'==val){
								$(".groupNo").parent().show();
								$(".url").parent().show();
								$(".groupNo").attr("disabled",false);
								$(".url").attr("disabled",false);
							}
						}
					}
				}
			} );
			
			that.selector.find( "input[name=ruleId]" ).select( {//实例下拉插件
				remote: {
					url: "appro/cap/ruleId",
					type: 'POST'
				}
			} );
			
			that.selector.find( "input[name=disRuleId]" ).select( {//实例下拉插件
				remote: {
					url: "appro/cap/disRuleId",
					type: 'POST'
				}
			} );
			that.selector.find( "input[name=groupNo]" ).select( {//实例下拉插件
				remote: {
					url: "appro/cap/groupNo",
					type: 'POST'
				}
			} );
			//保存事件
			that.selector.find( "#submitBtn" ).click( function(event) {
				that.handlers.save();
				return false;
			});
			
			//关闭事件
			that.selector.find( "#closeBtn" ).click( function(event) {
				that.close();
				return false;
			});
		};
		
		
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		/** 加载数据*/
		handlers.load = function( item ) {
			var that = this.global();
			that.selector.find( ":input[name=flowId]" ).valChange( item.flowId ); 
			that.selector.find( ":input[name=flowName]" ).valChange( item.flowName ); 
			that.selector.find( ":input[name=post]" ).valChange( ); 
			that.selector.find( ":input[name=nodeNo]" ).valChange( ); 
			that.selector.find( ":input[name=nodeNames]" ).valChange(  ); 
			that.selector.find( ":input[name=nodeOrder]" ).valChange( ); 
			that.selector.find( ":input[name=isLastNode]" ).valChange(  ); 
			that.selector.find( ":input[name=apprType]" ).valChange( );
			that.selector.find( ":input[name=apprStep]" ).valChange( );
			that.selector.find( ":input[name=ruleId]" ).valChange( ); 
			that.selector.find( ":input[name=disRuleId]" ).valChange(); 
			that.selector.find( ":input[name=groupNo]" ).valChange(); 
			that.selector.find( ":input[name=url]" ).valChange(  ); 
		};
		
		/** 保存*/
		handlers.save = function() {
			var that = this.global();
			//验证
			if ( !that.vars.validator.form() ) return;
			//动态验证
			var apprStep = that.selector.find("input[name=apprStep]").val()
			var apprType = that.selector.find("input[name=apprType]").val()
			if('24100002' == apprType){
				if('27700001' == apprStep || '27700002' == apprStep || '27700004' == apprStep){
					var groupNo = that.selector.find("input[name=groupNo]").val()
					if("" == groupNo){
						that.selector.find( "input[name=groupNo]" ).validErrorTip("执行组不能为空！！！");
						return;
					}
				}
			}
			//jquery 表单数据序列化 必须是form表单中元素
			var data = that.selector.find( "form" ).serialize();
			//冻结功能
			//方案1 冻结自己的按钮
			//方案2 显示当前页的loading
			//var $button = that.selector.find( "#submitBtn" );
			//$button.disabled( true );
			that.loading.show(); 
			
			$.ajax( {
				url: "appro/cap/savenode",
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
	};
	return Global;
});