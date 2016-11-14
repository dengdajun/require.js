<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link type="text/css" href="lib/jquery-ui-1.8.4.custom/css/smoothness/jquery-ui-1.8.4.custom.css" rel="stylesheet" />
<link type="text/css" href="myflow.by.css" rel="stylesheet" />
<script type="text/javascript" src="lib/raphael-min.js"></script>
<script type="text/javascript" src="lib/jquery-ui-1.8.4.custom/js/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="lib/jquery-ui-1.8.4.custom/js/jquery-ui-1.8.4.custom.min.js"></script>
<script type="text/javascript" src="myflow.js"></script>
<script type="text/javascript" src="myflow.jpdl4.js"></script>
<script type="text/javascript" src="myflow.editors.js"></script>
<script type="text/javascript" src="myflow.by.js"></script>
</head>
<body>
<div id="myflow_tools"
	style="position: absolute; top: 10; left: 10; background-color: #fff; width: 70px; cursor: default; padding: 3px;"
	class="ui-widget-content">
<div id="myflow_tools_handle" style="text-align: center;"
	class="ui-widget-header">工具集</div>


<div class="node" id="myflow_save"><img src="img/save.gif" />&nbsp;&nbsp;保存</div>
	<div>
		<hr />
	</div>
	<!-- <div class="node selectable" id="pointer"><img
		src="img/select16.gif" />&nbsp;&nbsp;选择</div> -->
	<div class="node selectable" id="path"><img
		src="img/16/flow_sequence.png" />&nbsp;&nbsp;转换</div>
	<div>
		<hr />
	</div>
	
	<!-- <div class="node state" id="start" type="start"><img
		src="img/16/start_event_empty.png" />&nbsp;&nbsp;开始</div>
	<div class="node state" id="state" type="state"><img
		src="img/16/task_empty.png" />&nbsp;&nbsp;状态</div> -->
	<div class="node state" id="task" type="task"><img
		src="img/16/task_empty.png" />&nbsp;&nbsp;任务</div>
	<!-- <div class="node state" id="fork" type="fork"><img
		src="img/16/gateway_parallel.png" />&nbsp;&nbsp;分支</div>
	<div class="node state" id="join" type="join"><img
		src="img/16/gateway_parallel.png" />&nbsp;&nbsp;合并</div>
	<div class="node state" id="end" type="end"><img
		src="img/16/end_event_terminate.png" />&nbsp;&nbsp;结束</div>
	<div class="node state" id="end-cancel" type="end-cancel"><img
		src="img/16/end_event_cancel.png" />&nbsp;&nbsp;取消</div>
	<div class="node state" id="end-error" type="end-error"><img
		src="img/16/end_event_error.png" />&nbsp;&nbsp;错误</div> -->
	
</div>

<div id="myflow_props"
	style="position: absolute; top: 30; right: 50; background-color: #fff; width: 220px; padding: 3px;"
	class="ui-widget-content">
	<div id="myflow_props_handle" class="ui-widget-header">属性</div>
	<table border="1" width="100%" cellpadding="0" cellspacing="0">
		<tr>
			<td>aaa</td>
		</tr>
		<tr>
			<td>aaa</td>
		</tr>
	</table>
	<div>&nbsp;</div>
</div>
<input type="hidden" name="nodeTypeId" id="nodeTypeId" value="123" />
<div id="myflow"></div>

<!-- 备注信息 -->
<div id="myflow_remark" style="position: absolute; top: -600; left: 10; background-color: #fff; width: 1024px;padding: 3px;">
	<div id="myflow_remark_handle" style="text-align: center;"
	class="ui-widget-header">说明</div>
	1  
	2
</div>

</body>
</html>