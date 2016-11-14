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
		code.cache( "Is_No,Tmpl_Type" );
		
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
			this.load();
		};
		
		//初始化远程请求处理
		that.load = function() {
			var that = this.global();
			if ( !that.params.item ) return;
			that.handlers.load( that.params.item );
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			that.selector.find( "input[name=tmplType]" ).select( {//实例下拉插件
				code: { type: "Tmpl_Type" }
			} );
			that.selector.find( ".input" ).input( {} );//实例input插件
			
			that.selector.find( "#addBtn" ).bind( "click", function( event ) {
				that.handlers.add();
			} );
			that.selector.find( "#delBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.del( items );
				return false;
			} );
			
			var config = {
				remote: {
		        	url: "fundchan/ctrcttmpl/manage/list",
		            params: {
		            	"params[chanNo]":that.params.item.chanNo,
		            	"params[contractType]":"26800002"
		            }
		        },
		        page: true,
		        multi: true,
		        page: true,
		        query: {
		        	target: that.selector.find( ".grid-query" )
		        },
		        plugins: [],
		        customEvents: [],
		        events:{ }
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "渠道编码", name: "chanNo", width: "80px", lockWidth: true };
			cols[ cols.length ] = { title: "渠道名称", name: "chanNo", width: "100px", lockWidth: true,renderer:function(val,item,rowIndex){
				return that.params.item.chanName;
			}};
			cols[ cols.length ] = { title: "模板", name: "fileName", width: "80px", lockWidth: true };
			cols[ cols.length ] = { title: "模板主题", name: "tmplType", width: "250px", lockWidth: true, renderer:function(val,item,rowIndex){
				return base.code.getText("Tmpl_Type",val);
			} };
			that.vars.gridVar = that.selector.find( "#ctrctGrid" ).grid( config );//renderer
			
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( item ) { };
		
		//选择添加模板
		handlers.add = function() {
			var that = this.global();
			var item = {chanNo:that.params.item.chanNo};
			that.modal.open( {
				title: "模板选择 | 新增",
				url: "fundchan/ctrcttmpl/manage/form",
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
					url: "fundchan/ctrcttmpl/manage/del",
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
		
	};
	
	return Global;
} );