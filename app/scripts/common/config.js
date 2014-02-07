var Config = {

	appName: chrome.app.getDetails().name,
	extensionUrl: chrome.extension.getURL("/"),
	extensionId: chrome.app.getDetails().id,

	coreChannelApi: chrome.u.channels,
	coreFullViewApi: chrome.u.fullview,
	coreListenApi: chrome.u.listen,

	debug: true,
	translationDebug: true

	//TODO: App configuration goes here
};


chrome.u.system.environment.getEnv(function (env) {

	Config.environment = env; // Could be: "dev", "qa", "staging", "production"

	// loading the development script
	if (Config.environment.toLowerCase() != 'production') {
		setTimeout(function () {
			var scrpt = document.createElement('script');
			scrpt.setAttribute('src', Config.extensionUrl + '/.dev/dev.js');
			document.head.appendChild(scrpt);
		}, 150);
	} else {
		Config.debug = false;
		Config.translationDebug = false;
	}
});
