define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
		var moment = require( "moment" );
		base.code.cache( "yon" );
		
		//=======================================================
		// 当前组件
		//=======================================================
		var that = this; //全局对象
		var vars = this.vars = {};//全局变梁
		var handlers = this.handlers = {};//处理程序
		handlers.global = function() { return that; };

		//组件入口函数  相当于java.main
		that.init = function() {
			this.loadInput();
			this.load();
			this.layout();
			this.valdiate();
		};
		
		//初始化远程请求处理
		that.load = function() {

		};
		that.loadInput = function (){

		};
		
		//验证组件
		that.valdiate = function() {
			var that = this.global();
			that.vars.validator = that.selector.find( "form" ).validate( {
				rules: {
					branchNo: {required:true},
					signContr: {required:true}
				}
			} );

		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
    	    var custNo = that.params.item;
			$("#custNo").val(custNo);
			that.selector.find("#addButt").bind("click", function(event){
    			that.handlers.save();
    		});
		};
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		handlers.save = function() {
			var that = this.global();
			var branchNo = $("#branchNo").val(); ;
			
			that.dialog.confirm("网点编码设为:"+ branchNo, function(event,index) {
				if(index == 0){
					if ( !that.params.item ) return;
					var data = that.selector.find( "form" ).serialize();
					//验证
					var data = data +"&id="+that.params.item.id+"&remark="+that.params.item.remark;
					that.loading.show();
					$.ajax( {
						url: "branch/appro/saveBranch",
						type: "POST",
						data: data,
						complete: function() {
							that.loading.hide();
						},
						success: function( data ) {
		                        that.loading.hide();
		                        message.success("该商户认证成功");
		                        that.close( data );
						}
					} );
					
				}
			});
			
		};
	};
	
	return Global;
});