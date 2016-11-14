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
					chanNo: { required: true },
					batchNo: { required: true },
					totalAmt: { required: true ,isNumber:true},
					payDate: { required: true },
					begIntDate: { required: true },
					dueDate: { required: true },
					invIntRate: { required: true ,isNumber:true,range:[1,100]},
					fundIntRate: { required: true ,isNumber:true,range:[1,100]}
				}
			} );
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			
			that.selector.find( ".input" ).input( {} );//实例input插件
			that.selector.find( "input[name=stat]" ).select( {
				code: { type: "Is_No" }
			} );
			that.selector.find( "input[name=batchNo]" ).datetimepicker({
				format : "YYYYMMDD"
			});
			that.selector.find( "input[name=payDate]" ).datetimepicker({
				format : "YYYYMMDD"
			});
			that.selector.find( "input[name=begIntDate]" ).datetimepicker({
				format : "YYYYMMDD"
			});
			that.selector.find( "input[name=dueDate]" ).datetimepicker({
				format : "YYYYMMDD"
			});
			
			that.selector.find( "input[name=chanNo]" ).select( {//实例下拉插件
				remote: {
					url: "operate/channel/receipts/rule",
					type: 'POST'
				},
				events: {
					change: {
						data: {},
						handler: function (event, val, items) {
							$.ajax( {
								url: "operate/channel/receipts/def",
								type: "POST",
								data: {chanNo :val},
								success: function( data ) {
									if ( !data.success ) {
										that.handlers.echo(data);
									}
								}
							} );
						}
						
					}
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
			that.selector.find( ":input[name=id]" ).valChange( item.id );
			that.selector.find( ":input[name=chanNo]" ).valChange( item.chanNo ); 
			that.selector.find( ":input[name=batchNo]" ).valChange( item.batchNo ); 
			that.selector.find( ":input[name=totalAmt]" ).valChange( item.totalAmt );
			that.selector.find( ":input[name=payDate]" ).valChange( item.payDate );
			that.selector.find( ":input[name=begIntDate]" ).valChange( item.begIntDate );
			that.selector.find( ":input[name=dueDate]" ).valChange( item.dueDate );
			that.selector.find( ":input[name=invIntRate]" ).valChange( item.invIntRate ); 
			that.selector.find( ":input[name=fundIntRate]" ).valChange( item.fundIntRate ); 
			
		};	
		
		handlers.echo = function(item){
			var that = this.global();
			if ( that.params.item ) return;
			that.selector.find( ":input[name=invIntRate]" ).valChange( item.invIntRate ); 
			that.selector.find( ":input[name=fundIntRate]" ).valChange( item.fundIntRate ); 
		}
		/** 保存*/
		handlers.save = function() {
			var that = this.global();
			//验证
			if ( !that.vars.validator.form() ) return;
			if(moment(that.selector.find( "input[name=dueDate]" ).val()).format('X') < moment(that.selector.find( "input[name=begIntDate]" ).val()).format('X')){
				that.selector.find( "input[name=dueDate]" ).validErrorTip("不能小于起息日时间");
				that.selector.find( "input[name=begIntDate]" ).validErrorTip("不能大于到息日时间");
				return;
			}else if(moment(that.selector.find( "input[name=begIntDate]" ).val()).format('X') < moment(that.selector.find( "input[name=payDate]" ).val()).format('X')){
				that.selector.find( "input[name=begIntDate]" ).validErrorTip("不能小于放款时间");
				that.selector.find( "input[name=payDate]" ).validErrorTip("不能大于起息时间");
				return;
			}
			var data = that.selector.find( "form" ).serialize();
			that.loading.show(); 
			$.ajax( {
				url: "operate/channel/receipts/save",
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