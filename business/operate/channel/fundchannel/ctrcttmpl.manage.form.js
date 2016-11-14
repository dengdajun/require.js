define(function () { 
	function Global( vars ) {
		var $ = require( "jquery" )
			, base = require( "app/base" )
			, message = base.message
			, code = base.code
			, tools = base.tools;
		var moment = require( "moment" );
		
		code.cache( "Is_No,Tmpl_Type" );
		
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
			var that = this.global();//获取组件的全局对象
			
			that.selector.find( "input[name=tmplType]" ).select( {
				code: { type: "Tmpl_Type" }
			} );
			
			that.selector.find( ".input" ).input( {} );//实例input插件
			that.selector.find( "#submitBtn" ).bind( "click", function( event ) {
				that.handlers.save();
				return false;
			} );
			that.selector.find( "#closeBtn" ).click( function(event) {
				that.close();
				return false;
			});
			
			var config = {
				sort:false,
		        remote: {
		        	url: "fundchan/ctrcttmpl/manage/formList",
		            params: {"params[chanNo]":that.params.item.chanNo}
		        },
		        multi: true,
		        sort: false,
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
			config.cols = cols = [];
			cols[ cols.length ] = { title: "模板", name: "fileName", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "模板名称", name: "fileAliasName", width: "100px", lockWidth: true };
			cols[ cols.length ] = { title: "模板主题", name: "tmplType", width: "100px", lockWidth: true ,renderer: function( val, item, rowIndex) {
				return base.code.getText(  "Tmpl_Type", val );
			} };
			cols[ cols.length ] = { title: "合同总页码", name: "totalPage", width: "100px", lockWidth: true };
			that.vars.grid = that.selector.find( "#addContractGrid" ).grid( config );
			
		};
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.save = function (){
			var that = this.global();
			var rows = that.vars.grid.selectedRows();
			var ctmpls = [];
			for(var i = 0;i<rows.length;i++){
				var row = rows[i];
				var item = {};
				item.contractType=row.contractType;
				item.chanNo = that.params.item.chanNo;
				item.templateNo = row.templateNo;
				item.fileName = row.fileName;
				item.tmplType=row.tmplType;
				ctmpls.push(item);
			}
			var data = { list:ctmpls };
			that.loading.show();
			$.ajax( {
				url: "fundchan/ctrcttmpl/manage/save",
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
					that.close(1);
				}
			} );
		}
	};
	
	return Global;
} );