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
			that.selector.find( "#braCloseBtn" ).bind('click',function (event){
				that.close();
				return false;
			});
			//网点组 对话框
			that.selector.find( "#addBtnGroup" ).bind( "click", function( event ) {
				that.handlers.openGroupItem();
			} );
			that.selector.find( "#delBtnGroup" ).bind( "click", function( event ) {
				that.handlers.delGroupItem();
			} );
			
			//网点群 对话框
			that.selector.find( "#addBtnCown" ).bind( "click", function( event ) {
				that.handlers.openCownItem();
			} );
			that.selector.find( "#delBtnCown" ).bind( "click", function( event ) {
				that.handlers.delCownItem();
			} );
			
			that.handlers.layoutGroup();
			that.handlers.layoutCown();
		};
		
		handlers.load = function( item ) {
			var that = this.global();
			that.selector.find( "#prodNo" ).valChange( item.prodNo ); 
		};
		
		/**
		 * 初始化网点组
		 */
		handlers.layoutGroup = function (){
			var config = {
				remote: {
		        	url: "market/proconfig/bragrp/selectByProduct",
		            params: {}
		        },
		        multi: true,
		        sort: false,
		        page: {
		        	pageSize: 5
		        },
		        query: {
		        	isExpand:true,
		        	target: that.selector.find( ".bizChannelGroupGrid" )
		        },
		        plugins: [],
		        events: {},
		        customEvents: []
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "分组编码", name: "groupNo", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "组名称", name: "groupName", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "组类型", name: "groupTyp" ,width: "80px",lockWidth: true,align:'center',renderer: function( val, item, rowIndex ) {return base.code.getText( "branch_grp_type", val );}
			};
			cols[ cols.length ] = { title: "备注", name: "remark", mouseover:true };

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
			that.vars.gridGroupVar = that.selector.find( "#bizChannelGroupGrid" ).grid( config );//renderer
		};//end
		
		/**
		 * 初始化已选网点群
		 */
		handlers.layoutCown = function (){
			var config = {
				remote: {
		        	url: "market/proconfig/bragrp/selectCowdByProduct",
		            params: {}
		        },
		        multi: true,
		        page: {
		        	pageSize: 5
		        },
		        query: {
		        	isExpand:true,
		        	target: that.selector.find( ".bizChannelCownGrid" )
		        },
		        plugins: [],
		        events: {},
		        customEvents: []
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "网点群编号", name: "braCrowdNo", width: "250px", lockWidth: false };
			cols[ cols.length ] = { title: "网点群名称", name: "braCrowdName", width: "250px", lockWidth: false };
			
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
			that.vars.gridCownVar = that.selector.find( "#bizChannelCownGrid" ).grid( config );//renderer
		};//end
		
		
		//网点组 对话框
		handlers.openGroupItem = function (){
			var that = this.global();
			
			var prodStat = $("#prodStat").val();
			if(prodStat == '16500002'){
				return message.error( '产品销售中...禁止操作' );
			}
			
			var item = new Object();
			item.prodNo = $( "#prodNo" ).val();
			that.modal.open( {
				title: "产品-渠道管理 | 待选网点组",
				url: "market/proconfig/bragrp/bragrpGroupForm",
				size: "modal-lg",
				params: item,
				events: {
					hiden: function( closed, data ) {
						that.vars.gridGroupVar.load();
					}
				}
			} );
		};
		
		//网点组 解除关系
		handlers.delGroupItem = function (){
			var that = this.global();
			
			var prodStat = $("#prodStat").val();
			if(prodStat == '16500002'){
				return message.error( '产品销售中...禁止操作' );
			}
			
			var selectItems = that.vars.gridGroupVar.selectedRows();
			if ( selectItems == null || selectItems.length == 0 ) {
				return message.error( "请选择至少一条销售组信息。" );
			}
			var userGroupIds = new Array();
			$.each( selectItems, function( index, item ) {
				userGroupIds.push( item.groupNo );
			} ); 
			userGroupIds.push("");
			that.dialog.confirm("确定删除选择的[ " + selectItems.length + " ]条数据？",function (event, index ){
				if ( index == 1 ) return false;
				that.loading.show();
				var prodNo = that.selector.find( "#prodNo" ).val();
				$.ajax( {
					url: "market/proconfig/bragrp/deleteBranchGroup",
					type: "POST",
					data: {'branchGroupIds':userGroupIds,'prodNo':$( "#prodNo" ).val()},
					complete: function() {
						that.loading.hide();
					},
					success: function( data ) {
						if ( !data.success ) {
							return message.error( data.msg );
						}
						message.success( data.msg );
						that.vars.gridGroupVar.load();
					}
				} );
			});
			
		};
		
		//网点群 对话框
		handlers.openCownItem = function (){
			var that = this.global();
			
			var prodStat = $("#prodStat").val();
			if(prodStat == '16500002'){
				return message.error( '产品销售中...禁止操作' );
			}
			
			var item = new Object();
			item.prodNo = $( "#prodNo" ).val();
			that.modal.open( {
				title: "产品-渠道管理 | 待选网点群",
				url: "market/proconfig/bragrp/bragrpCownForm",
				size: "modal-lg",
				params: item,
				events: {
					hiden: function( closed, data ) {
						that.vars.gridCownVar.load();
					}
				}
			} );
		};
		//网点群 解除关系
		handlers.delCownItem = function (){
			var that = this.global();
			
			var prodStat = $("#prodStat").val();
			if(prodStat == '16500002'){
				return message.error( '产品销售中...禁止操作' );
			}
			
			var selectItems = that.vars.gridCownVar.selectedRows();
			if ( selectItems == null || selectItems.length == 0 ) {
				return message.error( "请选择至少一条销售组信息。" );
			}
			var userGroupIds = new Array();
			$.each( selectItems, function( index, item ) {
				userGroupIds.push( item.braCrowdNo );
			} ); 
			userGroupIds.push("");
			var prodNo = that.selector.find( "#prodNo" ).val();
			
			that.dialog.confirm("确定删除选择的[ " + selectItems.length + " ]条数据？",function (event, index ){
				if ( index == 1 ) return false;
				that.loading.show();
				$.ajax( {
					url: "market/proconfig/bragrp/deleteBranchCown",
					type: "POST",
					data: {'branchCownIds':userGroupIds,'prodNo':$( "#prodNo" ).val()},
					complete: function() {
						that.loading.hide();
					},
					success: function( data ) {
						if ( !data.success ) {
							return message.error( data.msg );
						}
						message.success( data.msg );
						that.vars.gridCownVar.load();
					}
				} );
			});
			
		};
	};
	
	return Global;
});