define(function () { 
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
		base.code.cache( "Is_No,Tmpl_Type,Branch_Self_Typ" );
		//=======================================================
		// 当前组件
		//=======================================================
		var that = this; //全局对象
		var vars = this.vars = {};//全局变梁
		var handlers = this.handlers = {};//处理程序
		handlers.global = function() { return that; };
		
		//组件入口函数  相当于java.main
		that.init = function() {
			this.layout();
			this.load();
			this.valdiate();
		};
		
		//初始化远程请求处理
		that.load = function() {
			var that = this.global();
			if ( !that.params.item ) return;
			that.handlers.load( that.params.item );
		};
		
		//验证组件
		that.valdiate = function() {
			var that = this.global();
			//jquery-validate 验证form表单元素
			that.vars.validator = that.selector.find( "form" ).validate( {
				rules: {
					branchSelf: {required:true}
				}
			} );
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			
			//保存事件
			that.selector.find( "#submitBtn" ).click( function(event) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.save(items);
				return false;
			});
			
			//关闭事件
			that.selector.find( "#closeBtn" ).click( function(event) {
				that.close();
				return false;
			});
			
			that.selector.find( "input[name=branchSelf]" ).select( {
				code: { type: "Branch_Self_Typ" }
			} );
			
			that.selector.find( "input[name=tmplType]" ).select( {
				code: { type: "Tmpl_Type" }
			} );
			
			that.selector.find( ".input" ).input( {} );//实例input插件
			
			var config = {
					remote: {
			        	url: "bizchan/ctrcttmpl/conf/formList",
			        	params: {}
			        },
			        multi: true,
			        page: false,
			        query: {
			        	isExpand:true,
			        	target: that.selector.find( ".grid-query")
			        },
			        plugins: [],
			        events: {
			        	loaded:{
			        		handler: function( event, items ) {
			        			if(!items || items.length==0) return;
			        			for(var i = 0 ; i<items.length; i++){
			        				var checked = items.checked;
			        				if('1'==checked) that.vars.gridVar.select(i);
			        			}
			        		}
			        	},
			        	click: {
			        		 handler: function (event, items, rowIndex) {
			        		 }
			        	}
			        },
			        customEvents: []
				};
				config.cols = cols = [];
				cols[ cols.length ] = { title: "模板", name: "fileName", width: "80px", lockWidth: true};
				cols[ cols.length ] = { title: "模板名称", name: "fileAliasName", width: "80px", lockWidth: true};
				cols[ cols.length ] = { title: "模板主题", name: "tmplType",width:"80px", lockWidth: true,renderer : function (val, item, rowIndex){
					return base.code.getText("Tmpl_Type",val);
				}};
				
				config.customEvents.push( {
					target: ".pro-toggle",
					handler: function( event, item, rowIndex ) {
						
						return false;
					}
				} );
				that.vars.gridVar = that.selector.find( "#formTmplGrid" ).grid( config );//renderer
		};
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		/** 加载数据*/
		handlers.load = function( item ) {
			var that = this.global();
			
		};
		/** 保存*/
		handlers.save = function(items) {
			var that = this.global();
			if ( !that.vars.validator.form() ) return;
			if(!items || items.length==0) return message.error( "请至少选择一个模板" );
			var list = [];
			for(var i=0 ; i<items.length ; i++){
				var item = items[i];
				var rs = {
					"contractType":item.contractType,
					"branchSelf":that.selector.find( "input[name = branchSelf]" ).val(),
					"templateNo":item.templateNo,
					"fileName":item.fileName,
					"tmplType":item.tmplType
				};
				list.push(rs);
			}
			var data={
				"list":list
			};
			that.loading.show(); 
			$.ajax( {
				url: "bizchan/ctrcttmpl/conf/save",
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
					that.close( data );
				}
			} );
		};
		
	};
	return Global;
});