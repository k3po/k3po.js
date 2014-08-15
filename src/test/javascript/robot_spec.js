describe("testHttpOrSomething.rpt", function() {
	var originalTimeout;
	beforeEach(function() {
		originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
	});
	
	// test case
	it("testIT", function(done) {
		
		// check results
		var callback = function(expectedScript, observedScript) {
			console.log("I am called on completion");
			expect(expectedScript).toEqual(observedScript);
			done();
		};
		
		// test code
		var myCode = function() {
			console.log("Running my code");
			
		};
		
		
		// do test
		var robot = new RobotTest("script_path", 2000, null, callback);
		
		// execute test
		robot.prepare(function() {
			console.log("PREPARED CALLBACK");
			robot.start(function() {
				console.log("STARTED CALLBACK");
				// execute my code here
				myCode();
			});
		});
	});
	
	
	afterEach(function() {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
	});
});

