define(function() {
	function Global(vars) {

		// =======================================================
		// 获取基础组件
		// =======================================================
		var $ = require("jquery"), base = require("app/base"), message = base.message, tools = base.tools;
		base.code.cache("Is_No,Requir_Type,Requir_Stat");

		// =======================================================
		// 当前组件
		// =======================================================
		var that = this;
		var vars = that.vars = {};// 全局变梁
		var handlers = that.handlers = {};// 处理程序
		handlers.global = function() {
			return that;
		};
		// 组件入口函数 相当于java.main
		that.init = function() {
			// 加载初始化数据
			this.load();
			// 布局初始化
			this.layout();

		};

		// 初始化远程请求处理
		that.load = function() {
			var that = this.global();
			that.handlers.load(that.params.item);
		};

		// 页面布局
		that.layout = function() {
			// 获取组件的全局对象
			var that = this.global();

			/** **********************************************************************************实例化插件start* */
			// 查询表达式连接关系
			that.selector.find("input[name=condtAndOr]").select({
				itemLabel : "label",
				itemValue : "val",
				remote : {
					url : "nucleus/bizconfig/sysrule/getCondtAndOr",
					type : 'POST'
				}
			});

			// 查询表达式
			that.selector.find("input[name=queryExpr]").select({
				code : {
					type : "Indct_Clca_Type"
				}
			});
			that.selector.find("input[name=queryExpr]").valChange("29100007");
			// 条件表达式
			that.selector.find("input[name=condtExpr]").select({
				itemLabel : "label",
				itemValue : "val",
				remote : {
					url : "nucleus/bizconfig/sysrule/getListCondtExpr",
					type : 'POST'
				}
			});

			that.selector.find(".input").input({});// 实例input插件
			/** 实例化插件end******************************************************************************* */

			/** 绑定事件start* */

			/** *************************************************************加载数据库事件start* */
			// 库 加载事件;
			that.selector.find("#dataBases").click(
					function(event) {
						// 选中数据库
						var dataBase = that.selector.find("#dataBases").find(
								"option:selected").val();
						// 加载表
						that.handlers.loadTables(dataBase);

						// 清空展示框
						that.handlers.QueryClearBtn();
						that.handlers.clearBtn();

						return false;
					});
			// 表 加载事件;
			that.selector.find("#dataBaseTables").click(
					function(event) {
						// 选中数据库
						var dataBase = that.selector.find("#dataBases").find(
								"option:selected").val();
						// 选中的表
						var dataBaseTables = that.selector.find(
								"#dataBaseTables").find("option:selected")
								.val();

						// 加载表内字段
						that.handlers.loadFields(dataBaseTables);

						// 清空展示框
						that.handlers.QueryClearBtn();
						that.handlers.clearBtn();

						return false;
					});
			// 字段 加载事件 --条件
			that.selector.find("#condtFields").click(
					function(event) {
						// 数据库
						var dataBaseTables = that.selector.find(
								"#dataBaseTables").find("option:selected")
								.val();

						if (null == dataBaseTables) {
							message.error("请先选择表名!");
							return;
						}

						return false;
					});
			// 字段 加载事件 -- 查询
			that.selector.find("#queryFields").click(
					function(event) {
						// 数据库
						var dataBaseTables = that.selector.find(
								"#dataBaseTables").find("option:selected")
								.val();

						if (null == dataBaseTables) {
							message.error("请先选择表名!");
							return;
						}
						return false;
					});
			/** 加载数据库事件end******************************************************************************** */

			/** ****************************************************************************条件追加/清空按钮start* */
			// 退格查询按钮
			that.selector.find("#QueryBsBtn").click(function(event) {
				that.handlers.QueryBsBtn();
				that.handlers.sqlBtn();
				return false;
			});
			// 追加查询按钮
			that.selector.find("#QueryAddBtn").click(function(event) {
				that.handlers.addQueryBtn();
				that.handlers.sqlBtn();
				return false;
			});
			// 清空查询表达式
			that.selector.find("#QueryClearBtn").click(function(event) {
				that.handlers.QueryClearBtn();
				return false;
			});

			// 追加条件按钮
			that.selector.find("#addBtn").click(function(event) {
				that.handlers.addCond();
				that.handlers.sqlBtn();
				return false;
			});
			// 清空表达式
			that.selector.find("#clearBtn").click(function(event) {
				that.handlers.clearBtn();
				return false;
			});
			/** ****************************************************************************条件追加/清空按钮end* */

			// 插入
			that.selector.find("#submitSaveBtn").click(function(event) {
				that.handlers.submitSaveBtn();
				return false;
			});

			/** 绑定事件end* */

		};

		// =======================================================
		// 业务逻辑申明
		// =======================================================
		/** 加载数据 */
		handlers.load = function(item) {
			var that = this.global();
			// 入口直接加载数据库
			that.handlers.loadDataBases();
		};

		
		// 保存
		handlers.submitSaveBtn = function() {
			var that = this.global();
			var sqlStr = that.selector.find(":input[name=sqlStr]").val();

			if (!that.handlers.sqlBtn()) {
				message.error("SQL语句不能为空!");
				return;
			}
			if ("" == sqlStr || null == sqlStr) {
				message.error("SQL语句不能为空!");
				return;
			}

			that.dialog.confirm("您确定要使用该sql吗?", function(event, index) {
				if (index == 1) {
					return false;
				}

				that.close(sqlStr);
			});

		};

		// 生成SQL事件
		handlers.sqlBtn = function() {
			var that = this.global();
			// 获取数据库名
			var dataBase = that.selector.find("#dataBases").find(
					"option:selected").val();
			// 获取表名
			var dataBaseTables = that.selector.find("#dataBaseTables").find(
					"option:selected").val();
			// 获取查询条件
			var QuerySimpleCondition = that.selector.find(
					"#QuerySimpleCondition").val();
			// 获取表达条件
			var simpleCondition = that.selector.find("#simpleCondition").val();

			if ("" == QuerySimpleCondition || null == QuerySimpleCondition) {
				that.selector.find("#sqlStr").val("");
				return false;
			}
			/** 清空 */
			that.selector.find("#sqlStr").val("");
			var data = "dataBase=" + dataBase + "&dataBaseTables="
					+ dataBaseTables + "&QuerySimpleCondition="
					+ QuerySimpleCondition + "&simpleCondition="
					+ simpleCondition;

			$.ajax({
				type : "POST",
				url : "nucleus/bizconfig/sysrule/getSql",
				async : false,
				data : data,
				dataType : "json",
				success : function(data) {
					that.selector.find("#sqlStr").val(data.t);

				}
			});

			return true;
		};

		/** **********************************数据库加载事件start********************************* */
		// 加载源内所有库(只加载一次)
		handlers.loadDataBases = function() {
			var that = this.global();
			$.ajax({
				type : "POST",
				url : "nucleus/bizconfig/sysrule/getDataBases",
				async : false,
				dataType : "json",
				success : function(data) {
					var list = data.list;

					var html = '';
					for (var i = 0; i < list.length; i++) {
						if ("PERFORMANCE_SCHEMA" == list[i].label
								|| "INFORMATION_SCHEMA" == list[i].label
								|| "MYSQL" == list[i].label
								|| "SYS" == list[i].label) {
							continue;
						}

						html += "<option value='" + list[i].value + "'>"
								+ list[i].label + "</option>";

					}
					that.selector.find("#dataBases").html(html);
				}
			});
		};

		// 给定数据库,加载所有表
		handlers.loadTables = function(dataBase) {
			var that = this.global();
			$.ajax({
				type : "POST",
				url : "nucleus/bizconfig/sysrule/getTables?dataBase="
						+ dataBase,
				async : false,
				dataType : "json",
				success : function(data) {
					that.selector.find("#dataBaseTables").html('');
					var list = data.list;
					var html = '';
					for (var i = 0; i < list.length; i++) {

						html += "<option value='" + list[i].value + "'>"
								+ list[i].label + "</option>";

					}
					that.selector.find("#dataBaseTables").html(html);

				}
			});

		};
		// 给定数据库-表,加载所有字段
		handlers.loadFields = function(dataBaseTables) {
			var that = this.global();

			$.ajax({
				type : "POST",
				url : "nucleus/bizconfig/sysrule/getfields?table="
						+ dataBaseTables,
				async : false,
				dataType : "json",
				success : function(data) {
					that.selector.find("#queryFields,#condtFields").html('');
					var list = data.list;
					var html = '';
					for (var i = 0; i < list.length; i++) {

						html += "<option value='" + list[i].value + "'>"
								+ list[i].label + "</option>";

					}
					that.selector.find("#queryFields,#condtFields").html(html);

				}
			});

		};
		/** **********************************数据库加载事件end********************************* */

		/** *******************************************************************追加条件方法Start */
		handlers.addCond = function() {
			var condtFields = that.selector.find("#condtFields").find(
					"option:selected").val();
			var condtExpr = that.selector.find("input[name=condtExpr]").val();
			var condtVal = that.selector.find("input[name=condtVal]").val();

			if (condtFields == null || $.trim(condtFields) == "") {
				message.error("表字段为空！");
				return false;
			}
			if (condtExpr == null || $.trim(condtExpr) == "") {
				message.error("关系表达式为空！");
				return false;
			}
			if (condtVal == null || $.trim(condtVal) == "") {

				condtVal = handlers.getCamelCase($.trim(condtFields));

			}

			var simpleCondition = that.selector.find("#simpleCondition").val();

			if (simpleCondition == null || $.trim(simpleCondition) == "") {
				var tmp = that.handlers.setupCon(condtFields, condtExpr,
						condtVal);
				that.selector.find("#simpleCondition").val(" WHERE " + tmp);
			} else {
				var tmp = that.handlers.setupCon(condtFields, condtExpr,
						condtVal);
				// 连接表达式
				var condtAndOr = that.selector.find("#condtAndOr").val();

				if (condtAndOr == null || $.trim(condtAndOr) == "") {
					message.error("连接关系为不可为空!");
					return false;
				} else {
					switch (condtAndOr) {
					case "1":
						condtAndOr = "AND";
						break;
					case "2":
						condtAndOr = "OR";
						break;
					}
				}

				that.selector.find("#simpleCondition").val(
						simpleCondition + " " + $.trim(condtAndOr) + " " + tmp);
			}
		};

		/**
		 * field : 传入字段(哪个字段加条件) expr : 传入表达式(等于,等于 等等) val : 值
		 */
		handlers.setupCon = function(field, expr, val) {
			var tmp = field;
			if (expr == "1")
				tmp += " = " + $.trim(val);
			else if (expr == "2")
				tmp += " > " + $.trim(val);
			else if (expr == "3")
				tmp += " < " + $.trim(val);
			else if (expr == "4")
				tmp += " >= " + $.trim(val);
			else if (expr == "5")
				tmp += " <= " + $.trim(val);
			else if (expr == "6")
				tmp += " <> " + $.trim(val);
			else if (expr == "7")
				tmp += " = '" + $.trim(val) + "'";
			else if (expr == "8")
				tmp += " > '" + $.trim(val) + "'";
			else if (expr == "9")
				tmp += " < '" + $.trim(val) + "'";
			else if (expr == "10")
				tmp += " >= '" + $.trim(val) + "'";
			else if (expr == "11")
				tmp += " <= '" + $.trim(val) + "'";
			else if (expr == "12")
				tmp += " <> '" + $.trim(val) + "'";
			else if (expr == "13")
				tmp += " LIKE CONCAT('%25'," + $.trim(val) + ",'%25')";
			else if (expr == "14")
				tmp += " NOT LIKE CONCAT('%25'," + $.trim(val) + ",'%25')";
			else if (expr == "15")
				tmp += " IN (" + $.trim(val) + ")";
			else if (expr == "16")
				tmp += " NOT IN (" + $.trim(val) + ")";

			return tmp;
		};

		// 转换协议变量名
		handlers.getCamelCase = function(val) {
			val = val.toLowerCase();
			var fields = "@v_" + val;

			return fields;
		}

		/** *******************************************************************追加条件方法end*********** */

		/** *****************************************追加查询方法start************************** */
		handlers.QueryBsBtn = function() {
			var QuerySimpleCondition = that.selector.find("#QuerySimpleCondition").val();
			QuerySimpleCondition = QuerySimpleCondition.substring(0,QuerySimpleCondition.lastIndexOf(","))
			that.selector.find("#QuerySimpleCondition").val(QuerySimpleCondition)
			
		}
		
		
		
		// 追加查询条件
		handlers.addQueryBtn = function() {
			var queryFields = that.selector.find("#queryFields").find(
					"option:selected").val();

			var queryExpr = that.selector.find("input[name=queryExpr]").val();

			if (queryFields == null || $.trim(queryFields) == "") {
				message.error("表字段为空！");
				return false;
			}
			if (queryExpr == null || $.trim(queryExpr) == "") {
				message.error("关系表达式为空！");
				return false;
			}

			var QuerySimpleCondition = that.selector.find(
					"#QuerySimpleCondition").val();

			if (QuerySimpleCondition == null
					|| $.trim(QuerySimpleCondition) == "") {
				var tmp = that.handlers.setQueryUpCon(queryFields, queryExpr);

				that.selector.find("#QuerySimpleCondition").val(tmp);
			} else {
				var tmp = that.handlers.setQueryUpCon(queryFields, queryExpr);
				that.selector.find("#QuerySimpleCondition").val(
						QuerySimpleCondition + " , " + tmp);
			}
		};
		/**
		 * field : 传入字段(哪个字段加条件) expr : 传入表达式(等于,等于 等等)
		 */
		handlers.setQueryUpCon = function(field, expr) {

			var tmp = field;
			// 总和
			if (expr == "29100001") {
				tmp = "SUM(" + $.trim(field) + ")";
			}
			// 计数
			else if (expr == "29100002") {
				tmp = "COUNT(" + $.trim(field) + ")";
			}
			// 最大值
			else if (expr == "29100003") {
				tmp = "MAX(" + $.trim(field) + ")";
			}
			// 最小值
			else if (expr == "29100004") {
				tmp = "MIN(" + $.trim(field) + ")";
			}
			// 平均值
			else if (expr == "29100005") {
				tmp = "AVG(" + $.trim(field) + ")";
			}
			// 标准差
			else if (expr == "29100006") {
				tmp = "STD(" + $.trim(field) + ")";
			}
			// 无
			else if (expr == "29100007") {
				tmp = $.trim(field);
			}
			return tmp;
		};
		/** *****************************************追加查询方法end************************** */

		/** **********************************清空事件start********************************* */
		handlers.clearBtn = function() {
			that.selector.find("#simpleCondition").val("");
			that.handlers.sqlBtn();
		}
		handlers.QueryClearBtn = function() {
			that.selector.find("#QuerySimpleCondition").val("");
			that.handlers.sqlBtn();
		}
		/** **********************************清空事件end********************************* */

	}
	;
	return Global;
});
