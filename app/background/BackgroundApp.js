chrome.u.sidebar.actions.finishedLoading();

angular.module('bg-app', []);

// Inject all your services into run function, they will be added to shared services.
//window.App.run(function (analytics) {
//	var i, len, bg = chrome.extension.getBackgroundPage();
//	bg.SharedServices = !(bg.SharedServices) ? {} : bg.SharedServices;
//
//	for (i = 0, len = arguments.length; i < len; i++) {
//		bg.SharedServices[arguments[i].serviceName] = arguments[i];
//	}
//});
