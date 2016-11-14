define(function () { 
	
	function Global( vars ) {
		
		//=======================================================
		//获取基础组件
		//=======================================================
		var $ = require( "jquery" )
			, base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
		var moment = require( "moment" );
		base.code.cache( "Is_No","Aprov_Result" );
		
		//=======================================================
		//当前组件
		//=======================================================
		var that = this;
		var vars = that.vars = $.extend( true, {}, vars );//全局变梁
		var handlers = that.handlers = {};//处理程序
		handlers.global = function() { return that; };
		
		//组件入口函数  相当于java.main
		that.init = function() {
			this.layout(); 
		};
		
		//初始化远程请求处理
		that.load = function() {};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			
			that.selector.find( ".input" ).input( {} );//实例input插件
			that.selector.find( "input[name=isSucceed]" ).select( {//实例下拉插件
				code: { type: "Is_No" }
			} );
			that.selector.find( "#orderImpBtn" ).bind( "click", function( event ) {
				var items = that.vars.orderedGrid.selectedRows();
				that.handlers.orderImp(items);
				return false;
			} );
			
			var orderedGridConfig = {
				remote: {
		        	url: "jiufu/loanWorkImport/orderedList",
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
		        customEvents: []
			};
			orderedGridConfig.cols = cols = [];
			cols[ cols.length ] = { title: "贷款编号", name: "loanNo", width: "200px", lockWidth: true,align:'center' };
			cols[ cols.length ] = { title: "是否导入成功", name: "isSucceed", width: "100px", lockWidth: true,align:'center',
					renderer: function( val, item, rowIndex ) {return base.code.getText( "Is_No", val );}
			};
			cols[ cols.length ] = { title: "失败信息", name: "errorMsg", width: "450px", lockWidth: true, align:'center',mouseover:true };
			cols[ cols.length ] = { title: "导入时间", name: "instDate", width: "160px", lockWidth: true , style:"text-align: center",
					renderer:function(val,item,rowIndex){return item.instDate && moment(item.instDate).format("YYYY-MM-DD HH:mm:ss")}
			};
			cols[ cols.length ] = { title: "导入者", name: "instUserNo", width: "120px", lockWidth: true,align:'center' };	
			cols[ cols.length ] = { title: "更新时间", name: "updtDate", width: "160px", lockWidth: true , style:"text-align: center",
					renderer:function(val,item,rowIndex){return item.updtDate && moment(item.updtDate).format("YYYY-MM-DD HH:mm:ss")}
			};
			cols[ cols.length ] = { title: "渠道号", name: "chanNo", width: "80px", lockWidth: true,align:'center' };		
			cols[ cols.length ] = { title: "渠道名称", name: "chanName", width: "200px", lockWidth: true,align:'center' };		
			cols[ cols.length ] = { title: "审批结果", name: "stat", width: "80px", lockWidth: true,align:'center',
					renderer: function( val, item, rowIndex ) {return base.code.getText( "Aprov_Result", val );}
			};
			
			that.vars.orderedGrid = that.selector.find( "#orderedGrid" ).grid( orderedGridConfig );
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		
		//工单导入事件
		handlers.orderImp = function(items) {
			var that = this.global();
			if ( items == null || items.length == 0 ) {
				return message.error( "请选择一条工单导入记录。" );
			}
			var loanNos = [];
			$.each( items, function( index, item ) {
				loanNos.push( item.loanNo );
			} );
			that.dialog.confirm( "确定导入选择的[ " + items.length + " ]条工单数据？", function( event, index ) {
				if ( index == 1 ) return false;
				that.loading.show();
				$.ajax( {
					url: "jiufu/loanWorkImport/insertList",
					type: "POST",
					data: { loanNos: loanNos },
					complete: function() {
						that.loading.hide();
					},
					success: function( data ) {
						console.log(data);
						if (!data.map.result){
							that.vars.orderedGrid.load();
							return message.error( data.msg );
						}
						message.success( data.msg);
						that.vars.orderedGrid.load();
					}
				} );
			} );
		}
		
		
	};
	return Global;
} );