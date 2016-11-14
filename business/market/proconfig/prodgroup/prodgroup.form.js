define(function () { 
	
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
			this.layout(); 
			this.layoutSelectBragrp();
			this.layoutSelectBragrpCown();
		};
		
		//初始化远程请求处理
		that.load = function() {
			var that = this.global();
			that.params.item = {};
			if ( !that.params.item ) return;
			that.handlers.load( that.params.item );
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			
			that.selector.find( ".input" ).input( {} );
			that.selector.find( "#userCloseBtn" ).bind('click',function (event){
				that.close();
				return false;
			});
			that.selector.find( "#proGrid #addBtn #baseInfo" ).bind( "click", function( event ) {
				that.handlers.add();
			} );
			that.selector.find( "li>a" ).bind( "click", function( event ) {
				that.handlers.add2();
			} );
			
			//销售组 对话框
			that.selector.find( "#addBtn" ).bind( "click", function( event ) {
				that.handlers.openGroupItem();
			} );
			that.selector.find( "#delBtn" ).bind( "click", function( event ) {
				that.handlers.delGroupItem();
			} );
			//销售群 对话框
			that.selector.find( "#addBtnCown" ).bind( "click", function( event ) {
				that.handlers.openCownItem();
			} );
			that.selector.find( "#delBtnCown" ).bind( "click", function( event ) {
				that.handlers.delCownItem();
			} );
			
			that.selector.find( "#closeBtn" ).bind( "click", function( event ) {
				that.close();
				return false;
			} );
			
		};
		
		//初始化已选网点组
		that.layoutSelectBragrp = function (){
			var config = {
				sort:false,
				remote: {
		        	url: "market/proconfig/prodgroup/selectByProduct",
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
		        sort:false,
		        plugins: [],
		        events: {},
		        customEvents: []
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "组编号", name: "groupNo", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "组名称", name: "groupName", width: "250px", lockWidth: true };
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
			//初始化已选网点组
			that.vars.gridVarSelect = that.selector.find( "#userGroupGrid" ).grid( config );//renderer
		};
		
		
		//初始化已选销售群
		that.layoutSelectBragrpCown = function (){
			var config = {
				sort:false,
				remote: {
					url: "market/proconfig/prodgroup/selectCowdByProduct",
					params: {"params[prodNo]":$( "#prodNo" ).val()}
				},
				multi: true,
				plugins: [],
				events: {},
				 page: {
			        	pageSize: 5
			        },
				query: {
					isExpand:true,
			        	target: that.selector.find( ".userCrowdGrid" )
			        },
				customEvents: []
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "群编号", name: "crowdNo", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "群名称", name: "crowdName", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "备注", name: "crowdDesc", mouseover:true };
			
			config.events.click = {
					handler: function( event, item, rowIndex ) {
						
					}
			};
			config.customEvents.push( {
				target: ".edit",
				handler: function( event, item, rowIndex ) {
					
				}
			} );
			that.vars.gridVarSelectCown = that.selector.find( "#userCrowdGrid" ).grid( config );//renderer
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		
		handlers.load = function( item ) {
			var that = this.global();
			that.selector.find( "#prodNo" ).valChange( item.prodNo ); 
		};
		
		//销售群 对话框
		handlers.openCownItem = function (){
			var that = this.global();
			
			var prodStat = $("#prodStat").val();
			if(prodStat == '16500002'){
				return message.error( '产品销售中...禁止操作' );
			}
			
			var item = new Object();
			item.prodNo = $( "#prodNo" ).val();
			that.modal.open( {
				title: "产品-销售群管理 | 待选销售群",
				url: "market/proconfig/prodgroup/userCownForm",
				size: "modal-lg",
				params: item,
				events: {
					hiden: function( closed, data ) {
						that.vars.gridVarSelectCown.load();
					}
				}
			} );
		};
		
		//销售群 解除关系
		handlers.delCownItem = function (){
			var that = this.global();
			
			var prodStat = $("#prodStat").val();
			if(prodStat == '16500002'){
				return message.error( '产品销售中...禁止操作' );
			}
			
			var selectItems = that.vars.gridVarSelectCown.selectedRows();
			if ( selectItems == null || selectItems.length == 0 ) {
				return message.error( "请选择至少一条销售群信息。" );
			}
			var userGroupIds = new Array();
			$.each( selectItems, function( index, item ) {
				userGroupIds.push( item.crowdNo );
			} ); 
			userGroupIds.push("");
			var prodNo = that.selector.find( "#prodNo" ).val();
			that.dialog.confirm( "确定删除选择的[ " + selectItems.length + " ]条数据？", function( event, index ) {
				if ( index == 1 ) return false;
				$.ajax( {
					url: "market/proconfig/prodgroup/deleteUserCown",
					type: "POST",
					data: {'userCownIds':userGroupIds,'prodNo':$( "#prodNo" ).val()},
					success: function( data ) {
						if ( !data.success ) {
							return message.error( data.msg );
						}
						message.success( data.msg );
						that.vars.gridVarSelectCown.load();
					}
				} );
			} );
		};
		
		//销售组 对话框
		handlers.openGroupItem = function (){
			var that = this.global();
			
			var prodStat = $("#prodStat").val();
			if(prodStat == '16500002'){
				return message.error( '产品销售中...禁止操作' );
			}
			
			var item = new Object();
			item.prodNo = $( "#prodNo" ).val();
			that.modal.open( {
				title: "产品-销售组管理 | 待选销售组",
				url: "market/proconfig/prodgroup/userGroupForm",
				size: "modal-lg",
				params: item,
				events: {
					hiden: function( closed, data ) {
						that.vars.gridVarSelect.load();
					}
				}
			} );
		};
		
		//销售组 解除关系
		handlers.delGroupItem = function (){
			var that = this.global();
			
			var prodStat = $("#prodStat").val();
			if(prodStat == '16500002'){
				return message.error( '产品销售中...禁止操作' );
			}
			
			var selectItems = that.vars.gridVarSelect.selectedRows();
			if ( selectItems == null || selectItems.length == 0 ) {
				return message.error( "请选择至少一条销售组信息。" );
			}
			var userGroupIds = new Array();
			$.each( selectItems, function( index, item ) {
				userGroupIds.push( item.groupNo );
			} ); 
			userGroupIds.push("");
			var prodNo = that.selector.find( "#prodNo" ).val();
			that.dialog.confirm( "确定删除选择的[ " + selectItems.length + " ]条数据？", function( event, index ) {
				if ( index == 1 ) return false;
				$.ajax( {
					url: "market/proconfig/prodgroup/deleteUserGroup",
					type: "POST",
					data: {'userGroupIds':userGroupIds,'prodNo':$( "#prodNo" ).val()},
					success: function( data ) {
						if ( !data.success ) {
							return message.error( data.msg );
						}
						message.success( data.msg );
						that.vars.gridVarSelect.load();
					}
				} );
			} );
		};
		
	};
	
	return Global;
	
} );