define(function (){
	
	function Global( vars ) {
		var $ = require( "jquery" )
		, base = require( "app/base" )
		, message = base.message
		, tools = base.tools
		, code = base.code;
		
		code.cache( "Is_No" );	
		
		var that = this;
		var vars = that.vars = $.extend( true, {}, vars );//全局变梁
		var handlers = that.handlers = {};//处理程序
		handlers.global = function() { return that; };
		
		that.init = function() {
			this.layout(); 
			this.load();
		};
		
		//初始化远程请求处理
		that.load = function() {
			var that = this.global();
			if ( !that.params) return;
			that.handlers.load( that.params.prodNo );
		};
		that.layout = function (){
			var that = this.global();
			that.selector.find("#submitBtn").click(function (){
				that.handlers.save();
				return false;
			});
			that.selector.find("#closeBtn").click(function (){
				that.close();
				return false;
			});
			that.selector.find( ".input" ).input( {} );//实例input插件
			var prodNo = that.selector.find( "#prodNo" ).val();
			var config = {
				remote: {
		        	url: "market/proconfig/cust/notSelectCustGroup",
		            params: {"prodNo":prodNo}
		        },
		        multi: true,
		        sort: false,
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
			cols[ cols.length ] = { title: "群编号", name: "custGroup", width: "180px", lockWidth: true };
			cols[ cols.length ] = { title: "群名称", name: "custGroupName", width: "180px", lockWidth: true };
			cols[ cols.length ] = { title: "规则", name: "ruleName", width: "180px", lockWidth: true, mouseover:true };
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
			that.vars.gridVarSelect = that.selector.find( "#custGroupGrid" ).grid( config );//renderer
		};//end layout
		//业务逻辑处理
		handlers.load = function( prodNo ) {
			var that = this.global();
			that.selector.find( "#prodNo" ).valChange( prodNo ); 
		};
		//保存到服务器
		handlers.save = function (){
			var selectItems = that.vars.gridVarSelect.selectedRows();
			if ( selectItems == null || selectItems.length == 0 ) {
				return message.error( "请选择至少一条操作数据。" );
			}
			var data = {};
			data.custgroup = selectItems;
			data.prodNo = $("#prodNo").val();
			that.loading.show(); 
			$.ajax( {
				url: "market/proconfig/cust/saveCustGroup",
				type: "POST",
				contentType:"application/json",
				data: JSON.stringify(data),
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