// Example of mocha issue where they show multiple failures/ passing, when it should be one failure and one passing
//'use strict';
//
//describe('something', function () {
//    it('should one', function () {
//        this.ok = true;
//    });
//
//    it('should two', function () {
//        this.ok = false;
//    });
//
//    afterEach(function () {
//        if (!this.ok) {
//            this.test.error(new Error('something went wrong'));
//        }
//    });
//});
//
