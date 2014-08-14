describe(""A suite is just a function", function() {
	
		  beforeEach(function() {
			    foo = 0;
			    foo += 1;
			  });

			  afterEach(function() {
			    foo = 0;
			  });
	
	
  // sample annotation, probably will just pass this into the function
// var annotations = { Timeout: 3000, Robotic: {script:'...'}, Origin };
// it("shouldMakeAHttpRequest", annotations, function(done) {
			  //assume(current origin is this origin)
	it("thisIsADescription", { Timeout: 3000, Robotic: {script:'...'}, Origin }, function(done) {
		setTimeout(function() {
			expect(true).toBe(true);
			done();
		}, 900);
		Robot.join(callback);
	}, );
});

