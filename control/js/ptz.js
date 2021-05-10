var ws = new WebSocket("ws://192.168.1.106:8765")
 document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    }, false);

$(document).ready(function(){
  $(".ptz_fixed").click(function(){
	  visca_fixed(this.id);
  
  });
  
   $(".preset").click(function(){
	  preset(this.id);
  
  });
  
   $(".switcher").click(function(){
	  switcher(this.id);
  
  });
  
  $(".ptz_pt").mousedown(function(){
		console.log(this.id);
		pan_tilt(this.id,1);
  });
  
   $(".ptz_pt").mouseup(function(){
		console.log("stop");
		pan_tilt("stop",1);
  });
  
     $(".ptz_pt").mouseout(function(){
		console.log("stop");
		pan_tilt("stop",1);
  })
  
    $(".ptz_zoom").mousedown(function(){
		console.log(this.id);
		zoom(this.id,1);
  });
   $(".ptz_zoom").mouseup(function(){
		console.log("stop");
		zoom("stop",1);
  });
});


function switcher(command) {
	command = {
			"type" : "switcher",
			"input" : parseInt(command)
			};
	console.log(command, "visca");
	ws.send(JSON.stringify(command));		
}

function visca_fixed(command) {
	command = {
			"type" : "fixed",
			"command" : command
			};
	console.log(command, "visca");
	ws.send(JSON.stringify(command));		
}

function zoom(direction) {
	command = {
			"type" : "fixed",
			"command" : "zoom_" + direction
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
	

function pan_tilt(direction, speed) {
		
	pan_speed = speed;
	tilt_speed = speed;
		 
	 if (direction != "stop") {
		 command = {
			"type" : "pan_" + direction,
			"tilt_speed" : tilt_speed,
			"pan_speed" : pan_speed
			};
		 console.log(command);
		 ws.send(JSON.stringify(command));
		 pre_pan_speed = pan_speed;
		 pre_direction = direction;
	 } else {
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
