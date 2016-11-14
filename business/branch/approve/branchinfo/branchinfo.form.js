define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
		
		var moment = require( "moment" );
		
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
			//jquery-validate 验证form表单元素
			that.vars.validator = that.selector.find( "form" ).validate( {
				rules: {
					apprStep :{ required: true }
				}
			} );
		};
		
		//页面布局
		that.layout = function() {
			
			var that = this.global();//获取组件的全局对象
			
			that.selector.find( ".input" ).input( {} );//实例input插件
			that.selector.find( "input[name=branchSelf]" ).select( {//网点自营类型实例下拉插件
				code: { type: "Branch_Self_Typ" }
			} );
			that.selector.find( "input[name=branchTyp]" ).select( {//网点类型实例下拉插件
				code: { type: "Branch_Type" }
			} );
			that.selector.find( "input[name=goodsType]" ).select( {//产品类型实例下拉插件
				code: { type: "Goods_Type" }
			} );
			that.selector.find( "input[name=openOrg]" ).select( {//开户行实例下拉插件
				code: { type: "Open_Org" }
			} );
			
			
			that.selector.find( "input[name=openOrg],[name='goodsType'],[name='branchTyp'],[name='branchSelf']" ).parent("div").find("ul").hide();
			
			//通过事件
			that.selector.find( "#appro" ).click( function(event) {
				var item = that.params.item
   			 	that.handlers.appro(item);
				
				return false;
			});
			//通过事件
			that.selector.find( "#approNo" ).click( function(event) {
				var item = that.params.item
   			 	that.handlers.approNo(item);
				
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
			that.selector.find( ":input[name=branchName]" ).valChange( item.branchName ); 
			that.selector.find( ":input[name=branchSelf]" ).valChange( item.branchSelf ); 
			that.selector.find( ":input[name=branchTyp]" ).valChange( item.branchTyp ); 
			that.selector.find( ":input[name=busLicsNo]" ).valChange( item.busLicsNo ); 
			that.selector.find( ":input[name=regalName]" ).valChange( item.regalName ); 
			that.selector.find( ":input[name=regalCertNo]" ).valChange( item.regalCertNo ); 
			that.selector.find( ":input[name=branchAddr]" ).valChange( item.branchAddr ); 
			that.selector.find( ":input[name=longAddr]" ).valChange( item.longAddr ); 
			that.selector.find( ":input[name=goodsType]" ).valChange( item.goodsType ); 
			that.selector.find( ":input[name=latAddr]" ).valChange( item.latAddr ); 
			that.selector.find( ":input[name=bankName]" ).valChange( item.bankName ); 
			that.selector.find( ":input[name=openOrg]" ).valChange( item.openOrg ); 
			that.selector.find( ":input[name=acctNo]" ).valChange( item.acctNo ); 
			that.selector.find( ":input[name=acctName]" ).valChange( item.acctName );
			that.selector.find( ":input[name=instDate]" ).valChange( moment(item.instDate).format("YYYY-MM-DD hh:mm:ss") );
		};
		
		/** 通过*/
		handlers.appro = function(item) {
			var remark = $("#remark").val();
			item.remark = remark;
			that.modal.open( {
				title: "网点认证 | 录入网点编码",
				url:"branch/appro/branchno",
				size: "modal-md",
				//async: false,
				params: { item: item},
				events: {
					hiden: function( closed, data ) {
						//if ( !closed ) return;
						if(data.success){
							that.loading.hide();
	                        message.success("操作成功");
	                        that.close( data );
						};
					}
				}
			} );			
			
		};
		/**不通过*/
		handlers.approNo = function(item) {
			var remark = $("#remark").val();
			that.dialog.confirm("是否确定不通过该网点的认证", function(event,index) {
				if(index == 0){
					$.ajax( {
						url: "branch/appro/noBranch",
						type: "POST",
						data: {id : item.id ,remark: remark},
						complete: function() {
							that.loading.hide();
						},
						success: function( data ) {
		                        that.loading.hide();
		                        message.success("操作成功");
		                        that.close( data );
						}
					} );
				}
			});	
			
		};
	};
	
	return Global;
});