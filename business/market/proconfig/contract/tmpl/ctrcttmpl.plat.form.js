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
			this.load();
			this.layout();
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
			
			that.selector.find( "input[name=tmplType]" ).select( {
				code: { type: "Tmpl_Type" }
			} );
			
			that.selector.find( "input[name=contractType]" ).select( {
				code: { type: "Contract_Type" }
			} );
			
			that.selector.find( "input[name=contApplyType]" ).select( {
				code: { type: "Cont_Apply_Type" }
			} );
			
			that.selector.find( ".input" ).input( {} );//实例input插件
			
			that.selector.find( "#submitBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.save(items);
				return false;
			} );
			
			that.selector.find( "#closeBtn" ).click( function(event) {
				that.close();
				return false;
			});
			
			var config = {
		        remote: {
		        	url: "market/proconfig/prodctrct/tmpl/"+that.params.item.contractType+"/formList",
		            params: {
		            	"params[contractNo]":that.params.item.contractNo,
		            	"params[chanNo]":that.params.item.chanNo || '',
		            	"params[branchSelf]":that.params.item.branchSelf || '',
		            	"params[compNo]":that.params.item.compNo
		            }
		        },
		        multi: true,
		        page: {
		        	pageSize: 10
		        },
		        query: {
		        	isExpand:true,
		        	target: that.selector.find( ".usPlatTmplGrid" )
		        },
		        plugins: [],
		        customEvents: []
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: "模板", name: "fileName", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "模板名称", name: "fileAliasName", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "模板类型", name: "contractType", width: "100px", lockWidth: true ,renderer: function( val, item, rowIndex) {
				return base.code.getText(  "Contract_Type", val );
			} };
			cols[ cols.length ] = { title: "适用对象", name: "contApplyType", width: "100px", lockWidth: true ,renderer: function( val, item, rowIndex) {
				return base.code.getText(  "Cont_Apply_Type", val );
			} };
			cols[ cols.length ] = { title: "模板主题", name: "tmplType", width: "100px", lockWidth: true ,renderer: function( val, item, rowIndex) {
				return base.code.getText(  "Tmpl_Type", val );
			} };
			cols[ cols.length ] = { title: "合同总页码", name: "totalPage", width: "100px", lockWidth: true };
			that.vars.gridVar = that.selector.find( "#usPlatTmplGrid" ).grid( config );
			
		};
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		/** 加载数据*/
		handlers.load = function( item ) {
			var that = this.global();
			var contractType = that.params.item.contractType;
			contractType && that.selector.find( ":input[name=contractType]" ).valChange( contractType ); 
		};
		
		handlers.save = function (rows){
			var that = this.global();
			if(!rows || rows.length == 0) return message.error("请至少选择一条数据" );
			var items = [];
			for(var i = 0;i<rows.length;i++){
				var row = rows[i];
				var item = {
					"contractNo":that.params.item.contractNo,
					"templateNo":row.templateNo,
					"fileName":row.fileName,
					"tmplType":row.tmplType
					/*"chanNo":that.params.item.chanNo || '',
					"branchSelf":that.params.item.branchSelf || '',
					"contractType":that.params.item.contractType*/
				};
				items.push(item);
			}
			var data = { 
				list:items
			};
			that.loading.show();
			$.ajax( {
				url: "market/proconfig/prodctrct/tmpl/save",
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
					that.close(true);
				}
			} );
		}
	};
	
	return Global;
} );