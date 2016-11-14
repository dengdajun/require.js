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
		code.cache( "Is_No,Tmpl_Type,Contract_Type,Cont_Apply_Type" );
		
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
			that.selector.find( "input[name=contractType]" ).select( {//实例下拉插件
				code: { type: "Contract_Type" }
			} ); 
			that.selector.find( "input[name=tmplType]" ).select( {//实例下拉插件
				code: { type: "Tmpl_Type" }
			} );
			that.selector.find( "input[name=contApplyType]" ).select( {//实例下拉插件
				code: { type: "Cont_Apply_Type" }
			} );
			
			that.selector.find( ".input" ).input( {} );//实例input插件
			//新增
			that.selector.find( "#addBtn" ).bind( "click", function( event ) {
				that.handlers.add();
				return false;
			} );
			//编辑
			that.selector.find( "#editBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.edit( items );
				return false;
			} );
			//坐标管理
			that.selector.find( "#coordBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.coord( items );
				return false;
			} );
			//删除
			that.selector.find( "#delBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.del( items );
				return false;
			} );
			
			var config = {
				remote: {
		        	url: "contract/manage/list",
		        	params: {}
		        },
		        multi: true,
		        page: true,
		        query: {
		        	isExpand:true,
		        	target: that.selector.find( ".grid-query" )
		        },
		        plugins: [],
		        customEvents: []
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "模板", name: "fileName", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "模板名称", name: "fileAliasName", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "合同类型", name: "contractType", width: "100px", lockWidth: true ,renderer: function( val, item, rowIndex) {
				return base.code.getText(  "Contract_Type", val );
			} };
			cols[ cols.length ] = { title: "模板主题", name: "tmplType", width: "100px", lockWidth: true ,renderer: function( val, item, rowIndex) {
				return base.code.getText(  "Tmpl_Type", val );
			} };
			cols[ cols.length ] = { title: "适用对象", name: "contApplyType", width: "100px", lockWidth: true ,renderer: function( val, item, rowIndex) {
				return base.code.getText(  "Cont_Apply_Type", val );
			} };
			cols[ cols.length ] = { title: "适用客户端", name: "sourceType", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "适用资方渠道", name: "applyChan", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "合同总页码", name: "totalPage", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "是否启用", name: "stat", width: "80px", lockWidth: true ,renderer: function( val, item, rowIndex) {
				return base.code.getText(  "Is_No", val );
			} };
			
			that.vars.gridVar = that.selector.find( "#tmplGrid" ).grid( config );
		};
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {};
		
		//新增
		handlers.add = function(){
			var that = this.global();
			that.page.open( {
				title: "合同模板管理 | 新增",
				url: "contract/manage/form",
				size: "modal-lg",
				params: {},
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.gridVar.load();
					}
				}
			});
		}
		
		//编辑
		handlers.edit = function( items ) {
			if (!items || items.length != 1 ) {
				return message.error( "请选择一条操作数据。" );
			}
			var item = items[ 0 ]; //获取一条数据
			var that = this.global();
			that.page.open( {
				title: "合同模板管理 | 编辑",
				url: "contract/manage/form",
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
		
		//删除
		handlers.del = function(items){
			if(!items || items.length == 0){
				return message.error( "请至少选择一条操作数据。" );
			}
			var tmplNos = [];
			$.each( items, function( index, item ) {
				tmplNos.push( item.templateNo );
			} ); 
			that.dialog.confirm( "确定删除选择的[ " + items.length + " ]条操作数据？", function( event, index ) {
				if ( index == 1 ) return false;
				$.ajax( {
					url: "contract/manage/delete",
					type: "POST",
					data: { tmplNos: tmplNos },
					success: function( data ) {
						if ( !data.success ) {
							return message.error( data.msg );
						}
						message.success( data.msg );
						that.vars.gridVar.load();
					}
				} );
			});
		}
		
		//电子合同坐标管理
		handlers.coord = function(items){
			if (!items || items.length != 1 ) {
				return message.error( "请选择一条操作数据。" );
			}
			var item = items[ 0 ]; //获取一条数据
			var that = this.global();
			that.page.open( {
				title: "电子合同签名坐标管理",
				url: "contract/coord/index",
				size: "modal-lg",
				params: { item: item },
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.vars.gridVar.load();
					}
				}
			} );
		}
		
	};
	
	return Global;
} );