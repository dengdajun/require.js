define(function () { 
	
	function Global( vars ) {
		
		//=======================================================
		//获取基础组件
		//=======================================================
		var $ = require( "jquery" )
			, base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
		base.code.cache( "Is_No" );
		
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
			
			that.selector.find( "#feeconfGrid #addBtn" ).bind( "click", function( event ) {
				that.handlers.add();
			} );
			that.selector.find( "#feeconfGrid #editBtn" ).bind( "click", function( event ) {
				var items = that.vars.feeconfGrid.selectedRows();
				that.handlers.edit( items );
				return false;
			} );
			that.selector.find( "#feeconfGrid #delBtn" ).bind( "click", function( event ) {
				var items = that.vars.feeconfGrid.selectedRows();
				that.handlers.del( items );
				return false;
			} );
			
			var feeconfGridConfig = {
				remote: {
		        	url: "nucleus/bizconfig/feeconf/list",
		            params: {}
		        },
		        multi: false,
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
			feeconfGridConfig.cols = cols = [];
			cols[ cols.length ] = { title: "费用编号", name: "feeNo", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "费用名称", name: "feeName", width: "200px", lockWidth: true };
			cols[ cols.length ] = { title: "值类型", name: "feeValTyp", width: "60px", lockWidth: true,
									renderer: function( val, item, rowIndex ) {return base.code.getText( "First_Pay_Type", val );}
			};
			cols[ cols.length ] = { title: "增值项", name: "feeTyp", width: "60px", lockWidth: true,
									renderer: function( val, item, rowIndex ) {return base.code.getText( "Is_No", val );}
			};
			cols[ cols.length ] = { title: "启用", name: "validFlag", width: "60px", lockWidth: true,
									renderer: function( val, item, rowIndex ) {return base.code.getText( "Is_No", val );}		
			};
			cols[ cols.length ] = { title: "备注", name: "feeRemark", width: "350px", lockWidth: true, mouseover:true};
			cols[ cols.length ] = { title: "操作", name: "id", width: "120px", lockWidth: true, renderer: function( val, item, rowIndex ) {
				var claName = item.validFlag=="13900001"?"失效":"启用";
				//var cla = item.validFlag=="13900001"?"on":"off";
				if(item.ruleId){
					return format( [ '<a href="javascript:;" class="pro-toggle"><i class="fa fa-retweet"></i>'+claName+'</a>&nbsp;<a href="javascript:;" class="open-calc"><i class="fa fa-calculator"></i> 试算</a>' ] );
				}else{
					return format( [ '<a href="javascript:;" class="pro-toggle"><i class="fa fa-retweet"></i>'+claName+'</a>' ] )
				}
			} };
			
			//自定义事件
			feeconfGridConfig.customEvents.push( 
					{
						target: ".pro-toggle",
						handler: function( event, item, rowIndex ) {
							that.handlers.toggle(item,event.currentTarget.text);
							return false;
						}
					},
					{
						target: ".open-calc", //目标 选择器
						//data: "" //参数
						handler: function( event, item, rowIndex ) {
							//event.data 获取参数
							that.handlers.calc( item );
							return false;
						}
					} 
			);
			that.vars.feeconfGrid = that.selector.find( "#feeconfGrid" ).grid( feeconfGridConfig );
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		
		handlers.add = function(  ) {
			var that = this.global();
			that.page.open( {
				title: "费用项 | 新增",
				url: "nucleus/bizconfig/feeconf/form",
				size: "modal-lg",
				params: {},
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.feeconfGrid.load();
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
				title: "费用项 | 编辑",
				url: "nucleus/bizconfig/feeconf/form",
				size: "modal-lg",
				params: { item: item },
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.feeconfGrid.load();
					}
				}
			} );
		};
		
		handlers.del = function( items ) {
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
					url: "nucleus/bizconfig/feeconf/delete",
					type: "POST",
					data: { ids: ids },
					success: function( data ) {
						if ( !data.success ) {
							return message.error( data.msg );
						}
						message.success( data.msg );
						that.vars.feeconfGrid.load();
					}
				} );
			} );
		};
		
		handlers.toggle = function( item,text ) {
			var that = this.global();
			that.dialog.confirm( "确定进行"+text+"操作?", function( event, index ) {
				if ( index == 1 ) return false;
				that.loading.show();
				$.ajax( {
					url: "nucleus/bizconfig/feeconf/updateStat",
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
						that.vars.feeconfGrid.load();
					}
				} );
			} );
		}
		
		handlers.calc = function( item ) {
			var that = this.global();
			
			that.modal.open( {
				title: "费用项计算",
				url: "nucleus/bizconfig/feeconf/calc",
				size: "modal-xs",
				params: {
					item: item
				},
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.feeconfGrid.load();
					}
				}
			} );
		}
	};
	return Global;
} );