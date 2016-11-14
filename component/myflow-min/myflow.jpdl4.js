(function($){
var myflow = $.myflow;

if ( typeof myflow.config.absolutePath != "string" ) {
	myflow.config.absolutePath = "assets/component/myflow-min/";
}

var absolutePath = myflow.config.absolutePath;

$.extend(true,myflow.config.rect,{
	attr : {
	r : 8,
	fill : '#F6F7FF',
	stroke : '#03689A',
	"stroke-width" : 2
}
});

$.extend(true,myflow.config.props.props,{
	name : {name:'name', label:'流程名称', value:'新建流程', editor:function(){return new myflow.editors.inputEditor();}},
	key : {name:'key', label:'流程代码', value:'', editor:function(){return new myflow.editors.inputEditor();}},
	appPage : {name:'appPage', label:'系统代码', value:'', editor:function(){return new myflow.editors.inputEditor();}},
	appName : {name:'appName', label:'系统名称', value:'', editor:function(){return new myflow.editors.inputEditor();}},
	appUrl : {name:'appUrl', label:'系统登录URL', value:'', editor:function(){return new myflow.editors.inputEditor();}},
	wftype : {name:'wftype', label:'流程分类', value:'', editor:function(){return new myflow.editors.dynamicSelectCodeEditor( "Work_Flow_Type", {} );}},
	del : {name:'del', label:'是否删除', value:'', editor:function(){return new myflow.editors.dynamicSelectCodeEditor( "Is_No", "13900002" );}},
	desc : {name:'desc', label:'描述', value:'', editor:function(){return new myflow.editors.inputEditor();}}
});


if ( typeof myflow.editors.dynamicSelectCodeEditor ) {
	myflow.editors.dynamicSelectCodeEditor = myflow.editors.selectEditor;
}

if ( typeof myflow.editors.dynamicSelectPopupEditor ) {
	myflow.editors.dynamicSelectPopupEditor = myflow.editors.inputEditor;
}

$.extend(true,myflow.config.tools.states,{
	start : {
				showType: 'image',
				type : 'start',
				name : {text:'<<start>>'},
				text : {text:'开始'},
				img : {src : absolutePath + 'img/48/start_event_empty.png',width : 48, height:48},
				attr : {width:50 ,heigth:50 },
				props : {
					text: {name:'text',label: '显示', value:'', editor: function(){return new myflow.editors.textEditor();}, value:'开始'},
					temp1: {name:'temp1', label : '文本', value:'', editor: function(){return new myflow.editors.inputEditor();}},
					temp2: {name:'temp2', label : '选择', value:'', editor: function(){return new myflow.editors.selectEditor([{name:'aaa',value:1},{name:'bbb',value:2}]);}}
				}},
			end : {showType: 'image',type : 'end',
				name : {text:'<<end>>'},
				text : {text:'结束'},
				img : {src : absolutePath + 'img/48/end_event_terminate.png',width : 48, height:48},
				attr : {width:50 ,heigth:50 },
				props : {
					text: {name:'text',label: '显示', value:'', editor: function(){return new myflow.editors.textEditor();}, value:'结束'},
					temp1: {name:'temp1', label : '文本', value:'', editor: function(){return new myflow.editors.inputEditor();}},
					temp2: {name:'temp2', label : '选择', value:'', editor: function(){return new myflow.editors.selectEditor([{name:'aaa',value:1},{name:'bbb',value:2}]);}}
				}},
			'end-cancel' : {showType: 'image',type : 'end-cancel',
				name : {text:'<<end-cancel>>'},
				text : {text:'取消'},
				img : {src : absolutePath + 'img/48/end_event_cancel.png',width : 48, height:48},
				attr : {width:50 ,heigth:50 },
				props : {
					text: {name:'text',label: '显示', value:'', editor: function(){return new myflow.editors.textEditor();}, value:'取消'},
					temp1: {name:'temp1', label : '文本', value:'', editor: function(){return new myflow.editors.inputEditor();}},
					temp2: {name:'temp2', label : '选择', value:'', editor: function(){return new myflow.editors.selectEditor([{name:'aaa',value:1},{name:'bbb',value:2}]);}}
				}},
			'end-error' : {showType: 'image',type : 'end-error',
				name : {text:'<<end-error>>'},
				text : {text:'错误'},
				img : {src : absolutePath + 'img/48/end_event_error.png',width : 48, height:48},
				attr : {width:50 ,heigth:50 },
				props : {
					text: {name:'text',label: '显示', value:'', editor: function(){return new myflow.editors.textEditor();}, value:'错误'},
					temp1: {name:'temp1', label : '文本', value:'', editor: function(){return new myflow.editors.inputEditor();}},
					temp2: {name:'temp2', label : '选择', value:'', editor: function(){return new myflow.editors.selectEditor([{name:'aaa',value:1},{name:'bbb',value:2}]);}}
				}},
			state : {showType: 'text',type : 'state',
				name : {text:'<<state>>'},
				text : {text:'状态'},
				img : {src : absolutePath + 'img/48/task_empty.png',width : 48, height:48},
				props : {
					text: {name:'text',label: '显示', value:'', editor: function(){return new myflow.editors.textEditor();}, value:'状态'},
					temp1: {name:'temp1', label : '文本', value:'', editor: function(){return new myflow.editors.inputEditor();}},
					temp2: {name:'temp2', label : '选择', value:'', editor: function(){return new myflow.editors.selectEditor([{name:'aaa',value:1},{name:'bbb',value:2}]);}}
				}},
			fork : {showType: 'image',type : 'fork',
				name : {text:'<<fork>>'},
				text : {text:'分支'},
				img : {src : absolutePath + 'img/48/gateway_parallel.png',width :48, height:48},
				attr : {width:50 ,heigth:50 },
				props : {
					text: {name:'text', label: '显示', value:'', editor: function(){return new myflow.editors.textEditor();}, value:'分支'},
					temp1: {name:'temp1', label: '文本', value:'', editor: function(){return new myflow.editors.inputEditor();}},
					temp2: {name:'temp2', label : '选择', value:'', editor: function(){return new myflow.editors.selectEditor('select.json');}}
				}},
			join : {showType: 'image',type : 'join',
				name : {text:'<<join>>'},
				text : {text:'合并'},
				img : {src : absolutePath + 'img/48/gateway_parallel.png',width :48, height:48},
				attr : {width:50 ,heigth:50 },
				props : {
					text: {name:'text', label: '显示', value:'', editor: function(){return new myflow.editors.textEditor();}, value:'合并'},
					temp1: {name:'temp1', label: '文本', value:'', editor: function(){return new myflow.editors.inputEditor();}},
					temp2: {name:'temp2', label : '选择', value:'', editor: function(){return new myflow.editors.selectEditor('select.json');}}
				}},
			task : {showType: 'text',type : 'task',
				name : {text:'<<task>>'},
				text : {text:'任务'},
				img : {src : absolutePath + 'img/48/task_empty.png',width :48, height:48},
				props : {
					text: {name:'text', label: '节点名称', value:'', editor: function(){return new myflow.editors.textEditor();}, value:'节点名称'},
					nodeKey: {name:'nodeKey', label : '节点代码', value:'', editor: function(){return new myflow.editors.inputEditor();}},
					nodeKind: {name:'nodeKind', label : '节点类型', value:'', editor: function(){return new myflow.editors.dynamicSelectCodeEditor( "Pr_Eng_Node_Type", {} );}},
					serarchKind: {name:'serarchKind', label : '搜索类型', value:'', editor: function(){return new myflow.editors.dynamicSelectCodeEditor( "Pr_Eng_Data_Serc_Type", {} );}},
//					roleCode: {name:'roleCode', label : '角色代码', value:'', editor: function(){
//						return new myflow.editors.dynamicSelectPopupEditor( "safety/sysinfo/seletuser", {
//							labelKey: "userName",
//							valueKey: "loginName"
//						} );
//					}},
					roleCode: {name:'roleCode', label : '角色代码', value:'', editor: function(){
						return new myflow.editors.dynamicSelectPopupEditor( "pub/asysatt/commTreeSlctform", {
							multi:true,
							labelKey: "userName",
							valueKey: "userNo",
							orgUserRole:"role"
						} );
					}},
					orgCode: {name:'orgCode', label : '机构代码', value:'', editor: function(){
						return new myflow.editors.dynamicSelectPopupEditor( "pub/asysatt/commTreeSlctform", {
							multi:true,
							labelKey: "userName",
							valueKey: "userNo",
							orgUserRole:"org"
						} );
					}},
					assignee: {name:'assignee', label: '审批人', value:'', editor: function(){
						return new myflow.editors.dynamicSelectPopupEditor( "pub/asysatt/commTreeSlctform", {
							multi:true,
							labelKey: "userName",
							valueKey: "userNo",
							orgUserRole:"user"
						} );
					}},
					nodeURL: {name:'nodeURL', label : '链接地址', value:'', editor: function(){return new myflow.editors.inputEditor();}},
					nodeIndex: {name:'nodeIndex', label : '节点索引', value:'', editor: function(){return new myflow.editors.inputEditor();}},
					nextNodeIndex: {name:'nextNodeIndex', label : '下级节点索引', value:'', editor: function(){return new myflow.editors.inputEditor();}},
					prevNodeIndex: {name:'prevNodeIndex', label : '上级节点索引', value:'', editor: function(){return new myflow.editors.inputEditor();}},
					searchType: {name:'searchType', label : '查找类型', value:'', editor: function(){return new myflow.editors.dynamicSelectCodeEditor( "Pr_Eng_Node_Serc_Type", "17500001" );}},
					examType: {name:'examType', label : '策略类型', value:'', editor: function(){return new myflow.editors.dynamicSelectCodeEditor( "Pr_Eng_Node_Appr_Type", "17600001" );}},
					busiStat: {name:'busiStat', label : '业务状态', value:'', editor: function(){return new myflow.editors.inputEditor();}},
//					busiStat: {name:'busiStat', label : '业务状态', value:'', editor: function(){return new myflow.editors.dynamicSelectCodeEditor( "Sm_Case_Stat", {} );}},
//					busiStat: {name:'busiStat', label : '业务状态', value:'', editor: function(){
//						return new myflow.editors.dynamicSelectPopupEditor( "pub/asysatt/commTreeSlctBusiStatForm", {
//							multi:true,
//							labelKey: "userName",
//							valueKey: "userNo",
//							orgUserRole:"role"
//						} );
//					}},
					lastNode: {name:'lastNode', label : '最后节点', value:'', editor: function(){return new myflow.editors.dynamicSelectCodeEditor( "Is_No", "13900002" );}},
					
					form: {name:'form', label : '表单', value:'', editor: function(){return new myflow.editors.inputEditor();}},
					desc: {name:'desc', label : '描述', value:'', editor: function(){return new myflow.editors.inputEditor();}}
				}}
});
})(jQuery);