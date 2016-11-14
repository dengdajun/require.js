define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools
			, log = base.log
			, code = base.code;
		    
		//code.cache( "Is_No" );
		var moment = require( "moment" );
		
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
		};
		
		//初始化远程请求处理
		that.load = function() {
			var that = this.global();			
		};
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			
			//that.selector.find( ".input" ).input( {} );//实例input插件				
			that.vars.fileUpload = that.selector.find( "input[name=file]" ).fileUpload({
				accept: ".xls,.xlsx",
				filename: "合同签收表格",
				url:"contract/sign/importdata",
				upload: true,
				download: false,
				style:"margin-left: auto; margin-right: auto; float:none; width:220px",
				remove: true,
				events: {
					uploadAdd: {
						data: {},
						handler: function( event, file ) {							
						     var extension=file.extension;
						     if(extension !="xls" && extension !="xlsx")
						    	{
						    	   message.error("选择文件格式不正确，请选择excel");
						    	   file.remove();
						    	   return false;
						    	}
							var data={};
							that.vars.fileUpload.upload(data);													
						}
					},
					uploadError: {
						data: {},
						handler: function( event, file, data ) {
							file.remove();
						}
					},
					uploadSuccess: {
						data: {},
						handler: function( event, file, data ) {							
							file.echo( {
								filename: file.filename,
								extension: file.extension
							});
							that.close( data );
						}
					},
					remove:  {
						data: {},
						handler: function( event, file, item ) {
							//file.remove();
						}
					},
				}
			});			
		};
		//=======================================================
		// 业务逻辑申明
		//=======================================================

	};
	
	return Global;
});