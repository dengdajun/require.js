define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
//		var moment = require( "moment" );
		base.code.cache( "Is_No,Sign_Type,Sign_Body");
		
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
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			
//			that.selector.find( "input[name=chanNo]" ).select( {
//				code: { type: "Sign_Body" }
//			} );
			
			that.selector.find( ".input" ).input( {} );//实例input插件
			
			//添加
			that.selector.find( "#addBtn" ).click( function(event) {
				that.handlers.add();
				return false;
			});
			//编辑
			that.selector.find( "#editBtn" ).click( function(event) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.edit( items );
				return false;
			});
			that.selector.find( "#upload" ).click( function(event) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.upload( items );
				return false;
			});
			//上传
			
			var config = {
				remote: {
		        	url: "contract/ssqian/signet/list"
		        },
		        multi: false,
		        page: true,
		        query: {
		        	isExpand:true,
		        	target: that.selector.find( ".grid-query" )
		        },
		        plugins: [],
		        customEvents: []
			};
			config.cols = cols = []; 
			cols[ cols.length ] = { title: "渠道编号", name: "chanNo", width: "80px", lockWidth: true };
			cols[ cols.length ] = { title: "名称", name: "userName", width: "80px", lockWidth: true };
			cols[ cols.length ] = { title: "邮箱", name: "email", width: "80px", lockWidth: true };
			cols[ cols.length ] = { title: "手机号", name: "phoneNo", width: "80px", lockWidth: true };
			cols[ cols.length ] = { title: "图片类型", name: "imgType", width: "80px", lockWidth: true };
			cols[ cols.length ] = { title: "图片名称", name: "imgName", width: "80px", lockWidth: true };
			cols[ cols.length ] = { title: "类型", name: "type", width: "80px", lockWidth: true ,renderer: function( val, item, rowIndex) {
				return base.code.getText(  "Contract_Type", val );
			} };
			cols[ cols.length ] = { title: "已上传", name: "stat", width: "80px", lockWidth: true ,renderer: function( val, item, rowIndex) {
				return base.code.getText(  "Is_No", val );
			} };
			that.vars.gridVar = that.selector.find( "#coordGrid" ).grid( config );
		};	
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		
		
		
		//新增
		handlers.add = function(){
			var that = this.global();
			that.page.open( {
				title: "公章管理 | 新增",
				url: "contract/ssqian/signet/form",
				size: "modal-lg",
				params: {},
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.gridVar.load();
					}
				}
			});
		};
		
		//编辑
		handlers.edit = function( items ) {
			if (!items || items.length != 1 ) {
				return message.error( "请选择一条操作数据。" );
			}
			var item = items[ 0 ]; //获取一条数据
			var that = this.global();
			that.page.open( {
				title: "公章管理 | 编辑",
				url: "contract/ssqian/signet/form",
				size: "modal-lg",
				params: { item: item },
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.gridVar.load();
					}
				}
			} );
		};
		
		//上传
		handlers.upload = function( items ) {
			if (!items || items.length != 1 ) {
				return message.error( "请选择一条操作数据。" );
			}
			var item = JSON.stringify(items[ 0 ]); //获取一条数据
			if (items[ 0 ]['stat'] == '13900001') {
				message.error("公章已上传,请勿重新操作");
				return false;
			}
			var that = this.global();
			$.ajax( {
				url: "contract/ssqian/signet/upload",
				type: "POST",
				dataType: "json",
				contentType: "application/json; charset=UTF-8",
				data: item ,
				success: function( data ) {
					if ( !data.success ) {
						return message.error( data.msg );
					}
					message.success( data.msg );
					that.vars.gridVar.load();
				}
			} );
			
		};
		
	};
	
	return Global;
});