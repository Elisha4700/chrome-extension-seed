(function () {
	"use strict";

	var bgPage = chrome.extension.getBackgroundPage(),
		bodyClick = false,
		appDetails = chrome.app.getDetails(),
		fullViewUrl = appDetails.smartapp.full_view.url,
		alwaysOnUrl = appDetails.smartapp.home.url,
		defaultConf = {
			quickView: appDetails.smartapp.quick_view,
			fullAppView: appDetails.smartapp.full_view
		};

	function isEmptyObject(obj) {
		var name;
		for (name in obj) {
			return false;
		}
		return true;
	}

	function isQuickViewEnabled() {
		return (typeof bgPage.viewConfig == "undefined" || typeof bgPage.viewConfig.enableQuickView == "undefined" || bgPage.viewConfig.enableQuickView);
	}

	function executeOpenView(type, data) {
		//if we got no metadata then fallback to the ones from the manifest
		if (typeof data == "undefined" || isEmptyObject(data)) {
			data = defaultConf[type];
		}

//      console.debug("Framework Base: Open View -> ", {"view": type, 'reason': 'appRequest', "metadata": data});
		chrome.u.sidebar.actions.openView({"view": type, 'reason': 'appRequest', "metadata": data});
	}

	window.openView = function (view) {
		// Possible views: 'quickView', 'fullAppView'
		if (!isQuickViewEnabled()) {
			// Prevent quickView on viewConfig.enableQuickView flag
			view = "fullAppView";
			if (typeof bgPage.viewConfig !== "undefined" && typeof bgPage.viewConfig[view] !== "undefined") {
				var currentViewConfig = bgPage.viewConfig[view];
				currentViewConfig.mode = "click";
				executeOpenView(view, currentViewConfig);
			} else {
				executeOpenView(view, {});
			}
		} else {
			// If the app isn't docked, all view requests will open the fullView
			chrome.u.platform.getPlatformState(function (data) {
				if (typeof(data.docked) != "undefined" && !(data.docked)) {
					view = "fullAppView";
				}
				// Get current config for the selected view
				if (typeof (bgPage.viewConfig) != "undefined" && typeof (bgPage.viewConfig[view]) != "undefined") {
					var currentViewConfig = bgPage.viewConfig[view];
					currentViewConfig.mode = "click";
					executeOpenView(view, currentViewConfig);
				} else {
					executeOpenView(view, {});
				}
			});
		}
	};

	function init() {

		bodyClick = false;

		function onBodyClick(event) {
			var el = event.srcElement;
			// if clicked element has a class of 'controlElement' or 'control-element'
			if (el.classList.contains('controlElement') || el.classList.contains('control-element')) {
				/*console.debug("Click on 'control-element'");*/
				return false;
			}

			if (bodyClick) { // Double click
				clearTimeout(t);
				bodyClick = false;
				openView('fullAppView');
			} else { // Single click
				bodyClick = true;
				window.t = setTimeout(function () {
					bodyClick = false;
					var view_ = (isQuickViewEnabled()) ? 'quickView' : 'fullAppView';
					openView(view_);
				}, 300)
			}
		}

		function onPlatformEvent(data) {
			if (!isQuickViewEnabled()) {
				return;
			}
			if (data.type === 'onEnterMiniApp') {
				chrome.u.platform.getPlatformState(function (state) {
					// Ignore hover when the app isn't docked or when the flag is off
					if (state.docked && bgPage.viewConfig.enableQuickView) {
						var currentViewConfig = defaultConf["quickView"];
						if (typeof (bgPage.viewConfig) != "undefined" && typeof (bgPage.viewConfig["quickView"]) != "undefined") {
							currentViewConfig = bgPage.viewConfig["quickView"];
						}

						currentViewConfig.mode = "hover";
						executeOpenView("quickView", currentViewConfig);
					}
				});
			}
		}

		// Hover events
		chrome.u.platform.onPlatformEvent.addListener(onPlatformEvent);

		// Register control scheme only for Always on
		if (window.location.href.indexOf(alwaysOnUrl) != -1) {
			// Are we in a window with the alwaysOn Url?
			document.querySelector("html").addEventListener("click", onBodyClick);
		}
	}

	window.onload = init;

})();