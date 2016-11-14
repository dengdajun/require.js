define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
		
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
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			
			var $frameContainer = that.selector.find( "#frameContainer" ).css( {
				"margin": "-15px -15px"
			} );
			var frameName = "Flow_" + tools.uuid();
			var $frame = $( tools.format( '<iframe src="assets/component/myflow-min/editor.jsp" name="{0}" style="border:none; width: 100%; height: 1px;" />', [ frameName ] ) ).appendTo( $frameContainer );
			var wfchart = "";
			if ( that.params.item )
				wfchart = that.params.item.flowChar;
			
			if(wfchart == null || $.trim(wfchart) == "")
				wfchart = "{states:{"
					+ "},"
					+ "props:{props:{name:{value:'新建流程'},key:{value:''},desc:{value:''}}}}";
			
//			alert("wfchart=[" + wfchart + "]");
			
			$frame.bind( "load", function() {
				var flow = window.frames[ frameName ];
				var FlowGlobal = flow.Global;
				FlowGlobal.prototype.base = base;
				FlowGlobal.prototype.parent = that;
				new FlowGlobal().init(wfchart);
			} );
						
			that.section.bind( "section.resize", function( event, width, height ) {
				$frame.css( "height", height - 7 );
			} );
						
			$( document ).trigger( "main.resize.tabpage.section" );
			
		};
		
		that.savedata = function(savedata)
		{
//			alert("=====11111savedata=====\n" + savedata);
//			debugger;
			var obj = eval("(" + savedata + ")");
//			alert("------------");
			// states对象
			var sobj = obj.states;
			var tflag = that.handlers.validate_task(sobj);
			if(tflag == "0")
				return false;
			
			// props对象
			var pobj = obj.props;
			var pflag = handlers.validate_template(pobj);
			if(pflag == "0")
				return false;
			
			$.ajax( {
				url: "flow/flowapr/wfchartdatasave",
				type: "POST",
				data: {savedata:savedata},
				complete: function() {
//					that.loading.hide();
				},
				success: function( data ) {
//					alert(data.success);
					if ( !data.success ) {
						return message.error( data.msg );
					}
					message.success("流程模板操作成功！");
				}
			} );
				
		};
		
		// 验证节点数据输入项
		handlers.validate_task = function(sobj)
		{
			var vls = "";
			// 遍历
			for(var key in sobj)
			{
				if(sobj[key].type != "task")
				{
					alert("工作流程图节点只能是'任务【task】'类型！");
					return "0";
				}
				
				
				var s = "";
				if(sobj[key].type == "task")
				{
					var rec_propsobj = sobj[key].props;
					if(rec_propsobj.text.value == null || $.trim(rec_propsobj.text.value) == "")
						s +=" 节点名称";
					if(rec_propsobj.nodeKey.value == null || $.trim(rec_propsobj.nodeKey.value) == "")
						s +=" 节点代码";
					var nodeKind = rec_propsobj.nodeKind.value;
					if(nodeKind == null || $.trim(nodeKind) == "")
						s +=" 节点类型";
					else
					{
						var serarchKind = rec_propsobj.serarchKind.value;
						var roleCode = rec_propsobj.roleCode.value;
						var orgCode = rec_propsobj.orgCode.value;
						var assignee = rec_propsobj.assignee.value;
						
						
						nodeKind = $.trim(nodeKind);
						if(nodeKind == "17300001" || nodeKind == "17300002" || nodeKind == "17300003" 
							|| nodeKind == "17300007" || nodeKind == "17300009")
						{
							if(serarchKind == null || $.trim(serarchKind) == "")
								s += " 搜索类型";
							if(roleCode == null || $.trim(roleCode) == "")
								s += " 角色";
						}
						else if(nodeKind == "17300005")
						{
							if(assignee == null || $.trim(assignee) == "")
								s += " 审批人";
						}
						else if(nodeKind == "17300006")
						{
							if(roleCode == null || $.trim(roleCode) == "")
								s += " 角色";
							if(orgCode == null || $.trim(orgCode) == "")
								s += " 机构";
						}
						else if(nodeKind == "17300008" || nodeKind == "173000010")
						{
							if(roleCode == null || $.trim(roleCode) == "")
								s += " 角色";
						}
					}
					
					if(rec_propsobj.nodeIndex.value == null || $.trim(rec_propsobj.nodeIndex.value) == "")
						s +=" 节点索引";
					if(rec_propsobj.searchType.value == null || $.trim(rec_propsobj.searchType.value) == "")
						s +=" 查找类型";
					if(rec_propsobj.examType.value == null || $.trim(rec_propsobj.examType.value) == "")
						s +=" 策略类型";
//					if(rec_propsobj.busiStat.value == null || $.trim(rec_propsobj.busiStat.value) == "")
//						s +=" 业务状态";
					if(rec_propsobj.lastNode.value == null || $.trim(rec_propsobj.lastNode.value) == "")
						s +=" 最后节点";
					
					if(s != "")
					{
						vls += "节点[" + rec_propsobj.text.value + "]  '" + s + "'  不能为空！\n";
					}
					
				}
			}
			
			if(vls != "")
			{
				alert(vls);
				return "0";
			}
			
			return "1";
		};
		
		// 验证模板数据
		handlers.validate_template = function(obj)
		{
			var pobj = obj.props;
			var s = "";
		
			if(pobj.name.value == null || $.trim(pobj.name.value) == "")
				s +=" 流程名称";
			if(pobj.key.value == null || $.trim(pobj.key.value) == "")
				s +=" 流程代码";
			if(pobj.appPage.value == null || $.trim(pobj.appPage.value) == "")
				s +=" 系统代码";
			if(pobj.appName.value == null || $.trim(pobj.appName.value) == "")
				s +=" 系统名称";
			if(pobj.appUrl.value == null || $.trim(pobj.appUrl.value) == "")
				s +=" 系统登录URL";
			
			if(pobj.del.value == null || $.trim(pobj.del.value) == "")
				s +=" 是否删除";
//			if(pobj.wftype.value == null || $.trim(pobj.wftype.value) == "")
//				s +=" 流程分类";
			
			
			if(s != "")
			{
				s = "流程[" + pobj.name.value + "]  '" + s + "'  不能为空！\n";
			}
			
			if(s != "")
			{
				alert(s);
				return "0";
			}
			
			return "1";
		};
		
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		/** 加载数据*/
		handlers.load = function( item ) {
		};
	};
	
	return Global;
});