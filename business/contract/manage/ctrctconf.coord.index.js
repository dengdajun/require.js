define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
//		var moment = require( "moment" );
		base.code.cache( "Is_No,Sign_Type,Sign_Body,Elec_Sign_Type");
		
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
			
			that.selector.find( "input[name=signBody]" ).select( {
				code: { type: "Sign_Body" }
			} );
			
			that.selector.find( "input[name=signType]" ).select( {
				code: { type: "Sign_Type" }
			} );
			
			that.selector.find( "input[name=elecSignType]" ).select( {
				code: { type: "Elec_Sign_Type" }
			} );
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
			//删除
			that.selector.find( "#delBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.del( items );
				return false;
			} );
			
			var config = {
				remote: {
		        	url: "contract/coord/list",
		        	params: {"params[templateNo]":that.params.item.templateNo}
		        },
		        multi: true,
		        page: true,
		        query: {
		        	isExpand:true,
		        	target: that.selector.find( ".grid-query" )
		        },
		        plugins: [],
		        customEvents: []
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "电子签约类型", name: "elecSignType", width: "80px", lockWidth: true ,renderer: function( val, item, rowIndex) {
				return base.code.getText(  "Elec_Sign_Type", val );
			} };
			cols[ cols.length ] = { title: "签名关键字", name: "signKey", width: "80px", lockWidth: true };
			cols[ cols.length ] = { title: "坐标X", name: "signX", width: "80px", lockWidth: true };
			cols[ cols.length ] = { title: "坐标Y", name: "signY", width: "80px", lockWidth: true };
			cols[ cols.length ] = { title: "签名页码", name: "signPage", width: "80px", lockWidth: true };
			cols[ cols.length ] = { title: "签名主体", name: "signBody", width: "80px", lockWidth: true ,renderer: function( val, item, rowIndex) {
				return base.code.getText(  "Sign_Body", val );
			} };
			cols[ cols.length ] = { title: "签名类型", name: "signType", width: "80px", lockWidth: true ,renderer: function( val, item, rowIndex) {
				return base.code.getText(  "Sign_Type", val );
			} };
			that.vars.gridVar = that.selector.find( "#coordGrid" ).grid( config );
		};	
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		
		//新增
		handlers.add = function(){
			var that = this.global();
			var item = {templateNo : that.params.item.templateNo};
			that.page.open( {
				title: "坐标管理 | 新增",
				url: "contract/coord/form",
				size: "modal-lg",
				params: {item: item },
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.gridVar.load();
					}
				}
			});
		}
		
		//编辑
		handlers.edit = function( items ) {
			if (!items || items.length != 1 ) {
				return message.error( "请选择一条操作数据。" );
			}
			var item = items[ 0 ]; //获取一条数据
			var that = this.global();
			that.page.open( {
				title: "坐标管理 | 编辑",
				url: "contract/coord/form",
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
		
		//删除
		handlers.del = function(items){
			if(!items || items.length == 0){
				return message.error( "请至少选择一条操作数据。" );
			}
			var ids = [];
			$.each( items, function( index, item ) {
				ids.push( item.id );
			} ); 
			that.dialog.confirm( "确定删除选择的[ " + items.length + " ]条操作数据？", function( event, index ) {
				if ( index == 1 ) return false;
				$.ajax( {
					url: "contract/coord/delete",
					type: "POST",
					data: { ids: ids },
					success: function( data ) {
						if ( !data.success ) {
							return message.error( data.msg );
						}
						message.success( data.msg );
						that.vars.gridVar.load();
					}
				} );
			});
		}
		
		
	};
	
	return Global;
});