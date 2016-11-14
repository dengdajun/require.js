define(function (){
	
	function Global( vars ) {
		var $ = require( "jquery" )
		, base = require( "app/base" )
		, message = base.message
		, tools = base.tools
		, code = base.code;
		code.cache( "Oth_Position,Is_No" );
	
		var that = this;
		var vars = that.vars = $.extend( true, {}, vars );//全局变梁
		var handlers = that.handlers = {};//处理程序
		handlers.global = function() { return that; };
		
		that.init = function() {
			this.layout(); 
		};
		
		that.load = function() {};
		
		that.layout = function (){
			var that = this.global();
			
			that.selector.find( ".input" ).input( {} );//实例input插件
			//绑定提交
			that.selector.find( "#submitBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.save( items );
				return false;
			} );
			that.selector.find( "#closeBtn" ).bind( "click", function( event ) {
				that.close();
				return false;
			} );
			that.selector.find( "#addBtn" ).bind( "click", function( event ) {
				that.handlers.add();
			} );
			
			that.selector.find( "#editBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.edit( items );
				return false;
			} );
			that.selector.find( "#qrcodeBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.qrcode( items );
				return false;
			} );
			
			that.selector.find( "#delBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.del( items );
				return false;
			} );
			var branchNo = $("#branchNo").val();
			var config = {
				remote: {
		        	url: "operate/channel/bizchannel/getAdminList",
		            params: {"params[loginCode]":branchNo}
		        },
		        multi: true,
		        page: true,
		        query: {
		        	target: that.selector.find( ".grid-query" )
		        },
		        plugins: [],
		        events: {},
		        customEvents: []
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "名称", name: "loginName", width: "180px", lockWidth: true };
			cols[ cols.length ] = { title: "员工类型", name: "userRole", width: "180px", lockWidth: true ,renderer : function (val, item, rowIndex){
				return base.code.getText("Oth_Position",val);
			}};
			cols[ cols.length ] = { title: "电话号码", name: "phoneNo", width: "180px", lockWidth: true };
			cols[ cols.length ] = { title: "操作", name: "id", width: "60px", lockWidth: true, renderer: function( val, item, rowIndex ) {
				var claName = item.state=="13900001"?"失效":"启用";
				var cla = item.state=="13900001"?"off":"on";
				return format( [ '<a href="javascript:;" class="pro-toggle"><i class="fa fa-toggle-'+cla+'"></i>'+claName+'</a>' ] )
			} };
//			cols[ cols.length ] = { title: "设置管理员", name: "id", width: "60px", lockWidth: true, renderer: function( val, item, rowIndex ) {
//				var claName = item.isAdmin=="13900001"?"失效":"管理员";
//				var cla = item.isAdmin=="13900001"?"off":"on";
//				return format( [ '<a href="javascript:;" class="pro-admin"><i class="fa fa-toggle-'+cla+'"></i>'+claName+'</a>' ] )
//			} };
			config.events.click = {
				handler: function( event, item, rowIndex ) {
			
				}
			};
			config.customEvents.push( {
				target: ".pro-toggle",
				handler: function( event, item, rowIndex ) {
					that.handlers.toggle(item,event.currentTarget.text);
					return false;
				}
			} );
			config.customEvents.push( {
				target: ".pro-admin",
				handler: function( event, item, rowIndex ) {
					that.handlers.admin(item,event.currentTarget.text);
					return false;
				}
			} );
			that.vars.gridVar = that.selector.find( "#bizChannelGrid" ).grid( config );//renderer
		};//end layout
		
		that.handlers.load = function( data ) {
			
		};
		/**
		 * 状态修改
		 */
		handlers.toggle = function( item,text ) {
			var that = this.global();
			if('13900001'==item.isAdmin&&'13900001'==item.state){
				return message.error( "用户为管理员，不能停用" );
			}
			that.dialog.confirm( "确定"+text+"?", function( event, index ) {
				if ( index == 1 ) return false;
				that.loading.show();
				$.ajax( {
					url: "operate/channel/bizchannel/updateAdminState",
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
		/**
		 * 设置管理员
		 */
		handlers.admin = function( item,text ) {
			var that = this.global();
			if('13900002'==item.isAdmin&&'13900002'==item.state){
				return message.error( "状态停用，不能设置成管理员" );
			}
			that.dialog.confirm( "确定"+text+"?", function( event, index ) {
				if ( index == 1 ) return false;
				that.loading.show();
				$.ajax( {
					url: "operate/channel/bizchannel/setAdmin",
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
		handlers.add = function(  ) {
			var that = this.global();
			that.page.open( {
				title: "管理员管理 | 新增",
				url: "operate/channel/bizchannel/adminform",
				size: "modal-lg",
				params: {},
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
			that.page.open( {
				title: "管理员管理 | 编辑",
				url: "operate/channel/bizchannel/adminform",
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
		//下载员工二维码
		handlers.qrcode = function( items ) {
			if ( items.length != 1 ) {
				return message.error( "请选择一条操作数据。" );
			}
			var item = items[ 0 ]; //获取一条数据
    	    var qrCodePath = item.qrCodePath;
			var that = this.global();
			$.ajax( {
				url:"pub/asysatt/show/"+qrCodePath+"/png",
				method:"GET",
				success: function( data ) {
					if ( !data.success ) {
						return message.error( data.msg );
					}
					message.success( data.msg );
					that.vars.gridVar.load();
				}
			} );
			return false;
			
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
					url: "operate/channel/bizchannel/delAdmin",
					type: "POST",
					data: { "ids": ids },
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
		//保存到服务器
		handlers.save = function (selectItems){
			if ( selectItems == null || selectItems.length == 0 ) {
				return message.error( "请选择至少一条操作数据。" );
			}
			that.loading.show(); 
			$.ajax( {
				url: "operate/channel/bizchannel/saveAdmin",
				type: "POST",
				contentType:"application/json",
				data: JSON.stringify(selectItems[0]),
				success: function( data ) {
					if ( !data.success ) {
						return message.error( data.msg );
					}
					message.success( data.msg );
					that.close();
				}
			} );
			
		};
		
	};
	
	return Global;
});