define(function () { 
	function Global( vars ) {
		var $ = require( "jquery" )
			, base = require( "app/base" )
			, message = base.message
			, code = base.code
			, tools = base.tools;
		var moment = require( "moment" );
		
		code.cache( "Contract_Type,Is_No,Branch_Self_Typ,Elec_Sign_Type" );
		
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
			
			//隐藏右上角返回按钮
			$("#relctrctGrid").closest('div.section-container').next("button[class='section-close close']").hide();
			
			that.selector.find( "input[name=contractType]" ).select( {
				code: { type: "Contract_Type" }
			} );
			
			that.selector.find( "input[name=branchSelf]" ).select( {
				code: { type: "Branch_Self_Typ" }
			} );
			
			that.selector.find( "input[name=chanNo]" ).select( {//chanNo资金渠道
				multi: false,
				remote: {
					url: 'market/proconfig/ctrct/chanNoLst',
					params:{params:{
							"prodNo":$("#prodNo").val()
						}
					}
				}
			} );
			
			that.selector.find( "input[name=compNo]" ).select( {//第三方机构下拉
				multi: false,
				remote: {
					url: 'market/proconfig/relctrct/compNoLst',
					params:{params:{
							"prodNo":$("#prodNo").val()
						}
					}
				}
			} );
			
			that.selector.find( "input[name=stat]" ).select( {
				code: { type: "Is_No" }
			} );
			that.selector.find( ".input" ).input( {} );
			
			that.selector.find( "#addBtn" ).bind( "click", function( event ) {
				that.handlers.add();
				return false;
			} );
			
			that.selector.find("#editBtn").bind("click",function(event){
				var items = that.vars.gridVar.selectedRows();
				that.handlers.edit(items);
				return false;
			});
			
			that.selector.find("#tmplAddBtn").bind("click",function(){
				var items = that.vars.gridVar.selectedRows();
				that.handlers.tmplAdd(items);
				return false;
			});
			
			that.selector.find( "#delBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.del( items );
				return false;
			} );
			
			that.selector.find( "#funCloseBtn" ).bind('click',function (event){
				that.close();
				return false;
			});
			
			var config = {
		        remote: {
		        	url: "market/proconfig/relctrct/list",
		            params: {"params[prodNo]":$("#prodNo").val(),"params[mainCtrctNo]":that.params.item.contractNo}
		        },
		        multi: true,
		        page: {
		        	pageSize: 10
		        },
		        query: {
		        	isExpand:true,
		        	target: that.selector.find( ".relctrctGrid" )
		        },
		        plugins: [],
		        customEvents: []
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "合同编号", name: "contractNo", width: "100px", lockWidth: false };
			cols[ cols.length ] = { title: "合同名称", name: "contractName", width: "100px", lockWidth: false };
			cols[ cols.length ] = { title: "合同类型", name: "contractType", width: "80px", lockWidth: false, renderer: function( val, item, rowIndex ) {
				return code.getText("Contract_Type",val);
			} };
			cols[ cols.length ] = { title: "资金渠道", name: "chanName", width: "80px", lockWidth: false};
			cols[ cols.length ] = { title: "网点自营类型", name: "branchSelf", width: "80px", lockWidth: false, renderer: function( val, item, rowIndex ) {
				return code.getText("Branch_Self_Typ",val);
			} };
			cols[ cols.length ] = { title: "第三方机构号", name: "compName", width: "80px", lockWidth: false};
			cols[ cols.length ] = { title: "是否启用", name: "stat", width: "80px", lockWidth: false, renderer: function( val, item, rowIndex ) {
				return code.getText("Is_No",val);
			} };
			cols[ cols.length ] = { title: "电子签约类型", name: "elecSignType", width: "80px", lockWidth: false, renderer: function( val, item, rowIndex ) {
				return code.getText("Elec_Sign_Type",val);
			} };
			/*cols[ cols.length ] = { title: "主合同", name: "mainCtrctName", width: "100px", lockWidth: false };*/
			//cols[ cols.length ] = { title: "优先级", name: "contractLevel" };
			/*
			cols[ cols.length ] = { title: "操作", name: "id", width: "120px", lockWidth: false,align:'center', renderer: function( val, item, rowIndex ) {
				return format( [ '<a href="javascript:;" class="toggle-up"><i class="fa fa-long-arrow-up"></i>上移</a>&nbsp;<a href="javascript:;" class="toggle-down"><i class="fa fa-long-arrow-down"></i>下移</a>' ] );
			} };
			*/
			config.customEvents.push({
				target: ".toggle-up,.toggle-down",
				handler: function( event, item, rowIndex ) {
					that.handlers.moveUpOrDown(item,$(this));
					return false;
				}
			});
			that.vars.gridVar = that.selector.find( "#relctrctGrid" ).grid( config );
		};
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		//添加
		handlers.add = function (){
			var that = this.global();
			var prodStat = $("#prodStat").val();
			var item = {"prodNo":$( "#prodNo" ).val(),"mainCtrctNo":that.params.item.contractNo};
			that.modal.open({
				title: "关联合同|新增",
				url: "market/proconfig/relctrct/form",
				size: "modal-md",
				params: {item:item},
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.gridVar.load();
					}
				}
			} );
		};
		
		//编辑
		handlers.edit = function (items){
			var that = this.global();
			var prodStat = $("#prodStat").val();
			if(!items || items.length==0) return message.error( "请选择一条数据操作" );
			var item = items[0];
			that.modal.open({
				title: "关联合同|编辑",
				url: "market/proconfig/relctrct/form",
				size: "modal-md",
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
			that.dialog.confirm( "确定删除选择的[ " + items.length + " ]条数据？", function( event, index ) {
				if ( index == 1 ) return false;
				$.ajax( {
					url: "market/proconfig/relctrct/del",
					type: "POST",
					data: { ids: ids},
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
		
		//打开模板选择页面
		handlers.tmplAdd = function( items ) {
			var that = this.global();
			if(!items || items.length==0) return message.error( "请选择一条数据操作" );
			var item = items[0];
			that.modal.open({
				title: "合同|模板添加",
				url: "market/proconfig/prodctrct/tmpl/"+item.contractType+"/index",
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
		
		//上移下移
		handlers.moveUpOrDown = function(item,clickBtn){
			var prodStat = $("#prodStat").val();
			var oper=clickBtn.hasClass('toggle-up')?"up":"down";
			var data = {
				map:item,
				params:{oper:oper}
			};
			that.loading.show();
			$.ajax({
				url: "market/proconfig/relctrct/moveUpOrDown",
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
		
	};
	
	return Global;
} );