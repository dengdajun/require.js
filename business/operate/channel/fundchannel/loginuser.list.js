define(function (){
	function Global( vars ) {
		var $ = require( "jquery" )
		, base = require( "app/base" )
		, message = base.message
		, tools = base.tools
		, code = base.code;
	
		//缓存码值
		code.cache( "stat,sex,certType,yon,Is_No,Acc_Type,Acct_Type" );
		
		var that = this;
		var vars = that.vars = $.extend( true, {}, vars );//全局变梁
		var handlers = that.handlers = {};//处理程序
		handlers.global = function() { return that; };
		
		//组件入口函数  相当于java.main
		that.init = function() {
			var that = this.global();
			this.load();
			this.layout(); 
		};
		
		//初始化远程请求处理
		that.load = function() {
			var that = this.global();
			if ( !that.params.item ) return;
			that.handlers.load( that.params.item );
		};
		that.layout = function (){
			var that = this.global();
			that.selector.find( ".input" ).input( {} );
			
			that.selector.find( "#addBtn" ).bind('click',function ( event ){
				that.handlers.add();
			});
			
			that.selector.find( "#editBtn" ).bind('click',function ( event ){
				var items = that.vars.gridVar.selectedRows();
				that.handlers.edit( items );
				return false;
			});
			
			that.selector.find( "#delBtn" ).bind('click',function ( event ){
				var items = that.vars.gridVar.selectedRows();
				that.handlers.del( items );
				return false;
			});
			
			var config = {
				remote: {
		        	url: "operate/channel/fundChan/selectLoginUsers",
		            params: {}
		        },
		        page: {
		        	pageSize: 5
		        },
		        multi: true,
		        page: true,
		        query: {
		        	target: that.selector.find( ".grid-query" )
		        },
		        plugins: [],
		        customEvents: []
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "登陆账号", name: "loginNo", width: "150px", lockWidth: true };
			cols[ cols.length ] = { title: "手机号", name: "phoneNo", width: "150px", lockWidth: true };
			cols[ cols.length ] = { title: "名称", name: "loginName", width: "150px", lockWidth: true };
			cols[ cols.length ] = { title: "启用状态", name: "state", width: "80px", lockWidth: true ,lockWidth: true ,
					renderer:function(val,item,rowIndex){return base.code.getText("Is_No",val);}};
			cols[ cols.length ] = { title: "操作", name: "id", width: "50px", lockWidth: true, renderer: function( val, item, rowIndex ) {
				var claName = item.state=="13900001"?"禁用":"启用";
				var cla = item.state=="13900001"?"off":"on";
				return format( [ '<a href="javascript:;" class="pro-toggle"><i class="fa fa-toggle-'+cla+'"></i>'+claName+'</a>' ] )
			} };
			config.customEvents.push( {
				target: ".pro-toggle",
				handler: function( event, item, rowIndex ) {
					that.handlers.toggle(item,event.currentTarget.text);
					return false;
				}
			} );
			config.remote.params["params[loginCode]"]  = that.params.item.chanNo;
			that.vars.gridVar = that.selector.find( "#userListGrid" ).grid( config );//renderer
		};
		
		handlers.load = function( item ) {
			var that = this.global();
			that.selector.find( ":input[name=loginCode]" ).valChange( item.chanNo ); 
		};
		
		handlers.add = function (){
			var that = this.global();
			var loginCode = that.params.item.chanNo;
			that.modal.open( {
				title: "资金渠道管理 | 登陆用户管理 | 添加登陆用户",
				url: "operate/channel/fundChan/addLoginUserForm",
				size: "modal-lg",
				params: {'loginCode':loginCode},
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.gridVar.load();
					}
				}
			} );
		};
		
		handlers.edit = function( items ) {
			if ( items.length != 1 ) {
				return message.error( "请选择一条操作数据。" );
			}
			
			var item = items[ 0 ]; //获取一条数据
			
			var that = this.global();
			that.modal.open( {
				title: "资金渠道管理 | 登陆用户管理 | 编辑登陆用户",
				url: "operate/channel/fundChan/addLoginUserForm",
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
		
		handlers.del = function( items ) {
			if ( items == null || items.length == 0 ) {
				return message.error( "请选择至少一条操作数据。" );
			}
			
			var ids = [];
			$.each( items, function( index, item ) {
				ids.push( item.id );
			} ); 
			
			that.dialog.confirm( "确定删除选择的[ " + items.length + " ]条操作数据？", function( event, index ) {
				if ( index == 1 ) return false;
				$.ajax( {
					url: "operate/channel/fundChan/deleteLoginUser",
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
			} );
			
		};
		
		/**
		 * 状态修改
		 */
		handlers.toggle = function( item,text ) {
			var that = this.global();
			that.dialog.confirm( "确定"+text+"?", function( event, index ) {
				if ( index == 1 ) return false;
				that.loading.show();
				$.ajax( {
					url: "operate/channel/fundChan/modifyLoginUserStatus",
					type: "POST",
					contentType:"application/json",
					data: JSON.stringify(item),
					complete: function() {
						that.loading.hide();
					},
					success: function( data ) {
						if ( !data.success ) {
							return message.error( data.msg );
						}
						message.success( data.msg );
						that.vars.gridVar.load();
					}
				} );
			} );
		};
		
	};
	return Global;
});