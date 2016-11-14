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
		code.cache( "Prod_Type,Aprov_Result" );
		
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
			that.selector.find( ".input" ).input( {} );//实例input插件
			//查看贷款信息
			that.selector.find( "#approveListGrid #loanBtn" ).bind( "click", function( event ) {
				var items = that.vars.gridVar.selectedRows();
				that.handlers.loanInfo(items);
				return false;
			} );
			
			var config = {
				remote: {
		        	url: "appro/my/info/list",
		            params: {}
		        },
		        multi: true,
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
			cols[ cols.length ] = { title: "节点名称", name: "nodeNo", width: "120px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "处理人", name: "apprName", width: "70px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "贷款编号", name: "loanNo", width: "180px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "产品编号", name: "prodNo", width: "120px", lockWidth: true , style:"text-align: center"};
			cols[ cols.length ] = { title: "产品类型", name: "prodType", width: "120px", lockWidth: true , style:"text-align: center",
					renderer: function( val, item, rowIndex){return base.code.getText("Prod_Type",item.prodType)}

			};
			cols[ cols.length ] = { title: "客户姓名", name: "custName", width: "70px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "身份证号", name: "certNo", width: "180px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "进件次数", name: "instNum", width: "70px", lockWidth: true, style:"text-align: center"};
			cols[ cols.length ] = { title: "申请时间", name: "applyDate", width: "120px", lockWidth: true, style:"text-align: center",
					renderer: function( val, item, rowIndex ) {return tools.dateUtil.format( item.applyDate, "YYYY-MM-DD");}
			};
			cols[ cols.length ] = { title: "贷款状态", name: "loanStat", width: "120px", lockWidth: true, style:"text-align: center",
					renderer: function( val, item, rowIndex){return base.code.getText("Aprov_Result",item.loanStat)}
			};
			config.events.click = {
				handler: function( event, item, rowIndex ) {
					//item 当期行数据
					//rowIndex 当前行索引
					
					//处理其他逻辑
				}
			};
			
			config.customEvents.push( {
//				target: ".edit",
//				handler: function( event, item, rowIndex ) {
//					
//				}
			} );
			
			that.vars.gridVar = that.selector.find( "#approveListGrid" ).grid( config );//renderer
			that.selector.find( "#approveListGrid #queryBtn" ).click(function(){
				var loginName = $("input[id='loginName']").val();
				var userName = $("input[id='userName']").val();
				$.ajax({
					url : "appro/state/list",
					type : "POST",
					data : {
						loginName : loginName,
						userName:userName
					},
					success : function(data) {
						if(data == "23700001"){
							$(".qiandao").html("已就绪");
							$(".ready").html("已就绪");
							$(".sign").html("已签到");
							$(".leave").html("离开");
						}else if(data == "23700002"){
							$.ajax({
								url : "appro/state/update",
								type : "POST",
								data : {
									staff : data,
									loginName : loginName
								},
								success : function(data) {
									if(data){
										$(".qiandao").html("审批中");
										$(".ready").html("就绪");
										$(".sign").html("已签到");
										$(".leave").html("离开");	
										$(".coil").html("下线");
									}
								}	
							});
						}else if(data == "23700003"){
							$(".qiandao").html("已签到");
							$(".sign").html("已签到");
						}else if(data == "23700004"){
							$(".qiandao").html("请签到");
							$(".coil").html("已下线")
						}else if(data == "23700005"){
							$(".qiandao").html("已离开");
							$(".leave").html("恢复");
							$(".sign").html("已签到");
						}
					}
				});
			});
			
		};
		
		
		//=======================================================
		//业务逻辑申明
		//=======================================================
		handlers.load = function( data ) {
			
		};
		
		//加载贷款信息的展示页面
		handlers.loanInfo = function(items){
			if ( items.length != 1 ) {
				return message.error( "请选择一条操作数据。" );
			}
			var item = items[ 0 ]; //获取一条数据
			var that = this.global();
			
			//大数据申请			
			$.ajax( {
				url: "appro/applybigdata/applyall",
				type: "POST",
				async: false,
				data: { loanNo: item.loanNo },
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
					message.success( data.msg);
				}
			} );
			that.page.open( {
				title: "贷款视图",
				url: "appro/my/info/form",
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