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
			var that = this.global();
			that.selector.find( "#funGrid1 #addBtn" ).bind( "click", function( event ) {
				that.handlers.add();
			} );
			that.selector.find( "#funGrid1 #delBtn" ).bind( "click", function( event ) {
				var items = that.vars.grid1.selectedRows();
				that.handlers.del( items );
				return false;
			} );
			that.selector.find( "#funCloseBtn" ).bind('click',function (event){
				that.close();
				return false;
			});
			that.selector.find( ".input" ).input( {} );
			var config1 = {
				sort:false,
		        remote: {
		        	url: "market/proconfig/fun/getSelectedFun",
		            params: {"params[prodNo]":$("#prodNo").val()}
		        },
		        multi: true,
		        sort: false,
		        page: {
		        	pageSize: 10
		        },
		        query: {
		        	isExpand:true,
		        	target: that.selector.find( ".funGrid" )
		        },
		        plugins: [],
		        customEvents: []
			};
			config1.cols = cols = [];
			cols[ cols.length ] = { title: "资金渠道编号", name: "chanNo", width: "300px", lockWidth: false };
			cols[ cols.length ] = { title: "资金渠道名称", name: "chanName", width: "300px", lockWidth: false };
			cols[ cols.length ] = { title: "优先级", name: "setlPrior", width: "80px", lockWidth: true,align:'center' };
			cols[ cols.length ] = { title: "操作", name: "id", width: "120px", lockWidth: true,align:'center', renderer: function( val, item, rowIndex ) {
				return format( [ '<a href="javascript:;" class="toggle-up"><i class="fa fa-long-arrow-up"></i>上移</a>&nbsp;<a href="javascript:;" class="toggle-down"><i class="fa fa-long-arrow-down"></i>下移</a>' ] );
			} };
			config1.customEvents.push( 
					{
						target: ".toggle-up,.toggle-down",
						handler: function( event, item, rowIndex ) {
							that.handlers.moveUpOrDown(item,$(this));
							return false;
						}
					}
			);
			that.vars.grid1 = that.selector.find( "#funGrid1" ).grid( config1 );
		};
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.add = function (){
			var that = this.global();
			
			var prodStat = $("#prodStat").val();
			if(prodStat == '16500002'){
				return message.error( '产品销售中...禁止操作' );
			}
			
			that.modal.open( {
				title: "新增资金渠道",
				url: "market/proconfig/fun/addfun",
				size: "modal-lg",
				params: {},
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.grid1.load();
					}
				}
			} );
		};
		
		handlers.del = function( items ) {
			var prodStat = $("#prodStat").val();
			if(prodStat == '16500002'){
				return message.error( '产品销售中...禁止操作' );
			}
			
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
					url: "market/proconfig/fun/delete",
					type: "POST",
					data: { ids: ids, prodNo:$("#prodNo").val()},
					success: function( data ) {
						if ( !data.success ) {
							return message.error( data.msg );
						}
						message.success( data.msg );
						that.vars.grid1.load();
					}
				} );
			} );
		};
		
		handlers.moveUpOrDown = function(item,clickBtn){
			var prodStat = $("#prodStat").val();
			if(prodStat == '16500002'){
				return message.error( '产品销售中...禁止操作' );
			}
			
			var oper=clickBtn.hasClass('toggle-up')?"up":"down";
			var data = {
					map:item,
					params:{oper:oper}
			};
			that.loading.show();
			$.ajax( {
				url: "market/proconfig/fun/moveUpOrDown",
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
					that.vars.grid1.load();
				}
			} );
		};
	};
	
	return Global;
} );