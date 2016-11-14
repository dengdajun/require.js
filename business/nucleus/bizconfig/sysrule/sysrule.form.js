define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
		base.code.cache( "Rule_Type,Sql_Type" );
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
			if(that.params.item.ruleId){
				that.handlers.editLoad( that.params.item );
			}else{
				that.handlers.addLoad( that.params.item );
			}
		};
		
		//验证组件
		that.valdiate = function() {
			var that = this.global();
			//jquery-validate 验证form表单元素
			that.vars.validator = that.selector.find( "form" ).validate( {
				rules: {
					ruleId: { required: true , maxlength:100},
					ruleName: { required: true , maxlength:100},
					ruleType: { required: true , maxlength:100},
					ruleDet: { required: true , maxlength:4000},
					sqlType: { required: true },
				    ruleRemark: { required: true , maxlength:200}
				}
			} );
		};
		
		//页面布局
		that.layout = function() {
			//获取组件的全局对象
			var that = this.global();
			
			
			
			that.selector.find( "input[name=ruleType]" ).select( {
				code: { type: "Rule_Type" }
			} );
			
			that.selector.find( "input[name=sqlType]" ).select( {
				code: { type: "Sql_Type" },
				events: {
					change: {
						data: {},
						handler: function (event, val, item) {
							var sqlType = that.selector.find( "input[name=sqlType]" ).val();
							if("34400002"==sqlType){
								that.selector.find( "#config-Btn" ).show();
								
							}else{
								that.selector.find( "#config-Btn" ).hide();
							}
							
						}
					}
				}
			} );
			//实例input插件
			that.selector.find( ".input" ).input( {} );
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
			//配置按钮
			that.selector.find( "#configBtn" ).click( function(event) {
				that.handlers.sqlConfig();
				return false;
			});
		};
		
		
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		/** 加载数据*/
		handlers.addLoad = function( item ) {
			var that = this.global();
			that.selector.find( ":input[name=typeCode]" ).valChange( item.typeCode );
		};
		handlers.editLoad = function( item ) {
			var that = this.global();
			that.selector.find( ":input[name=id]" ).valChange( item.id );
			that.selector.find( ":input[name=ruleId]" ).valChange( item.ruleId );
			that.selector.find( ":input[name=ruleType]" ).valChange( item.ruleType );
			that.selector.find( ":input[name=ruleName]" ).valChange( item.ruleName );
			that.selector.find( ":input[name=ruleDet]" ).valChange( item.ruleDet ); 
			that.selector.find( ":input[name=ruleRemark]" ).valChange( item.ruleRemark ); 
			that.selector.find( ":input[name=inPar]" ).valChange( item.inPar ); 
			that.selector.find( ":input[name=outPar]" ).valChange( item.outPar ); 
			that.selector.find( ":input[name=sqlType]" ).valChange( item.sqlType ); 
			that.selector.find( ":input[name=ruleId]" ).disabled(true);
		};
		
		/** 保存*/
		handlers.save = function() {
			var that = this.global();
			//验证
			if ( !that.vars.validator.form() ) return;
			
			//jquery 表单数据序列化 必须是form表单中元素
			var data = that.selector.find( "form" ).serialize();
			
			that.loading.show(); 
			$.ajax( {
				url: "nucleus/bizconfig/sysrule/save",
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
					that.close( data );
				}
			} );
			
		};
		/** 配置sql*/
		handlers.sqlConfig = function() {
			var that = this.global();
			that.modal.open( {
				title: "sql配置",
				url: "nucleus/bizconfig/sysrule/sqlConfig",
				size: "modal-lg",
				params: {},
				events: {
					hiden: function( closed, data ) {
						if(closed){
							that.selector.find( ":input[name=ruleDet]" ).valChange( data ); 
						}
					}
				}
			} );
			
		};
	};
	
	return Global;
});