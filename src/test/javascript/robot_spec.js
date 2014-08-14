Robot.describe("testHttpOrSomething.rpt", 3000, function() {
	before
	it("shouldMakeAHttpRequest", function(done) {
		Robot.join();
		setTimeout(function() {
			expect(true).toBe(true);
			done();
		}, 900);
	});
	
	var annotations = { Timeout: 3000, Robotic: {script:'...'}, Origin };
	it("shouldMakeAHttpRequest", annotations, function(done) {
		Robot.join();
		setTimeout(function() {
			expect(true).toBe(true);
			done();
		}, 900);
	}, );
});

