define(function () { 

	function Global( vars ) {
		
		//=======================================================
		//获取基础组件
		//=======================================================
		var $ = require( "jquery" )
			, base = require( "app/base" )
			, message = base.message
			, tools = base.tools
			, code = base.code;
		
		//缓存码值
		code.cache( "Is_No" );
		
		//=======================================================
		//当前组件
		//=======================================================
		var that = this;
		var vars = that.vars = $.extend( true, {}, vars );//全局变梁
		var handlers = that.handlers = {};//处理程序
		handlers.global = function() { return that; };
		
		//组件入口函数  相当于java.main
		that.init = function() {
			this.layout(); 
			this.load();
		};
		
		//初始化远程请求处理
		that.load = function() {
			var that = this.global();
			if ( !that.params.item ) return;
			that.handlers.load( that.params.item );
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			that.selector.find( "input[name=isUse]" ).select( {//实例下拉插件
				code: { type: "Is_No" }
			} ); 
			
			that.selector.find( ".input" ).input( {} );//实例input插件
			
			//新增
			that.selector.find( "#addBtn" ).bind( "click", function( event ) {
				that.handlers.add();
				return false;
			} );
			//编辑
			that.selector.find( "#editBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.edit( items );
				return false;
			} );
			//删除
			that.selector.find( "#delBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.del( items );
				return false;
			} );
			
			var config = {
				remote: {
		        	url: "brhpass/acct/list",
		        	params: {
		        		"params[branchNo]":that.params.item.branchNo
		        	}
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
			cols[ cols.length ] = { title: "玖富产品编码", name: "jfProd", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "企业名称", name: "compName", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "银行账号", name: "bankAcctNo", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "开户行", name: "openArea", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "开户行编码", name: "openOrg", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "开户行所在城市编码", name: "openCity", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "法人姓名", name: "regalName", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "法人身份证", name: "regalCertNo", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "法人手机号", name: "phoneNo", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "是否启用", name: "isUse", width: "80px", lockWidth: true ,renderer: function( val, item, rowIndex) {
				return base.code.getText(  "Is_No", val );
			} };
			
			that.vars.gridVar = that.selector.find( "#passAcctGrid" ).grid( config );
		};
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {
			
		};
		
		//新增
		handlers.add = function(){
			var that = this.global();
			var item = that.params.item;
			that.modal.open( {
				title: "资金穿透账号 | 新增",
				url: "brhpass/acct/form",
				size: "modal-lg",
				params: {item:item},
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
			that.modal.open( {
				title: "资金穿透账号 | 编辑",
				url: "brhpass/acct/form",
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
					url: "brhpass/acct/dele",
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
} );