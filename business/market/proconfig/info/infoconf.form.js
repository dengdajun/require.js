define(function () { 
	
	function Global( vars ) {
		
		//=======================================================
		//获取基础组件
		//=======================================================
		var $ = require( "jquery" )
			, base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
		var moment = require( "moment" );
		base.code.cache( "Is_No","Prod_Type","Goods_Type","Cust_Type","First_Pay_Type","Prod_State");
		
		//=======================================================
		//当前组件
		//=======================================================
		var that = this;
		var vars = that.vars = $.extend( true, {}, vars );
		var handlers = that.handlers = {};//处理程序
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
			that.loading.show();
			$.ajax( {
				url: "market/proconfig/prod/getProdRela",
				type: "POST",
				async: false,
				data: {"prodNo":that.params.item.prodNo},
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
					that.params.item.repayTyp=data.repayTyp;
				}
			} );
			that.handlers.load( that.params.item );
		};
		
		//验证组件
		that.valdiate = function() {
			var that = this.global();
			
			that.vars.validator = that.selector.find( "form" ).validate( {
				rules: {
					prodNo: { required: true },
					prodName: { required: true },
					prodTyp: { required: true },
					fstPayTyp: {required: true },
					fstPayVal: {required: true ,isNumber:true},
					minAmt: {required: true ,isNumber:true},
					maxAmt: {required: true ,isNumber:true},
					repayKind: {required: true },
					repayTyp: {required: true },
					startDate: {required: true },
					endDate: {required: true }
				}
			} );
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			//保存事件
			that.selector.find( "#infoSubmitBtn" ).click( function(event) {
				that.handlers.save();
				return false;
			});
			//关闭事件
			that.selector.find( "#infoCloseBtn" ).click( function(event) {
				that.close();
				return false;
			});
			
			that.selector.find( "input[name=prodTyp]" ).select( {
				code: { type: "Prod_Type" }
			} );
			that.selector.find( "input[name=goodsType]" ).select( {
				multi: true,
				code: { type: "Goods_Type" }
			} );
			that.selector.find( "input[name=fstPayTyp]" ).select( {
				code: { type: "First_Pay_Type" },
				events:{
					change:{
						data: {},
						handler: function (event, val, item) {
							if('16400001'==val){//占比
								that.selector.find("input[name=fstPayVal]").prev().html('首付值 %');
							}else{
								that.selector.find("input[name=fstPayVal]").prev().html('首付值');
							}
						}
					}
				}
			} );
			that.selector.find( "input[name=raiseTye]" ).select( {
				code: { type: "First_Pay_Type" }
			} );
			that.selector.find( "input[name=repayKind]" ).select( {
				remote: {
					url: "market/proconfig/info/getRepayKindSelect",
					type: 'POST'
				}
			} );
			that.selector.find( "input[name=repayTyp]" ).select( {
				multi: true,
				remote: {
					url: "market/proconfig/info/getRepayTypSelect",
					type: 'POST'
				}
			} );
			that.selector.find( "input[name=contract]" ).select( {
				code: { type: "Is_No" }
			} );
			that.selector.find( "input[name=startDate]" ).datetimepicker( {
				//maxDate: moment(that.vars.nowDate).format("YYYY-MM-DD")
			} );
			that.selector.find( "input[name=endDate]" ).datetimepicker( {
				//maxDate: moment(that.vars.nowDate).format("YYYY-MM-DD")
			} );
			that.selector.find( ".input" ).input( {} );
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( item ) {
			var that = this.global();
			that.selector.find( ":input[name=prodNo]" ).valChange( item.prodNo );
			that.selector.find( ":input[name=prodName]" ).valChange( item.prodName );
			that.selector.find( ":input[name=prodTyp]" ).valChange( item.prodTyp );
			that.selector.find( ":input[name=goodsType]" ).valChange( item.goodsType );
			that.selector.find( ":input[name=fstPayTyp]" ).valChange( item.fstPayTyp );
			that.selector.find( ":input[name=fstPayVal]" ).valChange( item.fstPayVal );
			that.selector.find( ":input[name=minAmt]" ).valChange( item.minAmt );
			that.selector.find( ":input[name=maxAmt]" ).valChange( item.maxAmt ); 
			that.selector.find( ":input[name=repayKind]" ).valChange( item.repayKind );
			that.selector.find( ":input[name=contract]" ).valChange( item.contract );
			that.selector.find( ":input[name=startDate]" ).valChange( moment(item.startDate).format("YYYY-MM-DD") );
			that.selector.find( ":input[name=endDate]" ).valChange( moment(item.endDate).format("YYYY-MM-DD") );
			that.selector.find( ":input[name=prodRemark]" ).valChange( item.prodRemark );
			that.selector.find( ":input[name=repayTyp]" ).valChange( item.repayTyp );
			that.selector.find( ":input[name=prodNo]" ).attr( "readonly","readonly" );
		};
		handlers.save = function() {
			var that = this.global();
			//验证
			var prodStat = $("#prodStat").val();
			if(prodStat == '16500002'){
				return message.error( '产品销售中...禁止操作' );
			}
			if ( !that.vars.validator.form() ) return;
			if(parseInt(that.selector.find("input[name=minAmt]").val()) > parseInt(that.selector.find("input[name=maxAmt]").val())){
				that.selector.find( "input[name=minAmt]" ).validErrorTip("不能大于最高值");
				that.selector.find( "input[name=maxAmt]" ).validErrorTip("不能小于最低值");
				return;
			}else{
				that.selector.find( "input[name=minAmt]" ).validErrorTip("");
				that.selector.find( "input[name=maxAmt]" ).validErrorTip("");
			}
			if(moment(that.selector.find( "input[name=startDate]" ).val()).format('X') > moment(that.selector.find( "input[name=endDate]" ).val()).format('X')){
				that.selector.find( "input[name=startDate]" ).validErrorTip("不能大于结束时间");
				that.selector.find( "input[name=endDate]" ).validErrorTip("不能小于开始时间");
				return;
			}else{
				that.selector.find( "input[name=startDate]" ).validErrorTip("");
				that.selector.find( "input[name=endDate]" ).validErrorTip("");
			}
			
			var data = that.selector.find( "form" ).serialize();
			data=data+"&id="+$("#prodId").val();
			that.loading.show(); 
			$.ajax( {
				url: "market/proconfig/info/save",
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
					if(!$( "#prodId" ).val()){
						$( "#prodId" ).val(data.t.id);
						$( "#prodNo" ).val(data.t.prodNo);
					}
				}
			} );
		};
	};
	return Global;
} );