	define(function () { 

	function Global( vars ) {
		
		//=======================================================
		//获取基础组件
		//=======================================================
		var $ = require( "jquery" )
			, base = require( "app/base" )
			, message = base.message
			, tools = base.tools
			, code = base.code;
		
		
		//缓存码值
		code.cache( "stat,sex,certType,yon,Is_No,Acc_Type,Acct_Type,Repay_Channel" );
		
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
			
			that.selector.find( "input[name=fundType]" ).select( {//实例下拉插件
				code: { type: "Acc_Type" }
			} );
			
			that.selector.find( "input[name=stat]" ).select( {//实例下拉插件
				code: { type: "stat" }
			} );
			
			that.selector.find( "#addBtn" ).bind( "click", function( event ) {
				that.handlers.add();
			} );
			
			that.selector.find( "#editBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.edit( items );
				return false;
			} );
			
			that.selector.find( "#delBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.del( items );
				return false;
			} );
			that.selector.find( "#loginCount" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.loginCount( items );
				return false;
			} );
			
			that.selector.find( "#ctrcttmplBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.ctrcttmpl( items );
				return false;
			} );
			
			that.selector.find( "#addBtnFundBelong" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.addBtnFundBelong( items );
				return false;
			} );
			
			that.selector.find( "#editBtnFundBelong" ).bind( "click", function( event ) {
				var items = that.vars.fundBelonGrid.selectedRows();
				that.handlers.editBtnFundBelong( items );
				return false;
			} );
			
			that.selector.find( "#delBtnFundBelong" ).bind( "click", function( event ) {
				var items = that.vars.fundBelonGrid.selectedRows();
				that.handlers.delBtnFundBelong( items );
				return false;
			} );
			
			var config = {
				remote: {
		        	url: "operate/channel/fundChan/list",
		            params: {}
		        },
		        page: {
		        	pageSize: 5
		        },
		        multi: false,
		        page: true,
		        query: {
		        	isExpand:true,
		        	target: that.selector.find( ".grid-query" )
		        },
		        plugins: [],
		        customEvents: [],
		        events:{
		        	loaded: {
		        		handler: function( event, items ) {
		        			that.vars.gridVar.select( 0 );
		        			var item = items[ 0 ] || { typeCode: "$NO$" };
		        			that.vars.fundBelonGrid.load({"params[chanNo]": item.chanNo});
		        		}
		        	},
		        	click: {
		        		 handler: function (event, items, rowIndex) {
		        			 that.vars.fundBelonGrid.load({"params[chanNo]":items[0].chanNo});
		        		 }
		        	}
		        }
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "渠道编码", name: "chanNo", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "渠道名称", name: "chanName", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "资方名称", name: "fundName", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "资方类型", name: "fundType", width: "250px", lockWidth: true,renderer:function(val,item,rowIndex){
				return base.code.getText("Acc_Type",val);
			}};
			cols[ cols.length ] = { title: "日放款量(元)", name: "dayLoanAmt", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "前置验证", name: "checkFlag", width: "100px", lockWidth: true ,align:'center',
					renderer:function(val,item,rowIndex){return base.code.getText("Is_No",val);}};
			cols[ cols.length ] = { title: "是否分账", name: "checkAccFlag", width: "100px", lockWidth: true,align:'center',
					renderer:function(val,item,rowIndex){return base.code.getText("Is_No",val);}};
			cols[ cols.length ] = { title: "是否启用", name: "isUse", width: "100px", lockWidth: true,align:'center',
					renderer:function(val,item,rowIndex){return base.code.getText("Is_No",val);}};
			cols[ cols.length ] = { title: "资方地址", name: "fundAddr", width: "250px", lockWidth: true };
			cols[ cols.length ] = { title: "操作", name: "id", width: "80px", lockWidth: true,align:'center', renderer: function( val, item, rowIndex ) {
				var claName = item.isUse=="13900001"?"失效":"启用";
				//var cla = item.isUse=="13900001"?"on":"off";
				return format( [ '<a href="javascript:;" class="pro-toggle"><i class="fa fa-retweet"></i>'+claName+'</a>' ] )
			} };
			
			config.events.click = {
				handler: function( event, item, rowIndex ) {
					that.vars.fundBelonGrid.load({"params[chanNo]":item[0].chanNo});
				}
			};
			
			config.customEvents.push( {
				target: ".pro-toggle",
				handler: function( event, item, rowIndex ) {
					that.handlers.toggle(item,event.currentTarget.text);
					return false;
				}
			} );
			
			that.vars.gridVar = that.selector.find( "#fundchannelGrid" ).grid( config );//renderer
			
			/**
			 * 还款账户grid
			 */
			var fundBelongConfig = {
				remote: {
		        	url: "operate/channel/fundbelong/list",
		        	params: {}
		        },
		        multi: true,
		        autoLoad:false,
		        page: true,
		        page: {
		        	pageSize: 5
		        }
			};
			fundBelongConfig.cols = cols = [];
			cols[ cols.length ] = { title: "账户归属", name: "acctBelong", width: "80px", lockWidth: true ,
					renderer:function(val,item,rowIndex){return base.code.getText("Acc_Type",val);}};
			cols[ cols.length ] = { title: "还款渠道", name: "repayChan", width: "80px", lockWidth: true ,
					renderer:function(val,item,rowIndex){return base.code.getText("Repay_Channel",val);}};
			cols[ cols.length ] = { title: "账户类型", name: "acctType", width: "80px", lockWidth: true ,
					renderer:function(val,item,rowIndex){return base.code.getText("Acct_Type",val);}};
			cols[ cols.length ] = { title: "商户号", name: "marNo", width: "200px", lockWidth: true, mouseover:true };
			cols[ cols.length ] = { title: "账户", name: "acctNo", width: "200px", lockWidth: true, mouseover:true };
			cols[ cols.length ] = { title: "账户名称", name: "acctName", width: "200px", lockWidth: true, mouseover:true };
			
			cols[ cols.length ] = { title: "开户机构", name: "acctOrg", width: "200px", lockWidth: true, mouseover:true,
					renderer:function(val,item,rowIndex){return base.code.getText("Open_Org",val);}};
			
			cols[ cols.length ] = { title: "结算周期", name: "settCyc", mouseover:true,
					renderer:function(val,item,rowIndex){return base.code.getText("SETT_CYC",val);}};
			
			that.vars.fundBelonGrid = that.selector.find( "#fundBelong" ).grid( fundBelongConfig );
		};
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {};
		
		handlers.add = function(  ) {
			var that = this.global();
			that.page.open( {
				title: "资金渠道管理 | 新增",
				url: "operate/channel/fundChan/form",
				size: "modal-lg",
				params: {},
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.gridVar.load();
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
				title: "资金渠道管理 | 编辑",
				url: "operate/channel/fundChan/form",
				size: "modal-lg",
				params: { item: item },
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.gridVar.load();
					}
				}
			} );
			
		};
		
		
		handlers.del = function( items ) {
			if ( items == null || items.length == 0 ) {
				return message.error( "请选择至少一条操作数据。" );
			}
			
			var ids = [];
			$.each( items, function( index, item ) {
				ids.push( item.id );
			} ); 
			
			that.dialog.confirm( "确定删除选择的[ " + items.length + " ]条操作数据？", function( event, index ) {
				if ( index == 1 ) return false;
				$.ajax( {
					url: "operate/channel/fundChan/del",
					type: "POST",
					data: { ids: ids },
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
		
		/**
		 * 登陆账号管理
		 */
		handlers.loginCount = function ( items ){
			if ( items == null || items.length == 0 ) {
				return message.error( "请选择至少一条操作数据。" );
			}
			if ( items.length != 1 ) {
				return message.error( "请选择一条操作数据。" );
			}
			
			var item = items[ 0 ]; //获取一条数据
			
			var that = this.global();
			that.modal.open( {
				title: "资金渠道管理 | 登陆账号管理",
				url: "operate/channel/fundChan/loginUserForm",
				size: "modal-lg",
				params: { item: item },
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.gridVar.load();
					}
				}
			} );
		};
		
		/**
		 * 状态修改
		 */
		handlers.toggle = function( item,text ) {
			var that = this.global();
			that.dialog.confirm( "确定"+text+"?", function( event, index ) {
				if ( index == 1 ) return false;
				that.loading.show();
				$.ajax( {
					url: "operate/channel/fundChan/updateFundCanlStatus",
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
						that.vars.gridVar.load();
					}
				} );
			} );
		};
		
		/**
		 * 添加还款账户信息
		 */
		handlers.addBtnFundBelong = function ( items ){
			var that = this.global();
			if ( items == null || items.length == 0 ) {
				return message.error( "请选择一个资金渠道。" );
			}
			var item = items[ 0 ]; //获取一条数据
			item.id="";
			that.modal.open( {
				title: "资金渠道管理 | 添加还款账户信息",
				url: "operate/channel/fundbelong/form",
				size: "modal-lg",
				params: { item: item },
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.fundBelonGrid.load();
					}
				}
			} );
		};//end
		
		/**
		 * 编辑资金渠道归属
		 */
		handlers.editBtnFundBelong = function ( items ){
			var that = this.global();
			if ( items == null || items.length == 0 ) {
				return message.error( "请选择一条数据。" );
			}
			if(items.length>1){
				return message.error( "请选择一条数据。");
			}
			var item = items[ 0 ]; //获取一条数据
			that.modal.open( {
				title: "资金渠道管理 | 编辑资金归属",
				url: "operate/channel/fundbelong/form",
				size: "modal-lg",
				params: { item: item },
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.fundBelonGrid.load();
					}
				}
			} );
		};//end
		
		/**
		 * 资金渠道归属删除
		 */
		handlers.delBtnFundBelong = function( items ) {
			if ( items == null || items.length == 0 ) {
				return message.error( "请选择至少一条操作数据。" );
			}
			
			var ids = [];
			$.each( items, function( index, item ) {
				ids.push( item.id );
			} ); 
			
			that.dialog.confirm( "确定删除选择的[ " + items.length + " ]条操作数据？", function( event, index ) {
				if ( index == 1 ) return false;
				$.ajax( {
					url: "operate/channel/fundbelong/del",
					type: "POST",
					data: { ids: ids },
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
		
		//合同模板配置
		handlers.ctrcttmpl = function(items){
			if(!items || items.length != 1) return message.error( "请选择一条数据。" );
			var item = items[ 0 ]; //获取一条数据
			that.page.open( {
				title: "资金渠道管理 | 已选合同模板",
				url: "fundchan/ctrcttmpl/manage/index",
				size: "modal-lg",
				params: { item: item },
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.fundBelonGrid.load();
					}
				}
			} );
		
		}
		
	};
	
	
	return Global;
	
} );