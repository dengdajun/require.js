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
		code.cache( "Is_No" );
		
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
		//验证组件
		that.valdiate = function() {
			var that = this.global(); 
			//jquery-validate 验证form表单元素
			that.vars.validator = that.selector.find( "form" ).validate( {
				rules: {
					flowId: { required: true }
				}
			} );
		};
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			that.selector.find( ".input" ).input( {} );//实例input插件
			
			that.selector.find( "input[name=apprStat]" ).select( {//实例下拉插件
				code: { type: "Case_Appr_Stat" }
			} );
			that.selector.find( "input[name=apprStep]" ).select( {//实例下拉插件
				code: { type: "Aprov_Step" },
			} );
			that.selector.find( "#info" ).bind( "click", function( event ) {
			
				that.handlers.info();
			} );
			//贷款视图
			that.selector.find( "#userGroupGrid #queryBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.query(items);
				return false;
			} );
			var config = {
				remote: {
		        	url: "appro/latest/node/list",
		            params: {}
		        },
		        multi: false,
		        page: true,
		        query: {
		        	isExpand:true,
		        	target: that.selector.find( ".grid-query" )
		        },
		        plugins: [],
		        events: {},
		        customEvents: []
			};
			
			config.cols = cols = [];
			cols[ cols.length ] = { title: "贷款编号", name: "loanNo", width: "200px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "客户名称", name: "custName", width: "100px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "客户身份证号", name: "certNo", width: "200px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "审批流程编号", name: "flowId", width: "100px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "节点顺序", name: "nodeOrder", width: "80px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "审批阶段", name: "apprStep", width: "100px" ,lockWidth: true , style:"text-align: center",
					renderer:function(val,item,rowIndex){return base.code.getText("Aprov_Step",val);
			}};
			cols[ cols.length ] = { title: "处理人", name: "apprName", width: "100px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "处理人编号", name: "apprNo", width: "100px",lockWidth: true , style:"text-align: center" };
			cols[ cols.length ] = { title: "审批状态", name: "apprStat", width: "100px" ,lockWidth: true , style:"text-align: center",
					renderer:function(val,item,rowIndex){return base.code.getText("Case_Appr_Stat",val);
			}};
			cols[ cols.length ] = { title: "审批开始时间", name: "startSate", width: "150px", style:"text-align: center", lockWidth: true ,
					renderer: function( val, item, rowIndex ) {return tools.dateUtil.format( item.startSate, "YYYY-MM-DD HH:mm:ss");
			}};
			cols[ cols.length ] = { title: "审批结束时间", name: "endDate", width: "150px", style:"text-align: center",lockWidth: true ,
					renderer: function( val, item, rowIndex ) {return tools.dateUtil.format( item.endDate, "YYYY-MM-DD HH:mm:ss");
			}};
			cols[ cols.length ] = { title: "备注", name: "remark", width: "200px",lockWidth: true ,style:"text-align: center",mouseover: true};
			
			config.events.click = {
				handler: function( event, item, rowIndex ) {
					//item 当期行数据
					//rowIndex 当前行索引
					
					//处理其他逻辑
				}
			};
			
			config.customEvents.push( {
				target: ".edit",
				handler: function( event, item, rowIndex ) {
					
				}
			} );
			
			that.vars.gridVar = that.selector.find( "#userGroupGrid" ).grid( config );//renderer
			
			
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		//加载贷款信息的展示页面
		handlers.query = function(items){
			if ( items.length != 1 ) {
				return message.error( "请选择一条操作数据。" );
			}
			
			var item = items[ 0 ]; //获取一条数据
			
			var that = this.global();
			that.page.open( {
				title: "贷款视图",
				url: "loan/manage/info/form",
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
		
	};
	
	return Global;
	
} );