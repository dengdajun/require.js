define(function (){
	function Global( vars ){
		var $ = require( "jquery" )
		, base = require( "app/base" )
		, message = base.message
		, tools = base.tools;
		var moment = require( "moment" );
		base.code.cache( "branch_grp_type,First_Pay_Type,Is_No" );
		
		var that = this;
		var vars = that.vars = $.extend( true, {}, vars );
		var handlers = that.handlers = {};//处理程序
		handlers.global = function() { return that; };
		
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
		
		that.layout = function (){
			var that = this.global();
			that.selector.find( ".input" ).input( {} );
			
			that.selector.find( "#SubBtn" ).bind('click',function (event){
				var items = that.vars.feeconfGrid.selectedRows();
				that.handlers.save(items);
			});
			that.selector.find( "#CloseBtn" ).bind('click',function (event){
				that.close();
				return false;
			});
			var feeconfGridConfig = {
				remote: {
		        	url: "market/proconfig/fee/selectNotInlist",
		            params: {}
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
		        sort:false,
		        plugins: [],
		        customEvents: []
			};
			feeconfGridConfig.cols = cols = [];
			cols[ cols.length ] = { title: "费用编号", name: "feeNo", width: "60px", lockWidth: true };
			cols[ cols.length ] = { title: "费用名称", name: "feeName", width: "120px", lockWidth: true };
			cols[ cols.length ] = { title: "值类型", name: "feeValTyp", width: "50px", lockWidth: true,
									renderer: function( val, item, rowIndex ) {return base.code.getText( "First_Pay_Type", val );}
			};
			cols[ cols.length ] = { title: "增值项", name: "feeTyp", width: "50px", lockWidth: true,
									renderer: function( val, item, rowIndex ) {return base.code.getText( "Is_No", val );}
			};
			cols[ cols.length ] = { title: "启用", name: "validFlag", width: "50px", lockWidth: true,
									renderer: function( val, item, rowIndex ) {return base.code.getText( "Is_No", val );}		
			};
			cols[ cols.length ] = { title: "备注", name: "feeRemark", width: "200px", lockWidth: true };
			
			feeconfGridConfig.remote.params["params[prodNo]"] = $( "#prodNo" ).val();
			feeconfGridConfig.remote.params["params[validFlag]"] = '13900001';
			feeconfGridConfig.remote.params["params[feeBelong]"] = '34700002';
			
			that.vars.feeconfGrid = that.selector.find( "#feeconfGrid" ).grid( feeconfGridConfig );
		};
		
		handlers.save = function ( items ){
			if ( items == null || items.length == 0 ) {
				return message.error( "请选择至少一条操作数据。" );
			}
			
			var feeNos = new Array();
			$.each( items, function( index, item ) {
				feeNos.push( item.feeNo );
			} ); 
			
			$.ajax( {
				url: "market/proconfig/fee/saveFeel",
				type: "POST",
				data: {'feeNos':feeNos,'prodNo':$( "#prodNo" ).val()},
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