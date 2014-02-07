(function () {
	"use strict";

	console.log("Test application is running");

	// Notifies the Framework that this app has loaded and ready to go!
	chrome.u.sidebar.actions.finishedLoading();

	var testTab = null,
		testUrl = chrome.extension.getURL('tests/specRunner.html'),
		detaltConfig = {
			showPass: true,
			showFail: true
		};

	// Initialization
	(function () {
		initNotifSettings();
		connectToSocket();
		setTimeout(runTest, 500);
		window.onTestSuiteResults = onTestSuiteResults;
		window.runTest = runTest;
		chrome.notifications.onClicked.addListener(onNotificationClick);
		chrome.tabs.onRemoved.addListener(onTabClosed);
		chrome.tabs.onUpdated.addListener(onTabUpdated);
	})();

	/**
	 * Checks if there is no notifications preset.
	 * If there is none - then sets the defaults (turns on all the notifications).
	 */
	function initNotifSettings() {
		chrome.storage.local.get(function (data) {
			if (!data.hasOwnProperty('showPass')) {
				chrome.storage.local.set({showPass: detaltConfig.showPass });
			}
			if (!data.hasOwnProperty('showFail')) {
				chrome.storage.local.set({showFail: detaltConfig.showFail });
			}
		});
	}

	/**
	 * Connects to socket.
	 * NOTE: the socket must be open: use 'grunt wat' from teh command line.
	 */
	function connectToSocket() {
		var socket = io.connect('http://localhost:4700');
		socket.on('news', function (data) {
			console.log(data);
			refreshTab();
		});
	}

	/**
	 * Figures out if to open a new tab with Jasmine or simply reload existing.
	 */
	function runTest() {
		if( !testTab ) {
			openTab();
		} else {
			refreshTab();
		}
	}

	/**
	 * Creates new tab and there is runs the test suite.
	 */
	function openTab() {
		// Opens a new tab and runs the test suite.
		chrome.tabs.create({url: testUrl}, function (tab) {
			testTab = tab;
			console.log("Tab open:", testTab);
		});
	}

	/**
	 * Reloads the tab with Jasmine test suite.
	 */
	function refreshTab() {
		if (!testTab) {
			return;
		}
		chrome.tabs.reload(testTab.id, {bypassCache: true}, noop);
	}

	/**
	 * Sets the Jasmine tab in focus.
	 */
	function focusTab() {
		chrome.tabs.update(testTab.id, {active: true}, noop);
	}

	/**
	 * Event handler when clicking on notification
	 * @param notifId - Clicked notification id.
	 */
	function onNotificationClick(notifId) {
		console.debug("Notification clicked", notifId);
		focusTab();
	}

	/**
	 * Sends notification
	 * @param title - Notification title
	 * @param message - Notification message
	 * @param icon - url to image that the notification will display.
	 */
	function showNotif(title, message, icon) {
		var notifId = "TestApp-" + (new Date().getTime()),
			opt = {
				type: "basic",
				title: title,
				message: message,
				iconUrl: icon
			};
		chrome.notifications.create(notifId, opt, noop);
	}

	/**
	 * Test suite calls this method with the test results.
	 * Then this method sends notification based on the results & the notification settings.
	 * @param {{}} specResults - test results
	 */
	function onTestSuiteResults(specResults) {
		console.debug("Spec Results: ", specResults);
		var isPassed = (specResults.failed == 0);
		var title = (isPassed) ? "Success" : "Hmmm...";
		var message = (isPassed) ? specResults.passed_specs + " out of " + specResults.executed_specs + " passed" : specResults.passed_specs + " out of " + specResults.executed_specs + " passed";
		var icon = (isPassed) ? "ok.png" : "error.png";

		chrome.storage.local.get(function (data) {
			if (isPassed && data.showPass) {
				showNotif(title, message, icon);
			}

			if (!isPassed && data.showFail) {
				showNotif(title, message, icon);
			}
		});
	}

	function onTabClosed(tabId, removeInfo) {
		if( testTab && tabId == testTab.id ) {
			console.debug("Tab removed: ", tabId, removeInfo);
			console.debug("Deleting the test tab");
			console.debug("**************************************");
			testTab = null;
		}
	}

	function onTabUpdated(tabId, changeInfo, tab) {
		if( testTab && testTab.id == tabId ) {
			// if user navigated from the test tab to some other place - then our test tab is gone.
			if( tab.url != testUrl ) {
				console.debug("Tab updated: ", tabId, changeInfo, tab);
				console.debug("Deleting the test tab");
				console.debug("**************************************");
				testTab = null;
			}
		}
	}

	function noop() { /* No Operation */ }

})();
