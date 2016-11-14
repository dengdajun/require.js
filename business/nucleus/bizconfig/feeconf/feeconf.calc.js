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
			this.loadInput();
			this.load();
			this.layout();
			this.valdiate();
		};
		
		//初始化远程请求处理
		that.load = function() {
			var that = this.global();
			if ( !that.params.item ) return;
			that.handlers.load( that.params.item );
		};
		that.loadInput = function (){
			var that = this.global();
			if ( !that.params.item ) return;
			that.handlers.loadInput( that.params.item );
		}
		
		//验证组件
		that.valdiate = function() {
			var that = this.global();
			that.vars.validator = that.selector.find( "form" ).validate( {
				rules: {
					amount: {required:true,number:true,min:0,max:999999999},
					rate: {required:true,min:0,max:100}
				}
			} );
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			that.selector.find( ".calcBtn" ).click( function(event) {
				that.handlers.calc();
				return false;
			});
			that.selector.find( ".input" ).input( {} );//实例input插件
			
			var inputParams = that.params.rule.inputParams;
			if(!inputParams) {that.close();return;}
			//if(inputParams.length==1&&inputParams[0]=="") {that.close();return;}
			
				if(inputParams.length == 2){
					that.selector.find( "#inputParams_two" ).show();
					that.selector.find( "#inputParams_three" ).remove();
					that.selector.find( "#inputParams_one" ).remove();
				}else if(inputParams.length == 3){
					that.selector.find( "#inputParams_three" ).show();
					that.selector.find( "#inputParams_two" ).remove();
					that.selector.find( "#inputParams_one" ).remove();
				}else{
					that.selector.find( "#inputParams_one" ).show();
					that.selector.find( "#inputParams_three" ).remove();
					that.selector.find( "#inputParams_two" ).remove();
				}
			
		};
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		/** 加载数据*/
		
		//根据计算规则动态生成input标签
		handlers.loadInput = function (item){
			var that = this.global();
			that.params.rule = {};
			$.ajax({
				url:'nucleus/bizconfig/feeconf/loadRule',
				type:'POST',
				async:false,
				contentType:"application/json",
				data: JSON.stringify(that.params.item),
				success:function (data){
					if(data.success){
						that.params.rule = data.map;
					}
				}
				
			});
		};
		
		handlers.load = function( item ) {
			var that = this.global();
			that.selector.find( ":input[name=feeName]" ).valChange( item.feeName );
			that.selector.find( ":input[name=ruleId]" ).valChange( item.ruleId );
			that.selector.find( ":input[name=feeName]" ).disabled( true );
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
			data.overDay=that.selector.find(":input[name='overDay']").val();
			that.loading.show();
			$.ajax( {
				url: "nucleus/bizconfig/feeconf/calc",
				type: "POST",
				contentType:"application/json",
				data: JSON.stringify(that.params.item),
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
					that.selector.find( ":input[name=calcResult]" ).valChange( data.map.calcResult );
				}
			} );
		};
	};
	
	return Global;
});