define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
//		var moment = require( "moment" );
		base.code.cache( "Is_No,Sign_Type,Sign_Body,Elec_Sign_Type" );
		
		//=======================================================
		// 当前组件
		//=======================================================
		var that = this; //全局对象
		var vars = this.vars = {};//全局变梁
		var handlers = this.handlers = {};//处理程序
		handlers.global = function() { return that; };
		var styctr = this.styctr = {};
		styctr.global = function() { return that; };
		
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
					elecSignType:{ required: true },
					signBody: { required: true},
					signType: { required: true }
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
			
			that.selector.find( "input[name=signBody]" ).select( {
				code: { type: "Sign_Body" }
			} );
			
			that.selector.find( "input[name=signType]" ).select( {
				code: { type: "Sign_Type" }
			} );

			that.selector.find( "input[name=elecSignType]" ).select( {
				code: { type: "Elec_Sign_Type" },
				events: {
					change: {
						data: {},
						handler: function (event, val, items) {
							//单选参数 event, val, item,
							//多选参数 event, vals, items
							if( !val || '' == $.trim(val)) return;
							that.styctr.init('Elec_Sign_Type',val);
						}
					}
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
			that.selector.find( ":input[name=templateNo]" ).valChange( item.templateNo );
			!item.id || that.selector.find( ":input[name=id]" ).valChange( item.id );
			!item.signX || that.selector.find( ":input[name=signX]" ).valChange( item.signX );
			!item.signY || that.selector.find( ":input[name=signY]" ).valChange( item.signY );
			!item.signPage || that.selector.find( ":input[name=signPage]" ).valChange( item.signPage );
			!item.signBody || that.selector.find( ":input[name=signBody]" ).valChange( item.signBody );
			!item.signType || that.selector.find( ":input[name=signType]" ).valChange( item.signType );
			!item.elecSignType || that.selector.find( ":input[name=elecSignType]" ).valChange( item.elecSignType );
			!item.signKey || that.selector.find( ":input[name=signKey]" ).valChange( item.signKey );
			
			//样式控制
			that.styctr.init('Elec_Sign_Type',item.elecSignType);
		};
		
		/** 保存*/
		handlers.save = function() {
			var that = this.global();
			//验证
			if ( !that.vars.validator.form() ) return;
			//动态验证
			var elecSignType = that.selector.find("input[name=elecSignType]").val();
			if('30700001'==elecSignType){ //上上签
				 var signX = that.selector.find("input[name=signX]").val();
				 var signY = that.selector.find("input[name=signY]").val();
				 var signPage = that.selector.find("input[name=signPage]").val();
				 if(!signX || ''==$.trim(signX)){
					 that.selector.find("input[name=signX]").validErrorTip("签名坐标X不可为空");
					 return;
				 }
				 if(!signY || ''==$.trim(signY)){
					 that.selector.find("input[name=signY]").validErrorTip("签名坐标Y不可为空");
					 return;
				 }
				 if(!signPage || ''==$.trim(signPage)){
					 that.selector.find("input[name=signPage]").validErrorTip("签名页码不可为空");
					 return;
				 }
				
			}else if('30700002' == elecSignType){ //瀚华
				var signKey = that.selector.find("input[name=signKey]").val();
				 if(!signKey || ''==$.trim(signKey)){
					 that.selector.find("input[name=signKey]").validErrorTip("签名关键字不可为空");
					 return;
				 }
			}
			
			//验证模板编号是否有值
			var tmplNo = that.selector.find( "input[name=templateNo]" ).val();
			if(!tmplNo || ''==$.trim(tmplNo)) return message.error( "模板编号为空，请检查该模板是否有模板编号" );
			
			var data = that.selector.find( "form" ).serialize();
			that.loading.show(); 
			$.ajax( {
				url: "contract/coord/save",
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
		
		//=======================================================
		//  样式控制
		//=======================================================
		//初始化样式
		styctr.init = function (type,value){
			var that = this.global();
			if(!type) return;
			if('Elec_Sign_Type'==type){
				that.styctr.elecSignType(value);
			}
		}
		
		//控制电子签约类型
		styctr.elecSignType = function (value){
			var that = this.global();
			if(!value) return;
			if('30700001'==value){ //上上签
				//显示
				that.selector.find("input[name=signX]").parent().show();
				that.selector.find("input[name=signX]").removeAttr("disabled");
				that.selector.find("input[name=signY]").parent().show();
				that.selector.find("input[name=signY]").removeAttr("disabled");
				that.selector.find("input[name=signPage]").parent().show();
				that.selector.find("input[name=signPage]").removeAttr("disabled");
				//隐藏
				that.selector.find("input[name=signKey]").parent().hide();
				that.selector.find("input[name=signKey]").attr("disabled","disabled");
			}else if('30700002'==value){ //瀚华
				//显示
				that.selector.find("input[name=signKey]").parent().show();
				that.selector.find("input[name=signKey]").removeAttr("disabled");
				//隐藏
				that.selector.find("input[name=signX]").parent().hide();
				that.selector.find("input[name=signX]").attr("disabled","disabled");
				that.selector.find("input[name=signY]").parent().hide();
				that.selector.find("input[name=signY]").attr("disabled","disabled");
				that.selector.find("input[name=signPage]").parent().hide();
				that.selector.find("input[name=signPage]").attr("disabled","disabled");
			}
		}
		
		
		
	};
	
	return Global;
});