App.controller("SampleCtrl", function($scope) {
	$scope.test = true;

	$scope.someMethod = function () {
		return true;
	}

	$scope.add = function (num1, num2) {
		return num1 + num2;
	}
});