//( function() {
//	
//	/**
//	 * 加载OLA连接
//	 * @param url {string} 路径 访问ola文件资源路径 注意
//	 * @param callkbak {function} 回调函数 参数OLA
//	 */
//	function load( url, callback ) {
//		url += "ola.connect.html";
//		var id = name = "IFRAME" + ( "" + Math.random() ).substring( 2 );
//		var $iframe = $( '<iframe src="' + url + '" id="' + id + '" name="' + name + '" style="display:none; width: 1px; height: 1px;"/>' ).appendTo( "body" );
//		
//		$iframe.bind( "load", function( event ) {
//			var OLA = window.frames[ name ].OLA;
//			callback( OLA );
//		} );
//	} 
//	console.log(1);
//	$( function() {
//		load( "assets/business/call/", function( OLA ) {
//			console.log(2);
//			window.ola = new OLA({
//				ola_extn: "", //分机号
//				ola_queue: "" //队列编号
//			});
//			console.log(3);
//		} );
//	} );
//	console.log(4);
//} )();
define([
"jquery",
"assets/business/call/ola",
"assets/business/call/socket.io",
"assets/business/call/jquery-ui-1.8.16.custom.min"
],function($){
		//============================
		// 电话接口封装
		// @author hemf
		// @date 2016.03.15
		//============================
		var $ = require("jquery"), base = require("app/base"), message = base.message, tools = base.tools;
		//公共参数
		var defaults = {
			server: "114.55.4.247", //服务地址
			port: 7878, //端口号
			transports: ['websocket', 'flashsocket'], //传输协议
			ola_queue: "100162", //消息队列 消息渠道
			ola_extn: "1100", //分机号
			params: {type: "onhook"} //其他参数
		};
		
		var stat = "";
		/**
		 * OLA构造函数
		 * @param options {object:map} 参数 参照defaults
		 */
		function OLA( options ) {
			var olaObj = this;
			this.socket = false;
			
			var opts = this.opts = $.extend( true, {}, defaults, options );
			//创建连接
			var socket = this.socket = new ola.Socket( opts.server, {
				port: opts.port,
				transports: opts.transports
			} );
			
			//监听消息
			this.socket.on( "message", function( data ) {
				if (data.event_type == "agent_state") {
					stat = data.state;
					if (data.state == "busy") { 
						if (data.private_data == "ring") { //来电
//	 						if ( confirm( "是否结束：分机号[ "+ opts.ola_extn +" ]占线中(报铃中)...") ) {
//	 							olaObj.logout();
//	 						};
						} else if(data.private_data == "calling") {//去电
							message.success("电话已拨通");
						} else  if(data.private_data == "answered") {//接听
							message.success("电话已接听");
						}
					} else if (data.old_state == "busy") {   
						//坐席的旧状态是忙
						socket.go_ready( opts.ola_extn );
					} 
				}else if(data.event_type == "command_reply"){
					if(data.cmd == "dial" && data.code == "200"){
						message.success("电话呼叫成功，请接听");
					}
				}
				
				if ( window.console && window.console.log ) {
					window.console.log(data);
				}
			} );
			
			//监听连接 创建订阅 刷新分机状态
			this.socket.on( "connect", function() {
				socket.subscribe('ola.queue.' + opts.ola_queue + '.' +  opts.ola_extn);
				socket.subscribe('ola.caller.' +  opts.ola_extn);
				socket.get_agent_state(opts.ola_extn);
//				socket.logout( opts.ola_extn );
			} );
			
			//监听断开
			this.socket.on( "disconnect", function() {
				message.error("电话系统已断开连接，如需拨打电话，请重新登陆");
			} );
			
			this.socket.connect();
			
		};
		
		/**
		 * 注销电话接口
		 */
		OLA.prototype.logout = function() {
			var opts = this.opts;
			this.socket.logout( opts.ola_extn );
		};
		
		
		/**
		 * 拨打接口
		 * @param phone 电话号码
		 */
		OLA.prototype.call = function( phone ) {
			var opts = this.opts;
			if(null == opts.ola_extn || opts.ola_extn == ''){
				message.error("您没有绑定分机号");
				return;
			}
//	 		this.socket.unhold( opts.ola_extn );
//	 		this.socket.go_break( opts.ola_extn );
			this.socket.logout( opts.ola_extn );
			this.socket.login( opts.ola_queue, opts.ola_extn, opts.params );
			this.socket.go_ready( opts.ola_extn );
			this.socket.dial( opts.ola_extn, phone );
		};
		
		/**
		 * 初始化
		 */
		OLA.prototype.init = function() {
			var opts = this.opts;
			this.socket.login( opts.ola_queue, opts.ola_extn, opts.params );
			this.socket.go_ready( opts.ola_extn );
		};
		
		window.onbeforeunload = function() {
			var opts = this.opts;
			this.socket.logout(opts.ola_extn);
		} ;	
		return OLA;
});

