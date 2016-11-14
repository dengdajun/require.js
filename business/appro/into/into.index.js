define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
		var moment = require( "moment" );
		base.code.cache( "Is_No" );
		
		//=======================================================
		// 当前组件
		//=======================================================
		var that = this; //全局对象
		var vars = this.vars = {};//全局变梁
		var handlers = this.handlers = {};//处理程序
		handlers.global = function() { return that; };
		
		//that.vars.gradeFlag = false; //默认未进行工单评分
		that.vars.validateFlag = false;//默认未进行黑名单验证
		
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
			that.vars.validator = that.selector.find( "form" ).validate( {
				rules: {
					level: { required: true },
					score: { required: true , digits: true ,min: 0 }
				}
			} );
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			
			that.selector.find(":input[name=level]").select({
				remote: {
					url: "jiufu/loanWorkImport/gradeList",
					type: 'POST'
				}
			})
			
			//评分事件
			that.selector.find( "#gradeBtn" ).click( function(event) {
				that.handlers.grade();
				return false;
			});
			
			//黑名单验证事件
			that.selector.find( "#validateBtn" ).click( function(event) {
				that.handlers.vali();
				return false;
			});
			
			//工单导入事件
			that.selector.find( "#submitBtn" ).click( function(event) {
				if(!that.vars.validateFlag){
					return message.error( "请先进行黑名单验证" );
				}
				/*
				if(!that.vars.gradeFlag){
					return message.error( "请先进行工单评分" );
				}
				*/
				if(that.vars.validateFlag /*&& that.vars.gradeFlag*/){
					that.handlers.save();
				}
				return false;
			});
			
			//关闭事件
			that.selector.find( "#closeBtn" ).click( function(event) {
				that.close("false");
				return false;
			});
			
			that.selector.find( ".input" ).input( {} );//实例input插件
		};
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		/** 加载数据*/
		handlers.load = function( item ) {
			var that = this.global();
			that.handlers.score();
//			that.selector.find( ":input[name=level]" ).valChange( item.loanLevel ); 
//			that.selector.find( ":input[name=score]" ).valChange( item.loanScore ); 
		};
		
		/** 工单导入*/
		handlers.save = function() {
			var that = this.global();
			that.loading.show(); 
			$.ajax( {
				url: "jiufu/loanWorkImport/insert",
				type: "POST",
				data: {
					"params[loanNo]": that.params.item.loanNo
				},
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
					if ( !data.success ) {
						that.close();
						that.dialog.alert("<span style='color:red'>错误</span>",data.msg);
						return ;//message.error( data.msg );
					}
					that.close( data );
					return message.success( data.msg );
				}
			} );
		
		};
		
		/** 加载评分信息 */
		handlers.score = function() {
			$.ajax( {
				url: "jiufu/loanWorkImport/scoreList",
				type: "POST",
				data: {
					"params[loanNo]": that.params.item.loanNo
				},
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
					if ( !data.success ) {
						that.close( data );
						return message.error( data.msg );
					}
					//console.log(data)
					that.selector.find( ":input[name=level]" ).valChange( data.map.level ); 
					that.selector.find( ":input[name=score]" ).valChange( data.map.score ); 
					return;					
				}
			} );
		}
		
		/** 工单评分*/
		handlers.grade = function() {	
			var that = this.global();
			//验证
			if ( !that.vars.validator.form() ) return;
			var it = that.params.item;
			that.loading.show(); 
			$.ajax( {
				url: "jiufu/loanWorkImport/grade",
				type: "POST",
				data: {
					"params[loanNo]": it.loanNo,
					"params[level]":that.selector.find( ":input[name=level]" ).val(),
					"params[score]":that.selector.find(":input[name=score]").val()
				},
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
					if ( !data.success ) {
						return message.error( data.msg );
					}
					//that.vars.gradeFlag = true; //保存工单评分评级成功
					return message.success( data.msg );
				}
			} );
		};
		
		/** 黑名单验证*/
		handlers.vali = function() {
			var that = this.global();
			var it = that.params.item;
			that.loading.show(); 
			$.ajax( {
				url: "jiufu/loanWorkImport/validate",
				type: "POST",
				data: {
					"params[loanNo]": it.loanNo
				},
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
					if ( !data.success ) {
						return message.error( data.msg );
					}
					var val=data.list[0].value;//工单验证结果
					if("0"==val){
						that.vars.validateFlag = true;
						return message.success( "此工单不在黑名单中,允许进件" );
					}
					if("1"==val){
						that.vars.validateFlag = false;
						return message.error( "此工单在黑名单中,不允许进件!" );
					}
					if("2"==val){
						that.vars.validateFlag = false;
						return message.error( "未进行此类效验!" );
					}
					return message.error( "黑名单验证错误!" );
					//that.close( data );
				}
			} );
		
		};
	};
	
	return Global;
});