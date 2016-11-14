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
		var moment = require( "moment" );
		
		
		//缓存码值
		code.cache( "Is_No" );
		
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
		
			
			that.selector.find( "#editBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.edit( items );
				return false;
			} );
			
			
			var config = {
				remote: {
		        	url: "register/sysadmin/list",
		        	params: {}
		        },
		        multi: false,
		        page: {
		        	pageSize: 5
		        },
		        query: {
		        	isExpand:true,
		        	target: that.selector.find( ".grid-query" )
		        },
		        plugins: [],
		        customEvents: []
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "电话", name: "phoneNo", width: "80px", lockWidth: true };
			cols[ cols.length ] = { title: "备注", name: "remark", width: "180px", lockWidth: true };
			cols[ cols.length ] = { title: "申请时间", name: "id", width: "90px", lockWidth: true, renderer: function( val, item, rowIndex ) {
				return format( [ ''+moment(item.applyDate).format("YYYY-MM-DD")+'' ] );
			} };
//			moment(item.updtDate).format("YYYY-MM-DD")
			
			that.vars.gridVar = that.selector.find( "#registerGrid" ).grid( config );//renderer
		};
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {
		};
		that.handlers.edit = function( items ) {
			if ( items.length != 1 ) {
				return message.error( "请选择一条操作数据。" );
			}
			var item = items[ 0 ]; //获取一条数据
			var that = this.global();
			that.page.open( {
				title: "管理员申请 | 详情",
				url: "register/sysadmin/form",
				size: "modal-lg",
				params: { item: item },
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.gridVar.load();
					}
				}
			} );
			
		};//end
		
	};
	return Global;
	
} );