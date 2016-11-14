define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
		var moment = require( "moment" );
		base.code.cache( "Is_No" );
		
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
			that.vars.validator = that.selector.find( "form" ).validate( {
				rules: {
					feeNo: { required: true },
					typ: { required: true },
					feeName: { required: true },
					subjNo: {required: true },
					feeTyp: {required: true },
					validFlag: {required: true }
				}
			} );
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
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
			
			that.selector.find( "input[name=feeTyp]" ).select( {
				code: { type: "Is_No" }
			} );
			that.selector.find( "input[name=validFlag]" ).select( {
				code: { type: "Is_No" }
			} );
			that.selector.find( "input[name=feeValTyp]" ).select( {
				code: { type: "First_Pay_Type" }
			} );
			that.selector.find( "input[name=feeBelong]" ).select( {
				code: { type: "Fee_Belong" }
			} );
			that.selector.find( "input[name=ruleId]" ).select( {
				remote: {
					url: "nucleus/bizconfig/sysrule/getSelectList?ruleType=24400003",
					type: 'POST'
					//params:{'params[ruleType]':'24400003'}
				}
			} );
			that.selector.find( ".input" ).input( {} );//实例input插件
		};
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		/** 加载数据*/
		handlers.load = function( item ) {
			var that = this.global();
			that.selector.find( ":input[name=id]" ).valChange( item.id ); 
			that.selector.find( ":input[name=feeNo]" ).valChange( item.feeNo ); 
			that.selector.find( ":input[name=feeName]" ).valChange( item.feeName );
			that.selector.find( ":input[name=subjNo]" ).valChange( item.subjNo );
			that.selector.find( ":input[name=feeValTyp]" ).valChange( item.feeValTyp );
			that.selector.find( ":input[name=ruleId]" ).valChange( item.ruleId );
			that.selector.find( ":input[name=feeTyp]" ).valChange( item.feeTyp );
			that.selector.find( ":input[name=validFlag]" ).valChange( item.validFlag );
			that.selector.find( ":input[name=feeRemark]" ).valChange( item.feeRemark ); 
			that.selector.find( ":input[name=feeNo]" ).disabled( true );
		};
		
		/** 保存*/
		handlers.save = function() {
			var that = this.global();
			//验证
			if ( !that.vars.validator.form() ) return;
			var data = that.selector.find( "form" ).serialize();
			that.loading.show(); 
			$.ajax( {
				url: "nucleus/bizconfig/feeconf/save",
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
	};
	
	return Global;
});