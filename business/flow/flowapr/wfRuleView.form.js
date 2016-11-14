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
		var _gflag = -1;    // 初始化  0-- 初始化化  1--非初始化
		
		//组件入口函数  相当于java.main
		that.init = function() {
			this.layout();
			this.load();
			this.valdiate();
		};
		
		//初始化远程请求处理
		that.load = function() {
			var that = this.global(); 
			
			
			var _conditionVal = that.params.conditionVal;
			if(_conditionVal != null && _conditionVal != "")
			{
				_conditionVal = _conditionVal.replace(/#_#/g, "'");
				var obj = eval("(" + _conditionVal + ")");
				
				that.selector.find( ":input[name=ruleName]" ).valChange( obj.ruleName ); 
				that.selector.find( ":input[name=ruleType]" ).valChange( obj.ruleType ); 
				that.selector.find( ":input[name=tableName]" ).val( obj.tableName ); 
				that.handlers.ruleTypeChange(obj.ruleType);
				
				if(obj.ruleType == "90003001")
				{
					that.selector.find( "#simpleCondition" ).val( obj.simpleCondition ); 
				}
				else
					that.selector.find( "#complexCondition" ).val( obj.complexCondition ); 
				_gflag = 0;
			}
		};
		
		//验证组件
		that.valdiate = function() {
			var that = this.global(); 
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			

			that.selector.find( "#addBtn" ).click(
				function(event) {
					that.handlers.addCond();
					return false;
				}
			);
			
			that.selector.find( "#submitBtn" ).click( function( event ) {
				that.handlers.submit();
				return false;
			} );
			
			that.selector.find( "#clearBtn" ).click( function( event ) {
				that.selector.find( "#simpleCondition" ).val("");
				return false;
			} );
			
			that.selector.find( "#clearBtn_cmp" ).click( function( event ) {
				that.selector.find( "#complexCondition" ).val("");
				return false;
			} );
			
			that.selector.find( "input[name=ruleType]" ).select( 
				{
					code: { type: "Flow_Rule_Type" }
					,
					events: {
						change: {
							data: {},
							handler: function (event, val, item) {
								that.handlers.ruleTypeChange(item.valCode);
							}
						}
					}
				} 
			);
						
			that.selector.find( "input[name=tableName]" ).select( {
				itemLabel: "label",
				itemValue: "val",
				remote: {
					url: "pub/asysatt/getListTable",
					type: 'POST'
				}
				,
				events: {
					change: {
						data: {},
						handler: function (event, val, item) {
							if(_gflag != 0)
							{
								that.selector.find( "#simpleCondition" ).val("");
								that.handlers.tabelFieldSlct(item.val);
								
							}
							else
								_gflag = 1;
							
						}
					}
				}
			} );
			
			that.selector.find( "input[name=condtExpr]" ).select( {
				itemLabel: "label",
				itemValue: "val",
				remote: {
					url: "pub/asysatt/getListExpr",
					type: 'POST'
				}
			} );
			
			
			that.selector.find( "#clearBtn_cmp" ).hide();
			
			that.selector.find( "#tr_1" ).hide();
			that.selector.find( "#tr_2" ).hide();
			that.selector.find( "#tr_3" ).hide();
			that.selector.find( "#tr_4" ).hide();
			that.selector.find( "#tr_5" ).hide();
			that.selector.find( "#tr_6" ).hide();
			
		};
		
		handlers.submit = function()
		{
			var that = this.global();//获取组件的全局对象
			
			var ruleName = that.selector.find( "input[name=ruleName]" ).val();
			if(ruleName == null || $.trim(ruleName) == "")
			{
				alert("规则名称不能为空！");
				return false;
			}
			var ruleType = that.selector.find( "input[name=ruleType]" ).val();
			if(ruleType == null || $.trim(ruleType) == "")
			{
				alert("规则类型不能为空！");
				return false;
			}
			var t = "";
			var flag = "#_#";
			// 配置
			if(ruleType == "90003001")
			{
				var simpleCondition = that.selector.find( "#simpleCondition" ).val();
				if(simpleCondition == null || $.trim(simpleCondition) == "")
				{
					alert("查询条件表达式不能为空！");
					return false;
				}
				t = "{ruleName:" + flag + ruleName + flag ;
				t += ",ruleType:" + flag  + ruleType + flag ;
				t += ", tableName:" + flag  + that.selector.find( "input[name=tableName]" ).val() + flag ;
				t += ", simpleCondition:" + flag  + $.trim(simpleCondition) + flag  + "}";
//				t += ", complexCondition:__\'" + "";
			}
			else
			{
				var complexCondition = that.selector.find( "#complexCondition" ).val();
				if(complexCondition == null || $.trim(complexCondition) == "")
				{
					alert("查询条件表达式不能为空！");
					return false;
				}
				
				t = "{ruleName:" + flag  + ruleName + flag ;
				t += ", ruleType:" + flag  + ruleType + flag ;
//				t += ", tableName:\'\'";
//				t += ", simpleCondition:\'\'";
				t += ", complexCondition:" + flag  + $.trim(complexCondition) + flag  + "}";
			}
//			alert("before:\n" + t);
			t = t.replace(/\'/g, "__");
			
//			alert("after:\n" + t);
			var items = [], item;
			item = {
				label: t,
				val: t
			};
			
			items.push( item );
			
			that.close( items[ 0 ] );
		};
		
		
		handlers.addCond = function()
		{
			var tableField = that.selector.find( "input[name=tableField]" ).val();
			var condtExpr = that.selector.find( "input[name=condtExpr]" ).val();
			var condtVal = that.selector.find( "input[name=condtVal]" ).val();
			if(tableField == null || $.trim(tableField) == "")
			{
				alert("表字段为空！");
				return false;
			}
			if(condtExpr == null || $.trim(condtExpr) == "")
			{
				alert("关系表达式为空！");
				return false;
			}
			if(condtVal == null || $.trim(condtVal) == "")
			{
				alert("表达式值为空！");
				return false;
			}
			
			var simpleCondition = that.selector.find( "#simpleCondition" ).val();
			
			if(simpleCondition == null || $.trim(simpleCondition) == "")
			{
				var tmp = that.handlers.setupCon(tableField, condtExpr, condtVal);
				that.selector.find( "#simpleCondition" ).val(tmp);
			}
			else
			{
				var tmp = that.handlers.setupCon(tableField, condtExpr, condtVal);
				that.selector.find( "#simpleCondition" ).val(simpleCondition + " and " + tmp);
			}
		};
		
		handlers.setupCon = function(field, expr, val)
		{
			var tmp = field;
			if(expr == "1")
				tmp += " = " + $.trim(val);
			else if(expr == "2")
				tmp += " > " + $.trim(val);
			else if(expr == "3")
				tmp += " < " + $.trim(val);
			else if(expr == "4")
				tmp += " >= " + $.trim(val);
			else if(expr == "5")
				tmp += " <= " + $.trim(val);
			else if(expr == "6")
				tmp += " <> " + $.trim(val);
			else if(expr == "7")
				tmp += " = '" + $.trim(val) + "'";
			else if(expr == "8")
				tmp += " > '" + $.trim(val) + "'";
			else if(expr == "9")
				tmp += " < '" + $.trim(val) + "'";
			else if(expr == "10")
				tmp += " >= '" + $.trim(val) + "'";
			else if(expr == "11")
				tmp += " <= '" + $.trim(val) + "'";
			else if(expr == "12")
				tmp += " <> '" + $.trim(val) + "'";
			else if(expr == "13")
				tmp += " like '%" + $.trim(val) + "%'";
			else if(expr == "14")
				tmp += " not like '%" + $.trim(val) + "%'";
			else if(expr == "15")
				tmp += " in (" + $.trim(val) + ")";
			else if(expr == "16")
				tmp += " not in (" + $.trim(val) + ")";
			
			return tmp;
		}
		
		
		handlers.ruleTypeChange = function(type)
		{
			if(type == "90003001")
			{
				that.selector.find( "#tr_1" ).show();
				that.selector.find( "#tr_2" ).show();
				that.selector.find( "#tr_3" ).show();
				that.selector.find( "#tr_4" ).show();
				that.selector.find( "#tr_5" ).show();
				that.selector.find( "#tr_6" ).hide();
				that.selector.find( "#clearBtn_cmp" ).hide();
			}
			else
			{
				that.selector.find( "#tr_1" ).hide();
				that.selector.find( "#tr_2" ).hide();
				that.selector.find( "#tr_3" ).hide();
				that.selector.find( "#tr_4" ).hide();
				that.selector.find( "#tr_5" ).hide();
				that.selector.find( "#tr_6" ).show();
				that.selector.find( "#clearBtn_cmp" ).show();
			}
		};
		
		
		handlers.tabelFieldSlct = function(tablename)
		{
			var that = this.global();//获取组件的全局对象
			that.selector.find( "input[name=tableField]" ).select( {
				itemLabel: "label",
				itemValue: "val",
				remote: {
					params:{tablename:tablename},
					url: "pub/asysatt/getListTableField",
					type: 'POST'
				}
			} );
		};
		
	};
	
	
	
	return Global;
});