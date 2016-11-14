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
		code.cache( "stat,sex,certType" );
		
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
			that.selector.find( ".input" ).input( {} );//实例input插件
			
			that.selector.find( "input[name=stat]" ).select( {//实例下拉插件
				code: { type: "stat" }
			} );
			
			that.selector.find( "#addBtn" ).bind( "click", function( event ) {
				that.handlers.add(that.params.item);
			} );
			
			that.selector.find( "#delBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.del( items );
				return false;
			} );
			that.selector.find( "#CloseBtn" ).click( function(event) {
				that.close();
				return false;
			});
			
			var config = {
				remote: {
		        	url: "operate/channel/bizchannel/findByGroup",
		            params: {}
		        },
		        multi: false,
		        page: true,
		        query: {
		        	isExpand:true,
		        	target: that.selector.find( ".grid-query" )
		        },
		        plugins: [],
		        events: {},
		        customEvents: []
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "网点编码", name: "branchNo", width: "200px", lockWidth: true };
			cols[ cols.length ] = { title: "网点名称", name: "branchName", width: "200px", lockWidth: true };
			cols[ cols.length ] = { title: "网点类型", name: "branchTyp",width: "80px", lockWidth: true,align:'center',
					renderer: function( val, item, rowIndex ) {return base.code.getText( "Branch_Type", val );}		
			};
			if ( that.params.item ) {
				config.remote.params["params[groupNo]"] = that.params.item.groupNo;
			}
			config.events.click = {
				handler: function( event, item, rowIndex ) {
				}
			};
			
			config.customEvents.push( {
				target: ".edit",
				handler: function( event, item, rowIndex ) {
					
				}
			} );
			
			that.vars.gridVar = that.selector.find( "#bizChannelGrid" ).grid( config );//renderer
			
			
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {
			that.selector.find( ":input[name=groupNo]" ).valChange( data.groupNo );
		};
		handlers.add = function( item ) {
			var that = this.global();
			that.modal.open( {
				title: "网点分组管理 | 新增网点",
				url: "operate/channel/branchgroup/addBranch",
				size: "modal-lg",
				params: {item:item},
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.gridVar.load();
					}
				}
			} );
			
		};
		
		handlers.del = function( items ) {
			var that = this.global();
			var items = that.vars.gridVar.selectedRows();
			if ( items == null || items.length == 0 ) {
				return message.error( "请选择需要删除的网点" );
			}
			var branchNos = [];
			$.each( items, function( index, item ) {
				branchNos.push( item.branchNo );
			} );
			that.dialog.confirm( "确定删除选择的[ " + items.length + " ]条操作数据？", function( event, index ) {
				if ( index == 1 ) return false;
				$.ajax( {
					url: "operate/channel/branchgroup/deleteBranch",
					type: "POST",
					data: {branchNos:branchNos,groupNo:that.selector.find(":input[name='groupNo']").val()},
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
	
} );