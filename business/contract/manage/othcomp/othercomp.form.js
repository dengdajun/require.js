define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
//		var moment = require( "moment" );
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
					compNo: { required: true },
					compName: { required: true },
					compAddr: { required: true}
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
			
			
			that.selector.find( ".input" ).input( {} );//实例input插件
		};	
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		/** 加载数据*/
		handlers.load = function( item ) {
			var that = this.global();
			item.id && that.selector.find( ":input[name=id]" ).valChange( item.id );
			item.compNo && that.selector.find( ":input[name=compNo]" ).valChange( item.compNo );
			item.compNo && that.selector.find( ":input[name=compNo]" ).readonly( true );
			item.compName && that.selector.find( ":input[name=compName]" ).valChange( item.compName );
			item.compAddr && that.selector.find( ":input[name=compAddr]" ).valChange( item.compAddr );
			item.phone && that.selector.find( ":input[name=phone]" ).valChange( item.phone );
			item.email && that.selector.find( ":input[name=email]" ).valChange( item.email );
		};
		
		/** 保存*/
		handlers.save = function() {
			var that = this.global();
			//验证
			if ( !that.vars.validator.form() ) return;
			var data = that.selector.find( "form" ).serialize();
			that.loading.show(); 
			$.ajax( {
				url: "other/comp/save",
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