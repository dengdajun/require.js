define(function (){
	function Global( vars ) {
		var $ = require( "jquery" )
		, base = require( "app/base" )
		, message = base.message
		, tools = base.tools;
		var moment = require( "moment" );
		base.code.cache( "branch_grp_type" );
		
		var that = this;
		var vars = that.vars = $.extend( true, {}, vars );
		var handlers = that.handlers = {};//处理程序
		handlers.global = function() { return that; };
		
		that.init = function() {
			this.load();
			this.layout(); 
		};
		that.load = function() {
			var that = this.global();
			that.params.item = {};
			if ( !that.params.item ) return;
			that.handlers.load( that.params.item );
		};
		
		that.layout = function() {
			var that = this.global();
			that.selector.find( ".input" ).input( {} );
			
			that.selector.find("#closeBtn").click(function (){
				that.close();
				return false;
			});
			that.selector.find("#submitBtn").click(function (){
				that.handlers.save();
				return false;
			});
			
			var config = {
				remote: {
		        	url: "market/proconfig/bragrp/selectCowdNotProduct",
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
		        plugins: [],
		        events: {},
		        sort:false,
		        customEvents: []
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "网点群编号", name: "braCrowdNo", width: "180px", lockWidth: true, mouseover:true };
			cols[ cols.length ] = { title: "网点群名称", name: "braCrowdName", width: "180px", lockWidth: true, mouseover:true };
			cols[ cols.length ] = { title: "网点群规则", name: "ruleName", width: "180px", lockWidth: true, mouseover:true };
			cols[ cols.length ] = { title: "状态", name: "stat", width: "60px", lockWidth: true, renderer: function( val, item, rowIndex ) {
					return base.code.getText( "Is_No", val )
				}
			};
			
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
			that.vars.gridCownVar = that.selector.find( "#bizChannelCownGrid" ).grid( config );//renderer
		};
		
		//业务逻辑关系
		handlers.load = function( item ) {
			var that = this.global();
			that.selector.find( "#prodNo" ).valChange( item.prodNo ); 
		};
		
		handlers.save = function (){
			var selectItems = that.vars.gridCownVar.selectedRows();
			if ( selectItems == null || selectItems.length == 0 ) {
				return message.error( "请选择至少一条操作数据。" );
			}
			
			var userGroupIds = new Array();
			$.each( selectItems, function( index, item ) {
				userGroupIds.push( item.braCrowdNo );
			} ); 
			userGroupIds.push("");
			
			var prodNo = that.selector.find( "#prodNo" ).val();
			
			$.ajax( {
				url: "market/proconfig/bragrp/saveBranchCown",
				type: "POST",
				data: {'branchCownIds':userGroupIds,'prodNo':$( "#prodNo" ).val()},
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