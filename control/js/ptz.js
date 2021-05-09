

var ws = new WebSocket("ws://192.168.1.106:8765")

function zoom_tele() {
	command = {
			"type" : "fixed",
			"command" : "zoom_tele",
			};
	console.log(command);
	ws.send(JSON.stringify(command));		
}

function zoom_wide() {
	command = {
			"type" : "fixed",
			"command" : "zoom_wide",
			};
	console.log(command);
	ws.send(JSON.stringify(command));		
}

function zoom_stop() {
	command = {
			"type" : "fixed",
			"command" : "zoom_stop",
			};
	console.log(command);
	ws.send(JSON.stringify(command));		
}

function set_preset(n) {
		command = {
			"type" : "set",
			"value" : n,
			};
	console.log(command);
	ws.send(JSON.stringify(command))
	}
	
function preset(n) {
		command = {
			"type" : "recall",
			"value" : n,
			};
	console.log(command);
	ws.send(JSON.stringify(command))
	}
function checkJoy() {
	 direction = Joy1.GetDir();
	 tilt_speed = Math.abs(Joy1.GetY()) -2 ; 
	 pan_speed = Math.abs(Joy1.GetX()) -2;
	if (pan_speed < 0) {
		pan_speed = 0;
	}
	if (tilt_speed < 0) {
		tilt_speed = 0;
	}
	
	pan_speed = Math.floor(pan_speed /8);
	tilt_speed = Math.floor(tilt_speed/8);
	
	 joy1X.value= pan_speed;
	 joy1Y.value= tilt_speed;
	 joy1Direzione.value= direction;
	 
	 if (direction != "stop" && pan_speed != pre_pan_speed ) {
		 command = {
			"type" : "pan_" + direction,
			"tilt_speed" : tilt_speed,
			"pan_speed" : pan_speed
			};
		 console.log(command);
		 ws.send(JSON.stringify(command));
		 pre_pan_speed = pan_speed;
		 pre_direction = direction;
	 }
	 
	  if (direction != "stop" && tilt_speed != pre_tilt_speed ) {
		 command = {
			 "type" : "pan_" + direction, 
			 "tilt_speed" : tilt_speed, 
			 "pan_speed" : pan_speed
			 };
		 console.log(command);
		 ws.send(JSON.stringify(command));
		 pre_tilt_speed = tilt_speed;
		 pre_direction = direction;
	 }
	 
	 if (direction == "stop" && direction != pre_direction) {
		 command = {
			"type" : "pan_" + direction,
			"tilt_speed" : tilt_speed, 
			"pan_speed" : pan_speed
		};
		 console.log(command);
		 ws.send(JSON.stringify(command));
		 pre_direction = direction;
	 }
		 
		 
}
