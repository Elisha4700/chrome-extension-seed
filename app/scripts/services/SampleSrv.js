App.factory("SampleSrv", function () {
	"use strict";

	var service = {};

	service.add = function (num1, num2) {
		return num1 + num2;
	};

	return service;
});