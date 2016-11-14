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
		code.cache("Group_Type");
		
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
			that.selector.find( "input[name=groupType]" ).select( {//实例下拉插件
				code: { type: "Group_Type" }
			} );
			//全局变量
			var item=that.params.item;
			//初始化将用户名更新到隐藏查询输入框
			that.selector.find( "#loginName" ).valChange( item.loginName );
			var config = {
				remote: {
		        	url: "system/asysuser/branchs",
		        	params:{"params[loginName]":item.loginName}
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
		        			that.vars.gridVar.load({"params[loginName]": item.loginName,"params[branchNo]":items[0].branchNo });
		        		}
		        	},
		        	click: {
		        		 handler: function (event, items, rowIndex) {
		        			 //that.vars.gridVar.select( 0 );
			        			that.vars.gridVar.load({"params[loginName]": item.loginName,"params[branchNo]": items[0].branchNo});
		        		 }
		        	}
		        },
		        customEvents: []
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "网点编号", name: "branchNo", width: "180px", lockWidth: true };
			cols[ cols.length ] = { title: "网点", name: "branchName", width: "180px", lockWidth: true };
			cols[ cols.length ] = { title: "网点地址", name: "branchAddr", width: "180px", lockWidth: true };
			cols[ cols.length ] = { title: "操作",  width: "80px", lockWidth: true,align:'center', renderer: function( val, item, rowIndex ) {
				return format( [ '<a href="javascript:;" class="pro-channel"><i class="fa fa-retweet"></i>'+"解除关系"+'</a>' ] );
			}};
			
			//解除关系函数
			config.customEvents.push( {
				target: ".pro-channel",
				handler: function( event, item, rowIndex ) {
					that.handlers.delchannel(item,event.currentTarget.text);
					return false;
				}
			} );
			that.vars.bizChannelGrid = that.selector.find( "#bizChannelGrid" ).grid( config );//renderer
			//网点列表
			var config = {
				remote: {
		        	url: "system/asysuser/bridge",
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
			cols[ cols.length ] = { title: "组编号", name: "groupNo", width: "200px", lockWidth: true };
			cols[ cols.length ] = { title: "组名", name: "groupName", width: "200px", lockWidth: true };
			cols[ cols.length ] = { title: "组类型", name: "groupType",width:"80px", lockWidth: true,align:'center',renderer : function (val, item, rowIndex){
				return base.code.getText("Group_Type",val);
			}};
			cols[ cols.length ] = { title: "操作",  width: "80px", lockWidth: true,align:'center', renderer: function( val, item, rowIndex ) {
				return format( [ '<a href="javascript:;" class="pro-toggle"><i class="fa fa-retweet"></i>'+"解除关系"+'</a>' ] );
			}};
			//解除网点和人员的关系
			config.customEvents.push( {
				target: ".pro-toggle",
				handler: function( event, item, rowIndex ) {
					that.handlers.toggle(item,event.currentTarget.text);
					return false;
				}
			} );
			that.vars.gridVar = that.selector.find( "#userGroupGrid" ).grid( config );//renderer
		};
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {
			
		};
		
		/**
		 * 解除关系执行函数
		 */
		handlers.toggle = function( item,text ) {
			var that = this.global();
			that.dialog.confirm( "确定"+text+"?", function( event, index ) {
				if ( index == 1 ) return false;
				that.loading.show();
				$.ajax( {
					url: "system/asysuser/deleteGroup",
					type: "POST",
					data: {loginName: item.loginName,groupNo:item.groupNo},
					complete: function() {
						that.loading.hide();
					},
					success: function( data ) {
						if ( !data.success ) {
							return message.error( data.msg );
						}
						message.success( data.msg );
						that.vars.bizChannelGrid.load({"params[loginName]":item.loginName});
						that.vars.gridVar.load();
					}
				} );
			} );
		};//end
		/**
		 * 接触网点和人缘关系
		 */
		handlers.delchannel = function( item,text ) {
			var that = this.global();
			that.dialog.confirm( "确定"+text+"?", function( event, index ) {
				if ( index == 1 ) return false;
				that.loading.show();
				$.ajax( {
					url: "system/asysuser/deleteBizchannels",
					type: "POST",
					data: {loginName: item.loginName,branchNo:item.branchNo},
					complete: function() {
						that.loading.hide();
					},
					success: function( data ) {
						if ( !data.success ) {
							return message.error( data.msg );
						}
						message.success( data.msg );
						that.vars.bizChannelGrid.load({"params[loginName]":item.loginName});
					}
				} );
			} );
		};//end

	};
	return Global;
	
} );