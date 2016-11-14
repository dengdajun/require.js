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
		code.cache( "Branch_Type,Is_No" );
		
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
		};
		
		//初始化远程请求处理
		that.load = function() {};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			that.selector.find( ".input" ).input( {} );//实例input插件
			
			that.selector.find( "#addBtn" ).bind( "click", function( event ) {
				that.handlers.add();
			} );
			
			that.selector.find( "#editBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.edit( items );
				return false;
			} );
			
			that.selector.find( "#delBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.del( items );
				return false;
			} );
			
			that.selector.find("#addBtnUserGroup").bind("click",function ( event){
				var items = that.vars.gridVar.selectedRows();
				that.handlers.addBtnUserGroup( items );
				return false;
			});
			
			that.selector.find("#delBtnUserGroup").bind("click",function ( event){
				var items = that.vars.userGroupGrid.selectedRows();
				that.handlers.delBtnUserGroup( items );
				return false;
			});
			that.selector.find( "#bindAdmin" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.bindAdmin( items );
				return false;
			} );
			
			that.selector.find( "#bindPassAcct" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.bindPassAcct( items );
				return false;
			} );
			
			
			
			var config = {
				remote: {
		        	url: "operate/channel/bizchannel/list",
		        	params: {}
		        },
		        multi: false,
		        page: {
		        	pageSize: 5
		        },
		        query: {
		        	isExpand:true,
		        	target: that.selector.find( ".bizChannelGrid" )
		        },
		        plugins: [],
		        events: {
		        	loaded:{
		        		handler: function( event, items ) {
		        			//that.vars.gridVar.select( 0 );
		        			var item = items[ 0 ] || { branchNo: "$NO$" };
		        			that.vars.userGroupGrid.load({"params[branchNo]": item.branchNo});
		        		}
		        	},
		        	click: {
		        		 handler: function (event, items, rowIndex) {
		        			 //that.vars.gridVar.select( 0 );
			        			var item = items[ 0 ] || { branchNo: "$NO$" };
			        			that.vars.userGroupGrid.load({"params[branchNo]": item.branchNo});
		        		 }
		        	}
		        },
		        customEvents: []
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "网点编码", name: "branchNo", width: "200px", lockWidth: true };
			cols[ cols.length ] = { title: "网点名称", name: "branchName", width: "250px", lockWidth: true, mouseover:true };
			cols[ cols.length ] = { title: "网点类型", name: "branchTyp",width: "80px",lockWidth: true,align:'center', renderer:function (val, item, rowIndex ){
				return base.code.getText("Branch_Type",val);
			}};
			cols[ cols.length ] = { title: "联系人", name: "contctPer", width: "100px", lockWidth: true,align:'center'};
			cols[ cols.length ] = { title: "联系电话", name: "contctTel", width: "100px", lockWidth: true,align:'center' };
			cols[ cols.length ] = { title: "是否启用", name: "stat",width:"80px", lockWidth: true,align:'center',renderer : function (val, item, rowIndex){
				return base.code.getText("Is_No",val);
			}};
			cols[ cols.length ] = { title: "操作", name: "id", width: "80px", lockWidth: true,align:'center', renderer: function( val, item, rowIndex ) {
				var claName = item.stat=="13900001"?"失效":"启用";
				return format( [ '<a href="javascript:;" class="pro-toggle"><i class="fa fa-retweet"></i>'+claName+'</a>' ] )
			} };
			
			config.events.click = {
				handler: function( event, item, rowIndex ) {
					that.vars.userGroupGrid.load({"params[branchNo]": item[0].branchNo});
				}
			};
			
			config.customEvents.push( {
				target: ".pro-toggle",
				handler: function( event, item, rowIndex ) {
					that.handlers.toggle(item,event.currentTarget.text);
					return false;
				}
			} );
			
			
			that.vars.gridVar = that.selector.find( "#bizChannelGrid" ).grid( config );//renderer
			
			
			//用户组列表
			var config = {
				remote: {
		        	url: "operate/channel/bizchannel/userGroupList",
		            params: {}
		        },
		        multi: true,
		        page: {
		        	pageSize: 5
		        },
		        query: {
		        	isExpand:true,
		        	target: that.selector.find( ".userGroupGrid" )
		        },
		        autoLoad: false,
		        plugins: [],
		        customEvents: []
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "组编号", name: "groupNo", width: "180px", lockWidth: true };
			cols[ cols.length ] = { title: "组名称", name: "groupName", width: "200px", lockWidth: true };
			cols[ cols.length ] = { title: "是否启用", name: "stat", width: "100px", lockWidth: true ,align:'center',
					renderer:function(val,item,rowIndex){return base.code.getText("Is_No",val);}};
			cols[ cols.length ] = { title: "备注", name: "remark", mouseover:true, width: "300px", lockWidth: true};
			config.customEvents.push( {
				target: ".edit",
				handler: function( event, item, rowIndex ) {
					
				}
			} );
			that.vars.userGroupGrid = that.selector.find( "#userGroupGrid" ).grid( config );//renderer
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {
			
		};
		handlers.bindAdmin = function ( items ){
			if ( items == null || items.length == 0 ) {
				return message.error( "请选择至少一条操作数据。" );
			}
			if( items.length > 1){
				return message.error( "只能一条操作数据。" );
			}
			var item = items[ 0 ]; //获取一条数据
			var that = this.global();
			that.selector.find( "#branchNo" ).valChange( item.branchNo );
			that.page.open( {
				title: "网点管理 | 员工操作",
				url: "operate/channel/bizchannel/adminForm",
				size: "modal-lg",
				params: {"params[loginCode]":item.branchNo},
				events: {
					hiden: function( closed, data ) {
						that.vars.userGroupGrid.load();
						if ( !closed ) return;
					}
				}
			} );
			/*that.loading.show();
			$.ajax( {
				url: "operate/channel/bizchannel/getCountAdmin",
				type: "POST",
				data: {"branchNo":item.branchNo},
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
					if ( !data.success ) {
						return message.error( data.msg );
					}
					that.modal.open( {
						title: "网点管理 | 待选管理员",
						url: "operate/channel/bizchannel/adminForm",
						size: "modal-lg",
						params: {"params[branchNo]":item.branchNo},
						events: {
							hiden: function( closed, data ) {
								that.vars.userGroupGrid.load();
								if ( !closed ) return;
							}
						}
					} );
					that.vars.gridVar.load();
				}
			} );*/
			
		};//end
		handlers.add = function(  ) {
			var that = this.global();
			that.page.open( {
				title: "网点管理 | 新增",
				url: "operate/channel/bizchannel/form",
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
				title: "网点管理 | 编辑",
				url: "operate/channel/bizchannel/form",
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
					url: "operate/channel/bizchannel/delete",
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
					url: "operate/channel/bizchannel/updateBizCanlStatus",
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
		
		
		//用户组对话框
		handlers.addBtnUserGroup = function ( items ){
			if ( items == null || items.length == 0 ) {
				return message.error( "请选择至少一条操作数据。" );
			}
			if( items.length > 1){
				return message.error( "请选择至少一条操作数据。" );
			}
			var item = items[ 0 ]; //获取一条数据
			var that = this.global();
			that.modal.open( {
				title: "网点管理 | 用户组",
				url: "operate/channel/bizchannel/userGroup",
				size: "modal-lg",
				params: { item: item },
				events: {
					hiden: function( closed, data ) {
						that.vars.userGroupGrid.load();
						if ( !closed ) return;
					}
				}
			} );
			
		};//end
		
		handlers.delBtnUserGroup = function ( items ){
			if ( items == null || items.length == 0 ) {
				return message.error( "请选择至少一条操作数据。" );
			}
			var groupNos = [];
			$.each( items, function( index, item ) {
				groupNos.push( item.groupNo );
			} ); 
			
			var branchItems = that.vars.gridVar.selectedRows();
			if ( branchItems == null || branchItems.length == 0 ||  branchItems.length>1) {
				return message.error( "请选择至少一条操作数据。" );
			}
			
			that.dialog.confirm( "确定删除选择的[ " + items.length + " ]条操作数据？", function( event, index ) {
				if ( index == 1 ) return false;
				$.ajax( {
					url: "operate/channel/bizchannel/deleteGroup",
					type: "POST",
					data: { groupNos: groupNos ,branchNo:branchItems[0].branchNo},
					success: function( data ) {
						if ( !data.success ) {
							return message.error( data.msg );
						}
						message.success( data.msg );
						that.vars.userGroupGrid.load();
					}
				} );
			} );
		};
		
		
		//绑定资金穿透账号
		handlers.bindPassAcct = function(items){
			var that = this.global();
			if ( items == null || items.length != 1 ) {
				return message.error( "请选择一条数据操作!" );
			}
			var item = {
				"branchNo":items[0].branchNo,
				"branchName":items[0].branchName
			}
			
			that.page.open( {
				title: "网点管理 | 绑定资金穿透账户",
				url: "brhpass/acct/index",
				size: "modal-lg",
				params: {item:item},
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.gridVar.load();
					}
				}
			} );
		}
		
		
		
	};
	return Global;
} );