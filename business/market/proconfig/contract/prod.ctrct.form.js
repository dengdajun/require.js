define(function () { 
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, code = base.code
			, tools = base.tools;
//		var moment = require( "moment" );
		code.cache( "Is_No,Contract_Type,Branch_Self_Typ,Elec_Sign_Type" );
		
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
					contractNo: { required: true },
					contractName: { required: true },
					contractType:{ required: true },
					stat: { required: true}
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
			
			that.selector.find( "input[name=contractType]" ).select( {
				code: { type: "Contract_Type",group:"Main_Ctrct_Typ_Grp"},
				events: {
					change: {
						data: {},
						handler: function (event, val, items) {
							that.styctr.init("Contract_Type",val);
						}
					}
				}
			} );
			
			that.selector.find( "input[name=chanNo]" ).select( {
				multi: false,
				remote: {
					url: 'market/proconfig/ctrct/chanNoLst',
					params: {params:{
						prodNo:that.params.item.prodNo
					}}
				}
			} );
			
			that.selector.find( "input[name=elecSignType]" ).select( {
				code: { type: "Elec_Sign_Type" }
			} );
			
			that.selector.find( "input[name=stat]" ).select( {
				code: { type: "Is_No" }
			} );

			that.selector.find( "input[name=branchSelf]" ).select( {
				code: { type: "Branch_Self_Typ" }
			} );
			
			that.selector.find( ".input" ).input( {} );//实例input插件
		};	
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		/** 加载数据*/
		handlers.load = function( item ) {
			var that = this.global();
			item.id && that.selector.find( ":input[name=id]" ).valChange( item.id );
			that.selector.find( ":input[name=prodNo]" ).valChange( item.prodNo );
			item.contractNo && that.selector.find( ":input[name=contractNo]" ).valChange( item.contractNo );
			item.contractNo && that.selector.find( ":input[name=contractNo]" ).readonly( true );
			item.contractName && that.selector.find( ":input[name=contractName]" ).valChange( item.contractName );
			item.contractType && that.selector.find( ":input[name=contractType]" ).valChange( item.contractType );
			item.stat && that.selector.find( ":input[name=stat]" ).valChange( item.stat );
			item.chanNo && that.selector.find( ":input[name=chanNo]" ).valChange( item.chanNo );
			item.branchSelf && that.selector.find( ":input[name=branchSelf]" ).valChange( item.branchSelf );
			item.elecSignType && that.selector.find( ":input[name=elecSignType]" ).valChange( item.elecSignType );
			//样式控制
			that.styctr.init("Contract_Type",item.contractType);
			
		};
		
		/** 保存*/
		handlers.save = function() {
			var that = this.global();
			if ( !that.vars.validator.form() ) return;
			//动态验证:
			var contractType = that.selector.find("input[name=contractType]").val();
			if('26800002' == contractType){ //资方
				var chanNo = that.selector.find("input[name=chanNo]").val();
				if(!chanNo || $.trim(chanNo)=='') {
					 that.selector.find("input[name=chanNo]").validErrorTip("请选择一个渠道");
					 return;
				}
			}else if('26800003' == contractType){//网点
				var branchSelf = that.selector.find("input[name=branchSelf]").val();
				if(!branchSelf || $.trim(branchSelf)=='') {
					 that.selector.find("input[name=branchSelf]").validErrorTip("请选择一个网点自营类型");
					 return;
				}
			}
			
			var data = that.selector.find( "form" ).serialize();
			that.loading.show(); 
			$.ajax( {
				url: "market/proconfig/ctrct/save",
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
		
		//样式控制
		styctr.init = function (type,value){
			var that = this.global();
			if('26800002' == value){ //资方
				//渠道显示
				that.selector.find("input[name=chanNo]").parent().show();
				that.selector.find("input[name=chanNo]").removeAttr("disabled");
				//网点隐藏
				that.selector.find("input[name=branchSelf]").parent().hide();
				that.selector.find("input[name=branchSelf]").attr("disabled","disabled");
			}else if('26800003' == value){//网点
				//网点显示
				that.selector.find("input[name=branchSelf]").parent().show();
				that.selector.find("input[name=branchSelf]").removeAttr("disabled");
				//渠道隐藏
				that.selector.find("input[name=chanNo]").parent().hide();
				that.selector.find("input[name=chanNo]").attr("disabled","disabled");
			}
			else{
				//渠道和网点隐藏
				//渠道隐藏
				that.selector.find("input[name=chanNo]").parent().hide();
				that.selector.find("input[name=chanNo]").attr("disabled","disabled");
				//网点隐藏
				that.selector.find("input[name=branchSelf]").parent().hide();
				that.selector.find("input[name=branchSelf]").attr("disabled","disabled");
			}
		}
		
		
	};
	
	return Global;
});