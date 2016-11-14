define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
		var moment = require( "moment" );
		base.code.cache( "yon" );
		
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
					amount: {required:true,number:true,min:0,max:999999999},
					number: {required:true,number:true,min:0,max:999999999},
					rate: {required:true,min:0,max:1 }
				}
			} );
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			that.selector.find( "#calcBtn" ).click( function(event) {
				that.handlers.calc();
				return false;
			});
			that.selector.find( ".input" ).input( {} );//实例input插件
			
			var calcGridConfig = {
				autoLoad: false,
				checkCol: false,
				indexCol: false,
				sort:false,
		        multi: false,
		        page: false,
		        plugins: [],
		        customEvents: []
			};
			calcGridConfig.cols = cols = [];
			cols[ cols.length ] = { title: "期数", name: "instNum", width: "60px", lockWidth: true };
			cols[ cols.length ] = { title: "月还款(元)", name: "monAmt", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "还款日", name: "dayAmt", width: "100px", lockWidth: true };
			that.vars.calcGrid = that.selector.find( "#calcGrid" ).grid( calcGridConfig );
		};
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		/** 加载数据*/
		handlers.load = function( item ) {
			var that = this.global();
			that.selector.find( ":input[name=repayName]" ).valChange( item.repayName );
			that.selector.find( ":input[name=ruleId]" ).valChange( item.ruleId );
			that.selector.find( ":input[name=repayName]" ).disabled( true );
			that.selector.find( ":input[name=ruleId]" ).disabled( true );
			that.selector.find( ":input[name=calcResult]" ).disabled( true );
		};
		
		handlers.calc = function() {
			var that = this.global();
			//验证
			if ( !that.vars.validator.form() ) return;
			var data=that.params.item;
			data.amount=that.selector.find(":input[name='amount']").val();
			data.rate=that.selector.find(":input[name='rate']").val();
			data.number = that.selector.find(":input[name='number']").val();
			that.loading.show();
			handlers.cleanGrid();
			$.ajax( {
				url: "nucleus/bizconfig/repaykindconf/calc",
				type: "POST",
				contentType:"application/json",
				data: JSON.stringify(that.params.item),
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
					that.vars.calcGrid.insertRows(data.list);
				}
			} );
		};
		
		handlers.cleanGrid = function() {
			var that = this.global();
			var arr=[];
			$.each( that.vars.calcGrid.getAllRows(), function( index, item ) {
				arr.push(index);
			} );
			that.vars.calcGrid.removeRows(arr);
		};
	};
	
	return Global;
});