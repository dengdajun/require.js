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
		code.cache( "" );
		
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
			that.handlers.loanView(that.selector.find("#loanView"));
			
			that.handlers.operatHtm(that.selector.find("#optOperat"));
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {
			
		};
		
		//加载贷款视图展示页面
		//下列为对应的label的Id
		//loanbaseinfo 贷款基本信息
		//custBaseinfo 客户基本信息
		//capitalinfo 资方信息
		//overdue     逾期信息
		//handInfo    贷款经办信息
		//attachment  附件
		handlers.loanView = function(content){
			var that = this.global();
			var labelOfHidden = new Array();
			labelOfHidden =["capitalinfo","overdue"];//贷款视图要隐藏的lable
			that.params.item.labelOfHidden = labelOfHidden;
			that.module.open( {
			    url: "cust/manage/loan/index",
			    content: content,
			    params: {item:that.params.item},
			    events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.close();
					}
				}
			});
		};
		//加载操作页面
		handlers.operatHtm = function(content){
			var that = this.global();
		    var flowId = that.params.item.flowId;
		    var nodeNo = that.params.item.nodeNo;
			that.module.open( {
			    url: "appro/my/info/operat/htm/"+flowId+"/"+nodeNo,
			    content: content,
			    params: {item:that.params.item},
			    events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						that.close();
					}
				}
			});
		};
	};
	return Global;
	
} );