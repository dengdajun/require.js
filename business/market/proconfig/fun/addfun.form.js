define(function () { 
	
	function Global( vars ) {
		
		var $ = require( "jquery" )
			, base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
		var moment = require( "moment" );
		//base.code.cache( "branch_grp_type" );
		
		var that = this;
		var vars = that.vars = $.extend( true, {}, vars );
		var handlers = that.handlers = {};//处理程序
		handlers.global = function() { return that; };
		
		//组件入口函数  相当于java.main
		that.init = function() {
			this.layout();
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			that.selector.find( "#submitBtn" ).bind( "click", function( event ) {
				that.handlers.save();
			} );
			that.selector.find( "#closeBtn" ).click( function(event) {
				that.close();
				return false;
			});
			that.selector.find( ".input" ).input( {} );
			var config = {
				sort:false,
		        remote: {
		        	url: "market/proconfig/fun/getFun",
		            params: {"params[isUse]":'13900001',"params[prodNo]":$("#prodNo").val()}
		        },
		        multi: true,
		        sort: false,
		        page: {
		        	pageSize: 10
		        },
		        query: {
		        	isExpand:true,
		        	target: that.selector.find( ".grid-query" )
		        },
		        plugins: [],
		        customEvents: []
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "资金渠道编号", name: "chanNo", width: "300px", lockWidth: true };
			cols[ cols.length ] = { title: "资金渠道名称", name: "chanName", width: "300px", lockWidth: true };
			that.vars.grid = that.selector.find( "#addFunGrid" ).grid( config );
			
		};
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.save = function (){
			var that = this.global();
			var rows = that.vars.grid.selectedRows();
			var data = {
					list:rows,
					params:{'prodId':$("#prodId").val(),'prodNo':$("#prodNo").val()}
			};
			that.loading.show();
			$.ajax( {
				url: "market/proconfig/fun/save",
				type: "POST",
				data: data,
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
					if ( !data.success ) {
						return message.error( data.msg );
					}
					message.success( data.msg );
					that.close(1);
				}
			} );
		}
	};
	
	return Global;
} );