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
		base.code.cache("Is_No,Cust_Type,Prod_Type,Prod_State");
		
		//=======================================================
		//当前组件
		//=======================================================
		var that = this;
		var vars = that.vars = $.extend( true, {}, vars );
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
			//input
			that.selector.find( "input[name=prodTyp]" ).select( {
				code: { type: "Prod_Type" }
			} );
			that.selector.find( "input[name=prodStat]" ).select( {
				code: { type: "Prod_State" }
			} );
			that.selector.find( "input[name=startDate]" ).datetimepicker( {
				//maxDate: moment(that.vars.nowDate).format("YYYY-MM-DD")
			} );
			that.selector.find( "input[name=endDate]" ).datetimepicker( {
				//maxDate: moment(that.vars.nowDate).format("YYYY-MM-DD")
			} );
			that.selector.find( ".input" ).input( {} );
			//btn
			that.selector.find( "#proGrid #addBtn" ).bind( "click", function( event ) {
				that.handlers.add();
			} );
			that.selector.find( "#proGrid #editBtn" ).bind( "click", function( event ) {
				var items = that.vars.proGrid.selectedRows();
				that.handlers.edit( items );
				return false;
			} );
			that.selector.find( "#proGrid #delBtn" ).bind( "click", function( event ) {
				var items = that.vars.proGrid.selectedRows();
				that.handlers.del( items );
				return false;
			} );
			
			var proGridConfig = {
				remote: {
		        	url: "market/proconfig/prod/list",
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
			proGridConfig.cols = cols = [];
			cols[ cols.length ] = { title: "编号", name: "prodNo", width: "150px", lockWidth: true };
			cols[ cols.length ] = { title: "名称", name: "prodName", width: "200px", lockWidth: true };
			cols[ cols.length ] = { title: "开始时间", name: "startDate", width: "100px", lockWidth: true,align:'center',
					renderer: function( val, item, rowIndex ) {return moment(val).format("YYYY-MM-DD");}
			};
			cols[ cols.length ] = { title: "结束时间", name: "endDate", width: "100px", lockWidth: true,align:'center',
					renderer: function( val, item, rowIndex ) {return moment(val).format("YYYY-MM-DD");}
			};
			cols[ cols.length ] = { title: "状态", name: "prodStat", width: "60px", lockWidth: true,align:'center',
					renderer: function( val, item, rowIndex ) {return base.code.getText( "Prod_State", val );}
			};
			cols[ cols.length ] = { title: "产品说明", name: "prodRemark", mouseover:true };
			cols[ cols.length ] = { title: "操作", name: "id", width: "120px", lockWidth: true,align:'center', renderer: function( val, item, rowIndex ) {
				var claName = item.prodStat=="16500002"?"下架":"上架";
				//var cla = item.prodStat=="16500002"?"on":"off";
				return format( [ '<a href="javascript:;" class="pro-toggle"><i class="fa fa-arrows-v"></i>'+claName+'</a>&nbsp;&nbsp;<a href="javascript:;" class="pro-calc"><i class="fa fa-calculator"></i>试算</a>' ] );
			} };
			
			proGridConfig.customEvents.push( 
					{
						target: ".pro-toggle",
						//data: "" //参数
						handler: function( event, item, rowIndex ) {
							//event.data 获取参数
							that.handlers.toggle(item,event.currentTarget.text);
							return false;
						}
					},
					{
						target: ".pro-calc",
						handler: function( event, item, rowIndex ) {
							that.handlers.calc(item);
							return false;
						}
					}
					);
			that.vars.proGrid = that.selector.find( "#proGrid" ).grid( proGridConfig );
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		
		handlers.add = function(  ) {
			var that = this.global();
			that.page.open( {
				//title: "产品 | 新增",
				url: "market/proconfig/prod/form",
				size: "modal-lg",
				params: {},
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.proGrid.load();
					}
				}
			} );
		};
		
		handlers.edit = function( items ) {
			if ( items.length != 1 ) {
				return message.error( "请选择一条操作数据。" );
			}
			var item = items[ 0 ]; //获取一条数据
			var that = this.global();
			that.page.open( {
				//title: "产品 | 编辑",
				url: "market/proconfig/prod/form",
				size: "modal-lg",
				params: { item: item },
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.proGrid.load();
					}
				}
			} );
		};
		
		handlers.del = function( items ) {
			var that = this.global();
			if ( items == null || items.length == 0 ) {
				return message.error( "请选择一条操作数据。" );
			}
			var ids = [];
			var nos = [];
			$.each( items, function( index, item ) {
				ids.push( item.id );
				nos.push( item.prodNo );
			} );
			that.dialog.confirm( "确定删除选择的[ " + items.length + " ]条数据？", function( event, index ) {
				if ( index == 1 ) return false;
				that.loading.show();
				$.ajax( {
					url: "market/proconfig/prod/delete",
					type: "POST",
					data: { ids: ids ,nos: nos},
					complete: function() {
						that.loading.hide();
					},
					success: function( data ) {
						if ( !data.success ) {
							return message.error( data.msg );
						}
						message.success( data.msg );
						that.vars.proGrid.load();
					}
				} );
			} );
		};
		
		handlers.toggle = function( item,text ) {
			var that = this.global();
			that.dialog.confirm( "确定"+text+"?", function( event, index ) {
				if ( index == 1 ) return false;
				that.loading.show();
				$.ajax( {
					url: "market/proconfig/prod/updateStat",
					type: "POST",
					contentType:"application/json",
					data: JSON.stringify(item),
					complete: function() {
						that.loading.hide();
					},
					success: function( data ) {
						if ( !data.success ) {
							return message.error( data.msg );
						}
						message.success( data.msg );
						that.vars.proGrid.load();
					}
				} );
			} );
		}
		handlers.calc = function( item ) {
			var that = this.global();
			
			that.modal.open( {
				title: "产品试算",
				url: "market/proconfig/prod/calc",
				size: "modal-lg",
				params: {
					item: item
				},
				events: {
					hiden: function( closed, data ) {
						//if ( !closed ) return;
						//that.vars.feeconfGrid.load();
					}
				}
			} );
		}
	};
	return Global;
} );