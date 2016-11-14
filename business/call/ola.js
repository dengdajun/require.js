var ola = {
	version : '1.3.3'
};

(function() {

	var ola = this.ola;

	function delegate(klazz, args, obj_name) {
		for(var i = 0; i < args.length ; i++) {
			var method = args[i];

			klazz.prototype[method] = (function(fn, obj){
				return function() {
					var ret = this[obj][fn].apply(this[obj], arguments);
					return ret;
				};
			})(method, obj_name);
		}
	}

	var Socket = ola.Socket = function(host, options) {
		if (ola.socket) {
			alert("already created an ola socket instance");
		}
		this.socket = new io.Socket(host, options);
		this.uuid = "ola-msg-0000000000";
	}

	Socket.gen_uuid = function() {
	    var S4 = function() {
	       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	    };
	    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	}

	Socket.prototype = {

		test: function() {
			return this.send({msg: "test"})
		},

		subscribe :function(k) {
			return this.send({action:"subscribe", key:k});
		},

		unsubscribe :function(k) {
			return this.send({action:"unsubscribe", key:k});
		},

		get_queue: function(q) {
			return this.send({action:"api", cmd:"get_queue", args:{queue: q}});
		},

		require_queued_message: function(q) {
			return this.send({action:"api", cmd:"require_call_queued_message", args:{queue: q}});
		},

		get_agents: function() {
			return this.send({action:"api", cmd:"get_agents", args:{}});
		},

		get_agent_state: function(ext) {
			return this.send({action:"api", cmd:"get_agent_state", args:{extn: ext}});
		},

		login : function(q, ext, params) {
			var args = {queue:q, extn: ext};
			this.merge(args, params);
			return this.send({action:"api", cmd:"login", args: args });
		},

		logout : function(ext) {
			return this.send({action:"api", cmd:"logout", args:{extn: ext}});
		},

		go_ready : function(ext) {
			return this.send({action:"api", cmd:"go_ready", args:{extn: ext}});
		},

		go_break : function(ext) {
			return this.send({action:"api", cmd:"go_break", args:{extn: ext}});
		},

		toggle_ready : function(ext) {
			return this.send({action:"api", cmd:"toggle_ready", args:{extn: ext}});
		},

		answer : function(ext) {
			return this.send({action:"api", cmd:"answer", args:{extn: ext}});
		},

		hangup : function(ext) {
			return this.send({action:"api", cmd:"hangup_other", args:{extn: ext}});
		},

		dial : function(ext, dst) {
			return this.send({action:"api", cmd:"dial", args:{extn: ext, dest: dst}});
		},

		transfer : function(ext, dst) {
			return this.send({action:"api", cmd:"transfer", args:{extn:ext, dest:dst}});
		},

		transfer_uuid : function(uuid, dst) {
			return this.send({action:"api", cmd:"transfer", args:{channel_uuid:uuid, dest:dst}});
		},

		monitor : function(ext, dst) {
			return this.send({action:"api", cmd:"monitor", args:{extn: ext, dest: dst}});
		},

		monitor_uuid: function(ext, uuid) {
			return this.send({action:"api", cmd:"monitor", args:{extn: ext, channel_uuid: uuid}});
		},

		intercept_uuid: function(ext, uuid) {
			return this.send({action:"api", cmd:"intercept", args:{extn: ext, channel_uuid: uuid}});
		},

		three_way : function(ext, dst) {
			return this.send({action:"api", cmd:"monitor", args:{extn: ext, dest: dst, three_way:"true"}});
		},

		three_way_uuid : function(ext, uuid) {
			return this.send({action:"api", cmd:"monitor", args:{extn: ext, channel_uuid: uuid, three_way:"true"}});
		},

		unmonitor : function(ext) {
			return this.send({action:"api", cmd:"unmonitor", args:{extn: ext}});
		},

		whisper : function(ext, w) {
			// who = "agent" / "caller" / "both" / "none"
			return this.send({action:"api", cmd:"whisper", args:{extn: ext, who: w}});
		},

		consult : function(ext, dst) {
			return this.send({action:"api", cmd:"consult", args:{extn: ext, dest: dst}});
		},

		hold : function(ext) {
			return this.send({action:"api", cmd:"hold", args:{extn: ext}});
		},

		unhold : function(ext, dst) {
			return this.send({action:"api", cmd:"unhold", args:{extn: ext}});
		},

		toggle_hold : function(ext) {
			return this.send({action:"api", cmd:"toggle_hold", args:{extn: ext}});
		},

		take_call : function(ext, channel_uuid) {
			return this.send({action:"api", cmd:"take_call", args:{extn: ext, channel_uuid:channel_uuid}});
		},

		conference : function(ext, dst) {
			return this.send({action:"api", cmd:"conference", args:{extn: ext, dest: dst}});
		},

		conference_uuid : function(ext, uuid) {
			return this.send({action:"api", cmd:"conference", args:{extn: ext, channel_uuid: uuid}});
		},

		broadcast : function(ext, numbers, mute) {
			return this.send({action:"api", cmd:"broadcast", args:{extn: ext, numbers: numbers, mute:mute}});
		},

		/* send chat to a queue or an agent
		  to = queue             send to queue
		  to = queue.agent       send to agent
		*/
		chat: function (to, message, content_type) {
			return this.send({action:"api", cmd:"chat", args:{to:to, message:message, content_type:content_type}});
		},

		message: function (from, to, message, content_type) {
			return this.send({action:"api", cmd:"message", args:{from:from, to:to, message:message, content_type:content_type}});
		},

		alarm: function (queue, state) {
			return this.send({action:"api", cmd:"alarm", args:{queue:queue, state:state}});
		},

		/* dispatching apis */

		dlogin: function (ext) {
			return this.send({action:"api", cmd:"dlogin", args:{extn: ext}});
		},

		dlogout: function (ext) {
			return this.send({action:"api", cmd:"dlogout", args:{extn: ext}});
		},

		inject: function (ext, uuid) {
			return this.send({action:"api", cmd:"inject", args:{extn: ext, channel_uuid: uuid}});
		},

		kill: function(uuid, cause) {
			return this.send({action:"api", cmd:"kill", args:{channel_uuid: uuid, cause: cause}});
		},

		eavesdrop: function(uuid) {
			return this.send({action:"api", cmd:"eavesdrop", args:{channel_uuid: uuid}});
		},

		conf: function(name, action, member) {
			return this.send({action:"api", cmd:"conf", args:{name: name, action:action, member:member}});
		},

		answer_all: function(ext, queue) {
			return this.send({action:"api", cmd:"answer_all", args:{extn: ext, queue:queue}});
		},

		group_call: function(ext, queue, numbers) {
			return this.send({action:"api", cmd:"group_call", args:{extn: ext, queue:queue, numbers:numbers}});
		},

		sip_gateway: function (profile, gateway, op) {
			return this.send({action:"api", cmd:"sip_gateway", args:{profile:profile, gateway:gateway, op:op}});
		},

		play: function (conference, filename) {
			return this.send({action:"api", cmd:"play", args:{conference:conference, filename:filename}});
		},

		stop_play: function (conference, filename) {
			return this.send({action:"api", cmd:"play", args:{conference:conference, filename:filename}});
		},

		merge_call: function(ext1, ext2) {
			return this.send({action:"api", cmd:"merge_call", args:{extn1:ext1, extn2:ext2}});
		},

		/* common apis*/

		/*phone control api, only yealink support for now*/
		api_handfree: function (ext) {
			return this.send({action:"api", cmd:"api_handfree", args:{extn: ext}});
		},

		send : function(msg) {
			/* while this.next_uuid() is more straight forwoard,
			   it rewinds to 0000000000 on every 2147483647 times,
			   use the Socket version for long running sockets and true unique IDs

				msg.uuid = Socket.gen_uuid();

			*/
			msg.uuid = this.next_uuid();
			this.socket.send(msg);
			return msg.uuid;
		},

		next_uuid : function() {
			var u = (parseFloat(this.uuid.substring(8)) + 1).toString();
			u = u == "2147483647" ? "0" : u;
			while(u.length < 10) { u = "0" + u;	}
			this.uuid = "ola-msg-" + u;
			return this.uuid;
		},

		// original socket attributes
		transport : function() {
			return this.socket.transport;
		},

		connected : function() {
			return this.socket.connected;
		},

		merge: function(target, additional){
			for (var i in additional) {
				if (additional.hasOwnProperty(i)) {
					target[i] = additional[i];
				}
			}
		},

		execute_after_connected: function(func){
			if (this.connected()) {
				func();
			} else {
				this.socket.on("connect", func)
			}
		}

	}

	delegate(Socket, ["on", "connect", "disconnect", "getTransport", "haha"], "socket");

})();

/**
 * Expose Socket.IO in jQuery
 */

if ('jQuery' in this) jQuery.ola = this.ola;
