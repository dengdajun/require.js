/** 电话系统js常量 start*/
//电话系统IP
var OLA_IP = '114.55.4.247';
//电话系统端口
var OLA_PORT = 7878;
//队列（默认）
var OLA_QUEUE = 'default';
//策略-默认挂机状态
var STRATEGY = "onhook";
/** 电话系统js常量  end*/

var socket;
//var ola_extn = '1100';
var call_id="";

//电话系统初始化
function ola_init() {
	var options = {port: OLA_PORT,transports: ['websocket', 'flashsocket']};
	socket = new ola.Socket(OLA_IP, options);
	
	socket.on('message', function(data){
		call_id=data.call_id;
		console.log( "message" );
		console.log( arguments );
	});
	socket.on('connect', function(){   //websocket 连上时订阅消息
		console.log( "connect" );
		console.log( arguments );
		socket.get_agent_state("1100");
	});

	socket.on('disconnect', function(){
		console.log( "disconnect" );
		console.log( arguments );
	});
	
	socket.connect();
}

//签入 ola_extn：分机号
function ola_login(ola_extn) {
	try{		
		socket.login(OLA_QUEUE, ola_extn, {type: STRATEGY});
	}catch (e) {
		alert(e);
	}
}
//示闲
function ola_go_ready(ola_extn){
	socket.go_ready(ola_extn);
}

function ola_take_call(ola_extn,uuid) {
	socket.take_call(ola_extn, uuid);
}

function ola_trans_phone(ola_extn,mon_nbr)
{
	socket.transfer(ola_extn,mon_nbr);
}

//呼叫 ola_extn：分机号；phoneNum：手机号
function ola_dial(ola_extn,phoneNum)
{
	socket.dial(ola_extn, phoneNum);
}