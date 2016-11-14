define (function (){
	function Global( vars ) {
		var $ = require( "jquery" )
		, base = require( "app/base" )
		, message = base.message
		, tools = base.tools;
		var moment = require( "moment" );
		base.code.cache( "branch_grp_type,Is_No" );
		
		var that = this;
		var vars = that.vars = $.extend( true, {}, vars );
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
			if ( !that.params) return;
			that.handlers.load( that.params.prodNo );
		};
		
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			that.selector.find( ".input" ).input( {} );
			
			that.selector.find( "input[name=stat]" ).select( {//实例下拉插件
				code: { type: "Is_No" }
			} );
			
			that.selector.find("#closeBtn").click(function (){
				that.close();
				return false;
			});
			that.selector.find("#submitBtn").click(function (){
				that.handlers.save();
				return false;
			});
			
			var config = {
				sort:false,
				remote: {
		        	url: "market/proconfig/prodgroup/selectCowdNotProduct",
		            params: {}
		        },
		        multi: true,
		        page: {
		        	pageSize: 10
		        },
		        query: {
		        	isExpand:true,
		        	target: that.selector.find( ".grid-query" )
		        },
		        plugins: [],
		        events: {},
		        sort:false,
		        customEvents: []
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "群编号", name: "crowdNo", width: "180px", lockWidth: true };
			cols[ cols.length ] = { title: "群名称", name: "crowdName", width: "180px", lockWidth: true };
			cols[ cols.length ] = { title: "状态", name: "stat", width: "180px", lockWidth: true ,
					renderer:function(val,item,rowIndex){return base.code.getText("Is_No",val);}};
			cols[ cols.length ] = { title: "描述", name: "crowdDesc", };
			config.events.click = {
				handler: function( event, item, rowIndex ) {
			
				}
			};
			config.customEvents.push( {
				target: ".edit",
				handler: function( event, item, rowIndex ) {
					
				}
			} );
			config.remote.params["params[prodNo]"] = $( "#prodNo" ).val();
			config.remote.params["params[stat]"] = '13900001';
			//初始化已选网点组
			that.vars.gridVarSelect = that.selector.find( "#userCownGrid" ).grid( config );//renderer
			
		};
		//业务逻辑处理
		handlers.load = function( prodNo ) {
			var that = this.global();
			that.selector.find( "#prodNo" ).valChange( prodNo ); 
		};
		
		handlers.save = function (){
			var selectItems = that.vars.gridVarSelect.selectedRows();
			if ( selectItems == null || selectItems.length == 0 ) {
				return message.error( "请选择至少一条操作数据。" );
			}
			
			var userGroupIds = new Array();
			$.each( selectItems, function( index, item ) {
				userGroupIds.push( item.crowdNo );
			} ); 
			userGroupIds.push("");
			
			var prodNo = that.selector.find( "#prodNo" ).val();
			
			$.ajax( {
				url: "market/proconfig/prodgroup/saveUserCown",
				type: "POST",
				data: {'userCownIds':userGroupIds,'prodNo':$( "#prodNo" ).val()},
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