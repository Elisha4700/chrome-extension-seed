describe("Describe: Sample Controller", function () {
	// Setting up the application module
	beforeEach(function () {
		module("seed-app");
	});

	// Setting up the controller.
	beforeEach(inject(function ($controller, $rootScope) {
		this.scope = $rootScope.$new();
		$controller('SampleCtrl', {
			$scope: this.scope
		})
	}));

	// testing some random stuff..
	it("should have a 'SampleCtrl' with all its attributes.", function () {
		expect(this.scope.test).toBeDefined();
		expect(this.scope.foobar).toBeUndefined();
		expect(this.scope.someMethod).toBeDefined();
	});

	// testing if some method on the scope works.
	it("should have a 'add' method.", function () {
		expect(this.scope.add(2,3)).toBe(5);
	});
});


