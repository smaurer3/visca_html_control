
var ws = null;
var connected = false;
var connecting = false;
var uri = "ws://192.168.1.106:8765";
var previous_input = "0";
$(document).ready(function(){
connect(uri);

function connect(uri) {
	$('body').css("background-color", "red")
	connecting = true;
	console.log("connecting to: " + uri);
	ws = new WebSocket(uri)
	

	ws.addEventListener('open', function () {
		console.log("Connected");
		connected = true;
		connecting = false;
		$('body').css("background-color", "white")
	});
	ws.addEventListener('message', function (event) {  // Received Data
		recv = JSON.parse(event.data)
		console.log("Received" ,recv);
		if (recv['preset']['message'] == "recall"){
			previous_select = $(".preset.btn-primary");
			previous_select.removeClass('btn-primary');
			previous_select.addClass('btn-secondary');
			current_select = $("#pre-" + recv['preset']["value"]) ;
			current_select.removeClass('btn-secondary');
			current_select.addClass('btn-primary');
		}
		value = recv['input'].split('input')[1];
		
		if (previous_input != value){
			previous_input = value;
			previous_select = $(".switcher.btn-danger");
			previous_select.removeClass('btn-danger');
			previous_select.addClass('btn-light');
			current_select = $("#switch-" + value);
			current_select.removeClass('btn-light');
			current_select.addClass('btn-danger');
			
		}
	});
	ws.addEventListener('close', function () {
		disconnect();
		connected = false;
		$('body').css("background-color", "red")
		console.log("Disconnected");
	});

	
}

function disconnect() {
	if (ws) { ws.close(); }
	ws = null;

	connect(uri);
	
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


  $(".ptz_fixed").click(function(){
	  visca_fixed(this.id);
  
  });
  
   $(".preset").click(function(){
	  value = this.id.split('-')[1]
	  if ($("#save_preset").is(':checked')) {
		  if (confirm("This will overwrite the current preset for " + this.innerHTML)) {
			 
			  set_preset(value);
		  } else {
			return;
		  }
	  } else {
		  
		preset(value);
	  }
  
  });
  
   $(".switcher").click(function(){
	   value = this.id.split('-')[1]
	  switcher(value);
  
  });
  
  $(".ptz_pt").bind("mousedown touchstart", (function(){
		console.log(this.id);
		value = this.id
		pan_tilt(value);
  }));
  
  
   $(".ptz_pt").bind("mouseup touchend mouseout",(function(){
		console.log("stop");
		pan_tilt("stop");
  }));
  
  
  
    $(".ptz_zoom").bind("mousedown touchstart", (function(){
		console.log(this.id);
		zoom(this.id);
  }));
  

   $(".ptz_zoom").bind("mouseup touchend mouseout",(function(){
		console.log("stop");
		zoom("stop");
  }));
  
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
		 
		 ws.send(JSON.stringify(command));
		 pre_pan_speed = pan_speed;
		 pre_direction = direction;
	 } else {
		 command = {
			"type" : "pan_" + direction,
			"tilt_speed" : tilt_speed, 
			"pan_speed" : pan_speed
		};
		
		 ws.send(JSON.stringify(command));
		 pre_direction = direction;
	 } 
}
