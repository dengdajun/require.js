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
					jfProd: { required: true },
					compName: { required: true },
					bankAcctNo: { required: true},
					openOrg: { required: true },
					openCity: { required: true },
					regalName: { required: true },
					regalCertNo: { required: true },
					phoneNo: { required: true },
					isUse: { required: true }
				}
			} );
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			
			that.selector.find( "input[name=jfProd]" ).select( {//实例下拉插件
				remote: {
					url: 'brhpass/acct/jfProdLst',
					params: '',
					type: 'POST',
					dataType: 'json',
					error: function () {},
					callback: function (data) {
						return data;
					}
				}
			} );
			
			that.selector.find( "input[name=isUse]" ).select( {//实例下拉插件
				code: { type: "Is_No" }
			} );
			
			that.selector.find( ".input" ).input( {} );//实例input插件
			
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
			console.log(item)
			that.selector.find( ":input[name=id]" ).valChange( item.id );
			that.selector.find( ":input[name=branchNo]" ).valChange( item.branchNo );
			that.selector.find( ":input[name=branchName]" ).valChange( item.branchName );
			that.selector.find( ":input[name=jfProd]" ).valChange( item.jfProd );
			that.selector.find( ":input[name=compName]" ).valChange( item.compName );
			that.selector.find( ":input[name=bankAcctNo]" ).valChange( item.bankAcctNo );
			that.selector.find( ":input[name=openOrg]" ).valChange( item.openOrg );
			that.selector.find( ":input[name=openCity]" ).valChange( item.openCity );
			that.selector.find( ":input[name=regalName]" ).valChange( item.regalName );
			that.selector.find( ":input[name=regalCertNo]" ).valChange( item.regalCertNo );
			that.selector.find( ":input[name=phoneNo]" ).valChange( item.phoneNo );
			that.selector.find( ":input[name=isUse]" ).valChange( item.isUse );
			that.selector.find( ":input[name=openArea]" ).valChange( item.openArea );
			
		};
		
		/** 保存*/
		handlers.save = function() {
			var that = this.global();
			//验证
			if ( !that.vars.validator.form() ) return;
			var data = that.selector.find( "form" ).serialize();
			that.loading.show(); 
			$.ajax( {
				url: "brhpass/acct/save",
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