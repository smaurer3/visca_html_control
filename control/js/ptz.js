
var ws = null;
var connected = false;
var connecting = false;
connect("ws://192.168.1.106:8765");

function connect(uri) {
	$('body').css("background-color", "red")
	connecting = true;
	console.log("connecting to: " + uri);
	ws = new WebSocket(uri)
	

		
	ws.addEventListener('open', function () {
		console.log("Connected");
	});
	ws.addEventListener('message', function () {  // Received Data
		console.log(ws.rQshiftStr());
	});
	ws.addEventListener('close', function () {
		disconnect();
		connected = false;
		$('body').css("background-color", "red")
		if (verbose) { console.log("Disconnected")};
	});

	
}

function disconnect() {
	if (ws) { ws.close(); }
	ws = null;

	
}

function send(data) {
	if (!connected && !connecting){
		connect();
	} else {
		console.log(data);
		ws.send(data);
	}
};


 document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    }, false);

$(document).ready(function(){
  $(".ptz_fixed").click(function(){
	  visca_fixed(this.id);
  
  });
  
   $(".preset").click(function(){
	  if ($("#save_preset").is(':checked')) {
		  if (confirm("This will overwrite the current preset for " + this.innerHTML)) {
			  set_preset(this.id);
		  } else {
			return;
		  }
	  } else {
		preset(this.id);
	  }
  
  });
  
   $(".switcher").click(function(){
	  switcher(this.id);
  
  });
  
  $(".ptz_pt").mousedown(function(){
		console.log(this.id);
		pan_tilt(this.id);
  });
  
   $(".ptz_pt").mouseup(function(){
		console.log("stop");
		pan_tilt("stop");
  });
  
     $(".ptz_pt").mouseout(function(){
		console.log("stop");
		pan_tilt("stop");
  })
  
    $(".ptz_zoom").mousedown(function(){
		console.log(this.id);
		zoom(this.id);
  });
   $(".ptz_zoom").mouseup(function(){
		console.log("stop");
		zoom("stop");
  });
});


function switcher(command) {
	command = {
			"type" : "switcher",
			"input" : parseInt(command)
			};
	console.log(command);
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
	

function pan_tilt(direction) {
	speed = $("#pt_speed").val()
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
