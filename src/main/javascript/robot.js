/*
 * Todo Move to an RobotControl.js or something like that
 */

var Robot = function() {
	this.robotURL = "http://localhost:"
}

Robot.prepare = function(scriptName, callback) {
	var xmlhttp;
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	} else {// code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			document.getElementById("myDiv").innerHTML = xmlhttp.responseText;
		}
	}
	xmlhttp.open("POST", "http://localhost:61234/prepare", true);
	xmlhttp.send("name:");
	callback();
};

/*
 * TODO follow / design around example robot test cases
 * /
Robot.start = function(scriptName, callback) {
	callback();
}

Robot.join = function() {
	expect(true).toBe(false);
}

Robot.describe = function(scriptName, timeout, test) {

	Robot.prepare(scriptName, function() {
		// TODO, at somepoint we should be passing this in for robot connect,
		// but sense its a browser/client its not important yet, or whether we
		// need it
		Robot.start(scriptName, function() {
			var originalTimeout;

			// TODO: should be done ONCE before method, nested describes
			// in callback will init it multiple times
			beforeEach(function() {
				originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
				jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
			});

//			test = (function() {
//				var cached_test = test;
//				
//				return function() {
//					// your code
//					cached_test.apply(this, arguments);
//					
//					Robot.finish(scriptName, "callbackgoeshere");
//				};
//			}());
//			it = (function() {
//				var cached_it = it;
//				
//				return function() {
//					// your code
//					cached_it.apply(this, arguments);
//					
//					Robot.finish(scriptName, "callbackgoeshere");
//				};
//			}());
			
			

			describe("robot test", test);

			// TODO: should be done ONCE after test, nested describes
			// in callback will init it multiple times
			afterEach(function() {
//				Robot.finish(scriptName, "callback")
				jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
			});
		});
	});
}
