describe("Testing Sample Service", function () {
	"use strict";

	var service;

	// Setting up the application module
	beforeEach(function () {
		module("seed-app");
	});

	beforeEach(inject(function (SampleSrv) {
		service = SampleSrv;
	}));

	it('should contain a SampleSrv', function () {
		expect(service).toBeDefined();
	});


	it('should have add method', function () {
		expect(service.add).toBeDefined();
	});

	it('add method - should work as expected', function () {
		expect(service.add(2,5)).toBe(7);
	});

});