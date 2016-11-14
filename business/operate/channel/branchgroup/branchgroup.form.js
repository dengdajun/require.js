define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
//		var moment = require( "moment" );
		base.code.cache( "branch_grp_type,Is_No" );
		
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
					groupNo: { required: true },
					groupName: { required: true },
					groupTyp: { required: true }
				}
			} );
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			
			that.selector.find( ".input" ).input( {} );//实例input插件
			that.selector.find( "input[name=groupTyp]" ).select( {
				code: { type: "branch_grp_type" }
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
			that.selector.find( "input[name=stat]" ).select( {//实例下拉插件
				code: { type: "Is_No" }
			} );
			
		};
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		/** 加载数据*/
		handlers.load = function( item ) {
			var that = this.global();
			
			that.selector.find( ":input[name=id]" ).valChange( item.id ); 
			that.selector.find( ":input[name=groupNo]" ).valChange( item.groupNo ); 
			that.selector.find( ":input[name=groupName]" ).valChange( item.groupName );
			that.selector.find( ":input[name=groupTyp]" ).valChange( item.groupTyp );
			that.selector.find( ":input[name=remark]" ).valChange( item.remark );
			that.selector.find( ":input[name=stat]" ).valChange( item.stat );
			that.selector.find( ":input[name=groupNo]" ).readonly( true );
			
		};
		
		/** 保存*/
		handlers.save = function() {
			var that = this.global();
			if ( !that.vars.validator.form() ) return;
			var re=new RegExp("^BY-SH-.+$");
			if(that.selector.find("input[name=groupTyp]").val()=='16300002'){
				if(!re.test(that.selector.find("input[name=groupNo]").val().replace(/(^\s*)|(\s*$)/g,""))){
					that.selector.find( "input[name=groupNo]" ).validErrorTip("商户组编号必须以BY-SH-开头");
					return;
				}else{
					that.selector.find( "input[name=groupNo]" ).validErrorTip("");
				}
			}
			var data = that.selector.find( "form" ).serialize();
			that.loading.show(); 
			$.ajax( {
				url: "operate/channel/branchgroup/save",
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