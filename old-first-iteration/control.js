
// example test run
function runTest() {
	robot = new RobotTest("C:\\Users\\jeffrey.foster\\Desktop\\empty.rpt", 2000, null, callAfterFinished);
	robot.prepare(function() {
		console.log("PREPARED CALLBACK");
		robot.start(function() {
			console.log("STARTED CALLBACK");
			// execute my code here
			runMyCode();
		});
	});
};

function runMyCode() {
	console.log("EXECUTING MY CODE");
};

// do stuff with results
function callAfterFinished(expectedScript, observedScript) {
	if (expectedScript !== undefined && expectedScript != null && observedScript !== undefined && observedScript !== null && expectedScript === observedScript) {
		console.log("SUCCESS");
	} else {
		console.log("FAILURE");
	}
};

// test object (only use once!)
function RobotTest(scriptName, timeout, origin, callback) {
	self = this;
	timer = null;
	this.robotURL = "http://localhost";
	this.scriptName = scriptName;
	this.timeout = timeout;
	this.origin = origin;
	this.state = "INITIAL";
	this.callback = callback;
	this.startTime = null;
};

// prepare the robot
RobotTest.prototype.prepare = function(callback) {
	this.startTime = Date.now();
	// send an abort in timeout seconds if not complete
	if (this.timeout > 0) {
		timer = setTimeout(function() {
			self.abortIfNeeded();
			}, this.timeout);
	}
	this.sendRequest("PREPARE", callback);
};

// abort after timeout if not completed
RobotTest.prototype.abortIfNeeded = function () {
	console.log("ABORT IF NEEDED ENTERED");
	if (self.state != "FINISHED") {
		console.log("REQ.");
		self.sendRequest("ABORT", self.callback);
	}
};

// start the robot
RobotTest.prototype.start = function(callback) {
	this.sendRequest("START", callback);
};

// send request of given type
RobotTest.prototype.sendRequest = function(request, callback) {
	if (this.state == "FINISHED") {
		return;
	}
	console.log(request + " CALLED");
	console.log("PRIOR STATE:" + this.state);
	var xmlhttp;
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	} else {// code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && (xmlhttp.status == 200 || xmlhttp.status == 400)) {
			var jsonResponse = xmlhttp.responseText;
			var jsonObject = JSON.parse(jsonResponse);
			printJSON(jsonObject);
			self.classifyResponse(jsonObject, callback);
		}
	}
	try {
		xmlhttp.open("POST", "http://localhost:61234/" + request, true);
		xmlhttp.send("name:" + this.scriptName);
	} catch (error) {
		console.log(error);
		console.log("ERROR SENDING REQUEST");
		this.finish("SOME ERROR", "OTHER ERROR");
	}
};

// print key value pairs of json object
printJSON = function(jsonObject) {
	for (var key in jsonObject) {
		if (jsonObject.hasOwnProperty(key)) {
			console.log(key + " -> " + jsonObject[key] + "<br>");
		}
	}
};

// log key value pairs of json object
logResponse = function(jsonObject) {
	for (var key in jsonObject) {
		if (jsonObject.hasOwnProperty(key)) {
			console.log(key + " -> " + jsonObject[key]);
		}
	}
};

// classify response and notify appropriate response handler
RobotTest.prototype.classifyResponse = function(jsonObject, callback) {
	if (jsonObject.kind == "PREPARED") {
		this.notifyPrepared(callback);
	} else if (jsonObject.kind == "STARTED") {
		this.notifyStarted(callback);
	} else if (jsonObject.kind == "FINISHED") {
		this.notifyFinished(jsonObject);
	} else if (jsonObject.kind == "ERROR") {
		this.onError(jsonObject);
	} else if (jsonObject.kind == "BAD_REQUEST") {
		this.onBadRequest(jsonObject);
	} else {
		console.log("ERROR: UNRECOGNIZED RESPONSE RECEIVED");
		logResponse(jsonObject);
		this.finish("SOME ERROR", "OTHER ERROR");
	}
};

// prepared handler
RobotTest.prototype.notifyPrepared = function(callback) {
	if (this.state != "INITIAL") {
		throw "Invalid state";
	}
	console.log("PREPARED");
	this.state = "PREPARED";
	callback();
};

// started handler
RobotTest.prototype.notifyStarted = function(callback) {
	if (this.state != "PREPARED") {
		console.log(this.state);
		throw "Invalid state";
	}
	console.log("STARTED");
	this.state = "STARTED";
	callback();
	this.sendRequest("RESULT_REQUEST");
};

// error handler
RobotTest.prototype.onError = function(jsonObject) {
	console.log("ERROR");
	this.state = "ERROR";
	if (jsonObject.summary.indexOf("Early Request") >= 0) {
		setTimeout(function() {
			self.sendRequest("RESULT_REQUEST")
			}, 500);
	} else {
		logResponse(jsonObject);
		this.finish("SOME ERROR", "OTHER ERROR");
	}
};

// finished handler
RobotTest.prototype.notifyFinished = function(jsonObject) {
	console.log("FINISHED");
	this.finish(jsonObject.observedScript, jsonObject.expectedScript);
};

// bad request handler
RobotTest.prototype.onBadRequest = function(jsonObject) {
	console.log("BAD REQUEST");
	logResponse(jsonObject);
	this.finish("SOME ERROR", "OTHER ERROR");
};

// finish and clean up
RobotTest.prototype.finish = function(observedScript, expectedScript) {
	this.state = "FINISHED";
	if (timer !== undefined && timer !== null) {
		clearTimeout(timer);
	}
	if (this.callback !== undefined && this.callback !== null) {
		this.callback(observedScript, expectedScript);
	}
};