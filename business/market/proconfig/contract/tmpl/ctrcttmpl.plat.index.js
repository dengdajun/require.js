define(function () { 
	function Global( vars ) {
		var $ = require( "jquery" )
			, base = require( "app/base" )
			, message = base.message
			, code = base.code
			, tools = base.tools;
		var moment = require( "moment" );
		
		code.cache( "Is_No,Tmpl_Type,Contract_Type,Cont_Apply_Type" );
		
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
			var that = this.global();
			that.selector.find( "input[name=tmplType]" ).select( {
				code: { type: "Tmpl_Type" }
			} );
			
			that.selector.find( "input[name=contractType]" ).select( {
				code: { type: "Contract_Type" }
			} );
			
			that.selector.find( "input[name=contApplyType]" ).select( {
				code: { type: "Cont_Apply_Type" }
			} );
			
			that.selector.find( "input[name=stat]" ).select( {
				code: { type: "Is_No" }
			} );
			that.selector.find( ".input" ).input( {} );
			
			that.selector.find( "#addBtn" ).bind( "click", function( event ) {
				that.handlers.add();
				return false;
			} );
			
			that.selector.find( "#delBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.del( items );
				return false;
			} );
			
			that.selector.find( "#tcCloseBtn" ).bind('click',function (event){
				that.close();
				return false;
			});
		
			var config = {
		        remote: {
		        	url: "market/proconfig/prodctrct/tmpl/list",
		            params: {"params[contractNo]":that.params.item.contractNo}
		        },
		        multi: true,
		        page: {
		        	pageSize: 10
		        },
		        query: {
		        	isExpand:true,
		        	target: that.selector.find( ".tmplConfGrid" )
		        },
		        plugins: [],
		        customEvents: []
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "模板", name: "fileName", width: "80px", lockWidth: true };
			cols[ cols.length ] = { title: "模板主题", name: "tmplType", width: "80px", lockWidth: true, renderer: function( val, item, rowIndex ) {
				return code.getText("Tmpl_Type",val);
			} };
			cols[ cols.length ] = { title: "适用对象", name: "contApplyType", width: "80px", lockWidth: true, renderer: function( val, item, rowIndex ) {
				return code.getText("Cont_Apply_Type",val);
			} };
			cols[ cols.length ] = { title: "模板类型", name: "contractType", width: "80px", lockWidth: true, renderer: function( val, item, rowIndex ) {
				return code.getText("Contract_Type",val);
			} };
			cols[ cols.length ] = { title: "是否启用", name: "stat", width: "80px", lockWidth: true, renderer: function( val, item, rowIndex ) {
				return code.getText("Is_No",val);
			} };
			cols[ cols.length ] = { title: "优先级", name: "level", width: "80px", lockWidth: true };
			cols[ cols.length ] = { title: "操作", name: "id", width: "100px", lockWidth: true,align:'center', renderer: function( val, item, rowIndex ) {
				var operName = item.stat=="13900001"?"禁用":"启用";
				return format( [ '<a href="javascript:;" class="pro-toggle"><i class="fa fa-arrows-v"></i>'+operName+'</a>&nbsp;&nbsp;<a href="javascript:;" class="toggle-up"><i class="fa fa-long-arrow-up"></i>上移</a>&nbsp;<a href="javascript:;" class="toggle-down"><i class="fa fa-long-arrow-down"></i>下移</a>' ] );
			} };
			config.customEvents.push(
				{
					target: ".toggle-up,.toggle-down",
					handler: function( event, item, rowIndex ) {
						that.handlers.moveUpOrDown(item,$(this));
						return false;
					}
				},
				{
					target: ".pro-toggle",
					handler: function( event, item, rowIndex ) {
						//event.data 获取参数
						that.handlers.switchStat(item);
						return false;
					}
				}
			);
			that.vars.gridVar = that.selector.find( "#tmplConfGrid" ).grid( config );
		};
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		//添加
		handlers.add = function (){
			var that = this.global();
			var contractType = that.params.item.contractType;
			var contractNo = that.params.item.contractNo;
			var chanNo = that.params.item.chanNo;
			var branchSelf = that.params.item.branchSelf;
			var compNo = that.params.item.compNo;
			var item = { "contractType":contractType,"contractNo": contractNo,"chanNo":chanNo,"branchSelf":branchSelf,"compNo":compNo };
			that.modal.open({
				title: "模板|添加",
				url: "market/proconfig/prodctrct/tmpl/"+contractType+"/form",
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
		
		//删除
		handlers.del = function( items ) {
			var prodStat = $("#prodStat").val();
			if ( items == null || items.length == 0 ) {
				return message.error( "请选择一条操作数据。" );
			}
			var ids = [];
			$.each( items, function( index, item ) {
				ids.push( item.id );
			} );
			var data = {
				"ids":ids,
				"params":{
					"contractNo":that.params.item.contractNo,
					"contractType":that.params.item.contractType,
					"chanNo":that.params.item.chanNo,
					"branchSelf":that.params.item.branchSelf
				},
				"prodNo":$("#prodNo").val()
			}
			
			that.dialog.confirm( "确定删除选择的[ " + items.length + " ]条数据？", function( event, index ) {
				if ( index == 1 ) return false;
				$.ajax( {
					url: "market/proconfig/prodctrct/tmpl/del",
					type: "POST",
					data: data,
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
		

		//上移下移
		handlers.moveUpOrDown = function(item,clickBtn){
			var prodStat = $("#prodStat").val();
			var oper=clickBtn.hasClass('toggle-up')?"up":"down";
			var data = {
				"map":item,
				"params":{
					"oper":oper
				}
			}
			that.loading.show();
			$.ajax({
				url: "market/proconfig/prodctrct/tmpl/moveUpOrDown",
				type: "POST",
				data: data,
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
					if ( !data.success ) {
						return message.error( data.msg );
					}
					message.success(data.msg);
					that.vars.gridVar.load();
				}
			} );
		};
		
		//启用禁用
		handlers.switchStat = function(item){
			if(!item) return message.error("请选择一条数据操作");
			item.stat = item.stat=='13900001' ? '13900002':'13900001';//设置启用状态的值
			var data = {
				map:item
			}
			that.loading.show();
			$.ajax({
				url: "market/proconfig/prodctrct/tmpl/switchStat",
				type: "POST",
				data: data,
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
					if ( !data.success ) {
						return message.error( data.msg );
					}
					message.success(data.msg);
					that.vars.gridVar.load();
				}
			} );
		}
		
	};
	
	return Global;
} );