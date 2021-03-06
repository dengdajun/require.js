define( function() {
	var $ = jQuery = require( "jquery" )
		,base = require( "app/base" )
		,message = base.message;
	
	function Global( vars ) {
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
			this.valdiate();
			this.load();
		};
		//验证组件
		that.valdiate = function() {
			var that = this.global(); 
			//jquery-validate 验证form表单元素
			that.vars.validator = that.selector.find( "form" ).validate( {
				rules: {
					oldPassword: { required: true, rangelength:[ 6, 20] },
					newPassword: { required: true, rangelength:[ 6, 20] },
					reNewPassword: {required: true, rangelength:[ 6, 20] }
				}
			} );
		};
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
			that.selector.find( ".input" ).input( { cssCol: "col-xs-12" } );//实例input插件
		};
		//初始化远程请求处理
		that.load = function() {
			var that = this.global();
			if ( !that.params.item ) return;
			that.handlers.load( that.params.item );
		};
		
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		/** 加载数据*/
		handlers.load = function( item ) {
			var that = this.global();
			if("true"==item.duration){
				//隐藏关闭符号 
				$( ".modal-content .modal-header button span" ).text("");
				//隐藏取消按钮
				that.selector.find( "#closeBtn" ).hide();
			}
			
		};
		/** 保存*/
		handlers.save = function() {
			var that = this.global();
			//验证
			if ( !that.vars.validator.form() ) return;
			var newPassword = that.selector.find( "input[name=newPassword]" ).val();
			var reNewPassword = that.selector.find( "input[name=reNewPassword]" ).val();
			if(newPassword!=reNewPassword){
				 return message.error( "两次密码不一致!" );
			}
			
			
			
			var data = that.selector.find( "form" ).serialize();
			that.loading.show(); 
			$.ajax( {
				url: "frame/protal/modifyPassword",
				type: "POST",
				data: data,
				complete: function() {
					//$button.disabled( false );
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
} );