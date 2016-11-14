define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
//		var moment = require( "moment" );
		base.code.cache( "Is_No,Contract_Type,Tmpl_Type,Cont_Apply_Type,Source_Type" );
		
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
					fileName: { required: true },
					fileAliasName: { required: true },
					totalPage: { required: true},
					contractType: { required: true },
					stat: { required: true }
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
			
			that.selector.find( "input[name=contractType]" ).select( {//实例下拉插件
				code: { type: "Contract_Type" }
			} );
			
			that.selector.find( "input[name=tmplType]" ).select( {//实例下拉插件
				code: { type: "Tmpl_Type" }
			} );
			
			that.selector.find( "input[name=contApplyType]" ).select( {//实例下拉插件
				code: { type: "Cont_Apply_Type" }
			} );
			
			that.selector.find( "input[name=stat]" ).select( {//实例下拉插件
				code: { type: "Is_No" }
			} );
			
			//适用端
			that.selector.find( "input[name=sourceType]" ).select( {//实例下拉插件
				multi:true,
				code: { type: "Source_Type" }
			} );
			
			//适用资方渠道
			that.selector.find( "input[name=applyChan]" ).select( {
				multi: true,
				remote: {
					url: 'contract/manage/chanNoLst',
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
			that.selector.find( ":input[name=fileName]" ).valChange( item.fileName );
			that.selector.find( ":input[name=fileAliasName]" ).valChange( item.fileAliasName );
			that.selector.find( ":input[name=totalPage]" ).valChange( item.totalPage );
			that.selector.find( ":input[name=contractType]" ).valChange( item.contractType );
			that.selector.find( ":input[name=tmplType]" ).valChange( item.tmplType );
			that.selector.find( ":input[name=contApplyType]" ).valChange( item.contApplyType );
			that.selector.find( ":input[name=stat]" ).valChange( item.stat );
			that.selector.find( ":input[name=sourceType]" ).valChange( item.sourceType );
			that.selector.find( ":input[name=applyChan]" ).valChange( item.applyChan );
		};
		
		/** 保存*/
		handlers.save = function() {
			var that = this.global();
			//验证
			if ( !that.vars.validator.form() ) return;
			var data = that.selector.find( "form" ).serialize();
			that.loading.show(); 
			$.ajax( {
				url: "contract/manage/save",
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