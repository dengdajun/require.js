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
			
			that.selector.find( "input[name=ethnic]" ).select( {//名字实例下拉插件
				code: { type: "Nation" }
			} );
			that.selector.find( "input[name=sex]" ).select( {//性别实例下拉插件
				code: { type: "Sex" }
			} );
			that.selector.find( "input[name=userRole]" ).select( {//角色实例下拉插件
				code: { type: "Oth_Position" }
			} );
			
			that.selector.find( "input[name='ethnic'],[name='sex'],[name='userRole']" ).parent("div").find("ul").hide();
			//通过事件
			that.selector.find( "#appro" ).click( function(event) {
				var item = that.params.item
   			 	that.handlers.appro(item);
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
			that.selector.find( ":input[name=userName]" ).valChange( item.userName ); 
			that.selector.find( ":input[name=certNo]" ).valChange( item.certNo ); 
			that.selector.find( ":input[name=sex]" ).valChange( item.sex ); 
			that.selector.find( ":input[name=ethnic]" ).valChange( item.ethnic ); 
			that.selector.find( ":input[name=phoneNo]" ).valChange( item.phoneNo ); 
			that.selector.find( ":input[name=secPhoneNo]" ).valChange( item.secPhoneNo ); 
			that.selector.find( ":input[name=userRole]" ).valChange( item.userRole ); 
			that.selector.find( ":input[name=userOrg]" ).valChange( item.userOrg ); 
			that.selector.find( ":input[name=regAddr]" ).valChange( item.regAddr ); 
			that.selector.find( ":input[name=liveAddr]" ).valChange(item.liveAddr  ); 
			that.selector.find( ":input[name=instDate]" ).valChange( moment(item.instDate).format("YYYY-MM-DD hh:mm:ss") );
			
		};
		
		/** 保存*/
		handlers.appro = function(item) {
			that.modal.open( {
				title: "网点认证 | 录入网点编码",
				url:"branch/appro/branchno",
				size: "modal-md",
				//async: false,
				params: { item: item},
				events: {
					hiden: function( closed, data ) {
						//if ( !closed ) return;
						if(!data){
							return;
						}
						if(data.success){
						};
					}
				}
			} );			
			
		};
	};
	
	return Global;
});