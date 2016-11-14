define(function() {

	function Global(vars) {
		// =======================================================
		// 获取基础组件
		// =======================================================
		var base = require("app/base"), message = base.message, tools = base.tools;
		var moment = require("moment");
		base.code.cache("Is_No");

		// =======================================================
		// 当前组件
		// =======================================================
		var that = this; // 全局对象
		var vars = this.vars = {};// 全局变梁
		var handlers = this.handlers = {};// 处理程序
		handlers.global = function() {
			return that;
		};

		// 组件入口函数 相当于java.main
		that.init = function() {
			this.layout();
		};

		// 页面布局
		that.layout = function() {
			var that = this.global();// 获取组件的全局对象

			// 申请日期
			that.selector.find("input[name=applyDateStart]").datetimepicker({
				minDate : moment("2016-09-12").format("YYYY-MM-DD")

			});
			that.selector.find("input[name=applyDateStart]").val("2016-09-12");
			that.selector.find("input[name=applyDateEnd]").datetimepicker({
				minDate : moment("2016-09-12").format("YYYY-MM-DD")
			});

			// 审核日期
			that.selector.find("input[name=aprvDateStart]").datetimepicker({
				minDate : moment("2016-09-12").format("YYYY-MM-DD")

			});
			that.selector.find("input[name=aprvDateStart]").val("2016-09-12");
			that.selector.find("input[name=aprvDateEnd]").datetimepicker({
				minDate : moment("2016-09-12").format("YYYY-MM-DD")
			});
			// 是否签收
			that.selector.find("input[name=isNo]").select({// 实例下拉插件
				code : {
					type : "IS_NO"
				}
			});
			that.selector.find("input[name=isNo]").valChange("13900002");
			//机构
			that.selector.find( "input[name=orgNo]" ).selectTree( {
				multi: false,
				itemLabel: "orgName",
				itemValue: "orgCode",
				itemId: "id",
				itemPId: "parentId",
				itemOtherValues: [ "orgName:orgName"],
				remote: {
					url: "system/asysorg/queryOrgByParentOrgName",
					type: 'POST',
					data:{},
					params: {}
				},
				events: {
					change: {
						data: {},
						handler: function (event, val, item) {
							
						}
					}
				}
			} );
			//渠道
			that.selector.find( "input[name=chanNo]" ).select( {
				remote: {
					url: 'loan/manage/info/chanNoLst',
					type: 'POST'
				}
			} );
			
			// 实例input插件
			that.selector.find(".input").input({});

			// 手工签收合同
			that.selector.find("#contractSignBtn").bind("click",
					function(event) {
						var items = that.vars.gridVar.selectedRows();
						that.handlers.contractSignBtn(items);
						return false;
					});
			// 导入签收合同Excel
			that.selector.find("#importExcelBtn").bind("click",
					function(event) {
						that.handlers.importExcelBtn();
						return false;
					});
			// 导出Excel
			that.selector.find("#exportExcelBtn").bind("click",
					function(event) {
						that.handlers.exportExcelBtn();
						return false;
					});

			var config = {
				remote : {
					url : "contract/sign/list",
					params : {
						item : that.vars.parentMenuItem
					}
				},
				multi : false,
				page : true,
				query : {
					isExpand : true,
					target : that.selector.find(".grid-query")
				},
				plugins : [],
				customEvents : []
			};
			config.cols = cols = [];

			cols[cols.length] = {
				title : "贷款编号",
				name : "loanNo",
				width : "100px",
				lockWidth : true
			};
			cols[cols.length] = {
				title : "贷款金额",
				name : "loanAmt",
				width : "50px",
				lockWidth : true
			};
			cols[cols.length] = {
				title : "贷款期数",
				name : "instNum",
				width : "50px",
				lockWidth : true
			};
			cols[cols.length] = {
				title : "客户名",
				name : "custName",
				width : "50px",
				lockWidth : true
			};
			cols[cols.length] = {
				title : "销售机构",
				name : "orgName",
				width : "60px",
				lockWidth : true
			};
			cols[cols.length] = {
				title : "销售名",
				name : "staffName",
				width : "50px",
				lockWidth : true
			};
			cols[cols.length] = {
				title : "是否签收",
				name : "isNo",
				width : "40px",
				lockWidth : true,
				renderer : function(val, item, rowIndex) {
					return base.code.getText("Is_No", val);
				}
			};
			cols[cols.length] = {
				title : "签收日期",
				name : "signDate",
				width : "110px",
				lockWidth : true,
				style : "text-align: center",
				renderer : function(val, item, rowIndex) {
					return tools.dateUtil.format(val, "YYYY-MM-DD hh:mm:ss");
				}
			};
			that.vars.gridVar = that.selector.find("#coordGrid").grid(config);
		};
		// =======================================================
		// 业务逻辑申明
		// =======================================================

		// 手工签收合同
		handlers.contractSignBtn = function(items) {
			var that = this.global();
			if (items.length != 1) {
				return message.error("请选择一条操作数据。");
			}

			var item = items[0]; // 获取一条数据

			if (item.isNo == "13900001") {
				return message.error("该合同已经签收了,请勿重复签收!");
			}
			that.dialog.confirm("是否签收合同:[" + item.loanNo + "(" + item.custName
					+ ")]", function(event, index) {
				if (index == 1)
					return false;
				var data = {
					loanNo : item.loanNo,
					custNo : item.custNo,
					custName : item.custName,
					isNo : "13900001"
				};
				$.ajax({
					url : "contract/sign/singByHand",
					type : "POST",
					data : data,
					complete : function() {
						that.loading.hide();
					},
					success : function(data) {
						if (!data.map.succeed) {
							message.error(data.map.msg);
						} else {
							message.success(data.map.msg);
						}
						that.vars.gridVar.load();

					}
				});
			});

		};

		// 导入签收合同Excel
		handlers.importExcelBtn = function() {
			var that = this.global();
			that.modal.open( {
				title: "导入数据(Excel表格模板:贷款编号,客户名) ",
				url: "contract/sign/upload",
				size: "modal-sm",
				width:"320px",
				params: {},
				events: {
					hiden: function( closed, data ) {
						if ( !closed ) return;
						if (!data.map.succeed) {
							message.error(data.map.msg);
						} else {
							message.success(data.map.msg);
						}
						that.vars.gridVar.load();
					}
				}
			} );
		};
		// 导出Excel
		handlers.exportExcelBtn = function() {
			var that = this.global();
			var params={};
			params.loanNo=that.selector.find( "input[name=loanNo]" ).val();
			params.custName=that.selector.find( "input[name=custName]" ).val();
			params.staffName=that.selector.find( "input[name=staffName]" ).val();
			params.isNo=that.selector.find( "input[name=isNo]" ).val();
			params.applyDateStart=that.selector.find( "input[name=applyDateStart]" ).val();
			params.applyDateEnd=that.selector.find( "input[name=applyDateEnd]" ).val();
			params.aprvDateStart=that.selector.find( "input[name=aprvDateStart]" ).val();
			params.aprvDateEnd=that.selector.find( "input[name=aprvDateEnd]" ).val();
			params.chanNo=that.selector.find( "input[name=chanNo]" ).val();
			params.orgNo=that.selector.find( "input[name=orgNo]" ).val();
			var data={};
			data.params=params;
			$.ajax({
				url : "contract/sign/getExcelPath",
				type : "POST",
				data : data,
				async : false,
				complete : function() {
					that.loading.hide();
				},
				success : function(data) {
					if (!data.success) {
						return message.error(data.msg);
					}

					location.href = data.map.path;
				}
			});
		};

	}
	;

	return Global;
});