var socket;
var ola_queue = "default";
var ola_extn = "1008";	
function init() {
    var options = {port: 7878,transports: ['websocket', 'flashsocket']};
    socket = new ola.Socket(document.location.hostname, options);
    socket.on('message', function(data){
    if (data.event_type == "agent_state") {
            if(data.state == "unready")
            {
            	alert("登录成功");
            }
            else if (data.state == "busy") {
                   /// $('#agent_state').append(" (" + data.private_data + ")");

                    if (data.private_data == "ring") {
                    	/*
                            $('#caller_id').html(data.other_dn);
                            $('#dest_number').html(data.dnis);
                            $('#incoming_call').css("background-color", "blue");
                            $('#incoming_call').show();
                       */     
                       alert("-----");

                    } else if (data.private_data == "answered") {
                    	/*
                            $('#incoming_call').css("background-color", "red");
                            $('#transfer_button').show();
                      */
                    }
            } else if (data.old_state == "busy") {
            	/*
                    $('#incoming_call').hide();
                    $('#external_api_page').hide();
                    $('#transfer_button').hide();
                    
                    */
            }
    } else if (data.event_type == "agent_caller_state") {
            if (data.action == "in") {
            	/*
                    $('#caller_queue').append(
                            " <a id='" + data.caller.uuid +
                                    "' href='#' onclick=\"take_call('" +
                                    data.caller.uuid + "');return false;\">" + data.caller.cid_number +"</a>");
             */                       
            } else {
                   /* $("#" + data.caller.uuid).remove();*/
            }
    } else if (data.event_type == "command_reply") {
           // $('#agent_state').html(data.state);
           // $('#ola_functions').attr("class", data.state);
    }
    });
    socket.on('connect', function(){
           // $('#status').html("Connected").css("color", "green");
            socket.subscribe('ola.queue.' + ola_queue + '.' +  ola_extn);
            socket.subscribe('ola.caller.' +  ola_extn);
            socket.get_agent_state(ola_extn);
            //log("connect type: " + socket.transport().type);
    });

    socket.on('disconnect', function(){
           // $('#status').html("Disconnected").css("color", "red");
    });

  }

  $(document).ready(function() {
          init();
          socket.connect();
  });

  function login() {
          var ret;
          ret  = socket.login(ola_queue, ola_extn, {type: "onhook"});
          return ret;
  }

function iniOnclick() {
	/* 按钮签入 */

	  try{
	  	var ret = login();
		}
		catch(e)
		{
			alert(e);
			return ;
		}
	  socket.go_ready(ola_extn);
}