define([
"jquery",
"bootstrap",
"bootstrap.datetimepicker",//时间选择控件
"locales",//moment时间处理
"additional.methods",//validate验证控件
"app/extend/validate.method.extend",
"toastr",//消息提示
"ztree.all",//ztree
"app/core",
"app/ui/code",
"app/ui/cursor.position",
//"app/ui/date",
"app/ui/dialog",
"app/ui/file.upload",
"app/ui/form",
"app/ui/grid",
"app/ui/input.date",
"app/ui/modal",
"app/ui/module",
"app/ui/page",
"app/ui/placeholder",
"app/ui/popup",
"app/ui/shiro",
"app/ui/select",
"app/ui/select.area",
"app/ui/select.area.tab",
"app/ui/select.group",
"app/ui/select.tree"
],function(){
	
	function Global(){
		var that = this;
		that.vars = {};
		
		var $ = require( "jquery" )
		, base = require( "app/base" )
		, message = base.message
		, tools = base.tools;
		var moment = require( "moment" );
		base.code.cache( "Is_No");
	
		
		that.init = function(){
			this.layout();
		}
		that.layout = function() {

			var proGridConfig = {
				remote: {
		        	url: "test/list",
		            params: {}
		        },
		        multi: true,
		        page: {
		        	pageSize: 10
		        },
		        query: {
		        	isExpand:true,
		        	target: $( ".grid-query" )
		        },
		        plugins: [],
		        customEvents: []
			};
			proGridConfig.cols = cols = [];
			cols[ cols.length ] = { title: "编号", name: "prodNo", width: "150px", lockWidth: true };
			cols[ cols.length ] = { title: "名称", name: "prodName", width: "200px", lockWidth: true };
			cols[ cols.length ] = { title: "开始时间", name: "startDate", width: "100px", lockWidth: true,align:'center',
					renderer: function( val, item, rowIndex ) {return moment(val).format("YYYY-MM-DD");}
			};
			cols[ cols.length ] = { title: "结束时间", name: "endDate", width: "100px", lockWidth: true,align:'center',
					renderer: function( val, item, rowIndex ) {return moment(val).format("YYYY-MM-DD");}
			};
			cols[ cols.length ] = { title: "状态", name: "prodStat", width: "60px", lockWidth: true,align:'center',
					renderer: function( val, item, rowIndex ) {return base.code.getText( "Prod_State", val );}
			};
			cols[ cols.length ] = { title: "产品说明", name: "prodRemark", mouseover:true };
			cols[ cols.length ] = { title: "操作", name: "id", width: "120px", lockWidth: true,align:'center', renderer: function( val, item, rowIndex ) {
				var claName = item.prodStat=="16500002"?"下架":"上架";
				//var cla = item.prodStat=="16500002"?"on":"off";
				return format( [ '<a href="javascript:;" class="pro-toggle"><i class="fa fa-arrows-v"></i>'+claName+'</a>&nbsp;&nbsp;<a href="javascript:;" class="pro-calc"><i class="fa fa-calculator"></i>试算</a>' ] );
			} };
			that.vars.proGrid = $( "#proGrid" ).grid( proGridConfig );
		
		};
	}
	return Global;
});