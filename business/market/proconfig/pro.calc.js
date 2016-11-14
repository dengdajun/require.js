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
		that.load = function() {
			var that = this.global();
			if ( !that.params.item ) return;
			that.loading.show();
			$.ajax( {
				url: "market/proconfig/prod/getProdFee",
				type: "POST",
				async: false,
				data: {"prodNo":that.params.item.prodNo},
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
					that.params.item.fees=data;
				}
			} );
			that.handlers.load( that.params.item );
		};
		//验证组件
		that.valdiate = function() {
			var that = this.global();
			that.vars.validator = that.selector.find( "form" ).validate( {
				rules: {
					goodsAmt: {required:true,number:true,min:0,max:99999999},
					payAmt: {required:true,number:true,min:0,max:99999999},
					instNum: {required:true}
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
			that.selector.find( "input[name=instNum]" ).select( {
				remote: {
					url: "market/proconfig/prod/getProdInstNum?prodNo="+that.params.item.prodNo,
					type: 'POST'
				}
			} );
			that.selector.find( ".input" ).input( {} );
			
			var calcGridConfig = {
					autoLoad: false,
					checkCol: false,
					indexCol: false,
					sort:false,
//					remote: {
//			        	url: "market/proconfig/prod/calc",
//			            params: {}
//			        },
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
			that.selector.find( ":input[name=prodNo]" ).valChange( item.prodNo );
			that.selector.find( ":input[name=prodName]" ).valChange( item.prodName );
			that.selector.find( ":input[name=prodNo]" ).attr( "readonly","readonly" );
			that.selector.find( ":input[name=prodName]" ).attr( "readonly","readonly" );
			$.each(item.fees,function(index,fee){
				if(fee.isSel=="13900001"){
					$( tools.format( '<input type="text" class="select fee-no" name="{feeNo}" />', fee ) ).appendTo(that.selector.find('#row')).select( {
						txtLabel: fee.feeName,
						code: { type: "Is_No" }
					} ).valChange("13900001");
				}else{
					$('<input type="hidden" class="select fee-no" name="'+fee.feeNo+'" />').appendTo(that.selector.find('#row')).val("13900001");
				}
			});
		};
		
		handlers.calc = function() {
			var that = this.global();
			var names= that.selector.find("input[class*='fee-no']")
					.filter( function(index,item){return $(item).val()=="13900001";} )
					.map( function(index,item){ return $(item).attr("name");} );
			if ( !that.vars.validator.form() ) return;
			handlers.cleanGrid();
			var data = {
				prodNo:that.selector.find(":input[name='prodNo']").val(),
				goodsAmt:that.selector.find(":input[name='goodsAmt']").val(),
				payAmt:that.selector.find(":input[name='payAmt']").val(),
				instNum:that.selector.find(":input[name='instNum']").val(),
				feeNos:$.makeArray(names).join()
			};
			that.loading.show();
			$.ajax( {
				url: "market/proconfig/prod/calc",
				type: "POST",
				contentType:"application/json",
				data: JSON.stringify(data),
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
					that.vars.calcGrid.insertRows(data);
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