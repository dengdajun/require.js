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
			this.load();
			this.layout(); 
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
				code: { type: "Is_No" }
			} );
			
			//保存事件
			that.selector.find( "#submitBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.save( items );
			} );
			//关闭事件
			that.selector.find( "#closeBtn" ).click( function(event) {
				that.close();
				return false;
			});
			
			var config = {
				remote: {
		        	url: "operate/channel/bizchannel/findUserGroupNotInGroupNo",
		            params: {'branchNo':$( "#branchNo" ).val()}
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
			cols[ cols.length ] = { title: "组编号", name: "groupNo", width: "180px", lockWidth: true };
			cols[ cols.length ] = { title: "组名称", name: "groupName", width: "180px", lockWidth: true };
			cols[ cols.length ] = { title: "状态", name: "stat", width: "180px", lockWidth: true ,
					renderer:function(val,item,rowIndex){return base.code.getText("Is_No",val);}};
			cols[ cols.length ] = { title: "备注", name: "remark", };
			
			config.events.click = {
				handler: function( event, item, rowIndex ) {
					//item 当期行数据
					//rowIndex 当前行索引
					
					//处理其他逻辑
				}
			};
			
			config.customEvents.push( {
				target: ".edit",
				handler: function( event, item, rowIndex ) {
					
				}
			} );
			
			config.remote.params["params[branchNo]"] = $( "#branchNo" ).val();
			
			that.vars.gridVar = that.selector.find( "#userGroupGrid" ).grid( config );//renderer
			
			
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {
			that.selector.find( "#branchNo" ).valChange(data.branchNo);
		};
		
		handlers.add = function(  ) {
			var that = this.global();
			that.page.open( {
				title: "用户组管理 | 新增",
				url: "system/asysusergroup/form",
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
		
		handlers.save = function ( items ){
			if ( items.length <0 ||  items== null) {
				return message.error( "请选择一条操作数据。" );
			}
			
			var groupNos = [];
			$.each( items, function( index, item ) {
				groupNos.push( item.groupNo );
			} ); 
			
			$.ajax( {
				url: "operate/channel/bizchannel/userGroupSave",
				type: "POST",
					data: { 'groupNos': groupNos,'branchNo':$("#branchNo").val() },
				success: function( data ) {
					if ( !data.success ) {
						return message.error( data.msg );
					}
					message.success( data.msg );
					that.close();
				}
			} );
			
		};
		
		//
		
	};
	
	return Global;
	
} );