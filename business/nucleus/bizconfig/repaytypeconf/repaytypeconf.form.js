define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
		base.code.cache( "stat,sex,certType" );
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
			if(that.params.item.id){
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
					confNo: { required: true },
					confName: { required: true },
					ruleId: { required: true }
				}
			} );
		};
		
		//页面布局
		that.layout = function() {
			//获取组件的全局对象
			var that = this.global();
			//实例input插件
			that.selector.find( ".input" ).input( {} );
			
			that.selector.find( "input[name=ruleId]" ).select( {
				remote: {
					url: "nucleus/bizconfig/sysrule/getSelectList?ruleType=24400001",
					type: 'POST'
//					params:{'params[ruleType]':'24400001'}
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
		handlers.addLoad = function( item ) {
			var that = this.global();
			that.selector.find( ":input[name=typeCode]" ).valChange( item.typeCode );
		};
		handlers.editLoad = function( item ) {
			var that = this.global();
			that.selector.find( ":input[name=id]" ).valChange( item.id );
			that.selector.find( ":input[name=confNo]" ).valChange( item.confNo );
			that.selector.find( ":input[name=ruleId]" ).valChange( item.ruleId );
			that.selector.find( ":input[name=confName]" ).valChange( item.confName );
			that.selector.find( ":input[name=repayCond]" ).valChange( item.repayCond ); 
			that.selector.find( ":input[name=ruleDet]" ).valChange( item.ruleDet );
			that.selector.find( ":input[name=confRemark]" ).valChange( item.confRemark );
			that.selector.find( ":input[name=confNo]" ).attr("readonly","readonly");
		};
		/** 保存*/
		handlers.save = function() {
			var that = this.global();
			//验证
			if ( !that.vars.validator.form() ) return;
			
			var data = that.selector.find( "form" ).serialize();
			that.loading.show(); 
			
			$.ajax( {
				url: "nucleus/bizconfig/repaytypeconf/save",
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