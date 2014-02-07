/*******************************************************************
 * Event Bus: bind and trigger custom events across the application
 * Uses chrome built in messaging system.
 * Implements singleton design pattern, runs on background.
 */
var eventBus = (function () {
	"use strict";

	var bus = new Object();
	var bgConnectionPort;
	var callbacksArray = [];
	var tempHandlersId = 0;
	var eventsCallbacks = {};

	// If we are in bg page we need to manage all the extensions connections
	var extensionsPort = {};
	var portsAutoInc = 0;

	var isBackground = false;
	var _isBackgroundLoaded = false; // true if background page is ready and this is the bg

	function isBackgroundPage() {
		isBackground = (chrome && chrome.extension && (chrome.extension.getBackgroundPage() === window) );
		return isBackground;
	}

	function connectToBackgroundPage() {
		bgConnectionPort = chrome.extension.connect({name: "extension_to_background"});
		var onDisconnect = function () {
			bgConnectionPort.onMessage.removeListener(onMessageHelper);
			bgConnectionPort.onDisconnect.removeListener(onDisconnect);
			bgConnectionPort = null;
			//lets try to connect again
			setTimeout(function () {
				connectToBackgroundPage();
			}, 1000);
		};
		/* helper so we could use callback from messages sent to the mobile pairing*/
		var onMessageHelper = function (message) {
			var callback_function;
			if (message.run_callback) {
				if (typeof callbacksArray[message.run_callback] == "function") {
					callbacksArray[message.run_callback](message.data);
				}
				return true;
			}
			if (message.callback) {
				//has callback, lets wrap it up so it will send message to run it
				callback_function = function (data) {
					if (bgConnectionPort) {
						try {
							bgConnectionPort.postMessage({run_callback: message.callback, data: data});
						} catch (e) {
							console.log(e);
						}
					} else {
						console.log("error! no background port");
					}
				}
			}
			onBackgroundMessage(message.data, null, callback_function);
		};
		if (bgConnectionPort) {
			bgConnectionPort.onMessage.addListener(onMessageHelper);
			bgConnectionPort.onDisconnect.addListener(onDisconnect);
		}
	}

	function bindExtensionsConnections() {
		//lets bind port connections;
		var onPortConnect = function (port) {
			if (port && port.name == "extension_to_background") {
				portsAutoInc++;
				var portID = portsAutoInc;
				console.log("extension connected to bg");
				extensionsPort[portID] = port;

				var onDisconnect = function () {
					port.onMessage.removeListener(onMessageHelper);
					port.onDisconnect.removeListener(onDisconnect);
					delete extensionsPort[portID];
				};
				var onMessageHelper = function (message) {
					var callbackFunction;
					if (message.run_callback) {
						if (typeof callbacksArray[message.run_callback] == "function") {
							callbacksArray[message.run_callback](message.data);
						}
						return true;
					}
					if (message.callback) {
						//has callback
						callbackFunction = function (data) {
							if (port) {
								try {
									port.postMessage({run_callback: message.callback, data: data});
								} catch (e) {
									console.log(e);
								}
							}
						}
					}
					onExtensionMessage(message.data, callbackFunction, port);
				};
				port.onMessage.addListener(onMessageHelper);
				port.onDisconnect.addListener(onDisconnect);
			}
		};
		chrome.extension.onConnectExternal.addListener(onPortConnect);
		chrome.extension.onConnect.addListener(onPortConnect); //for internal app (sidebar)
		chrome.extension.onMessage.addListener(onExtensionMessage);
	}

	function onBackgroundMessage(request, sender, callback) {
		if (request.type == "eventBus") {
			if (request.eventName) {
				fireInternalEvent(request.eventName, request.data, callback);
			}
		}
		return true;
	}

	function onExtensionMessage(request, callback, sourceport) {
		if (request.type == "eventBus") {
			if (request.eventName) {
				fireInternalEvent(request.eventName, request.data, callback);
			}
		}
		messageAllExtensionsPorts(sourceport, request, callback);
		return true;
	}

	function messageAllExtensionsPorts(sourcePort, data, callback) {
		for (var i in extensionsPort) {
			if (extensionsPort[i] && extensionsPort[i] != sourcePort) {
				if (typeof callback == "function") {
					tempHandlersId++;
					callbacksArray[tempHandlersId] = callback;
				}
				var message = {data: data, callback: tempHandlersId};
				try {
					extensionsPort[i].postMessage(message);
				} catch (e) {
					console.log(e, e.message);
					console.log("failed to message port", extensionsPort[i]);
				}
			}
		}
	}

	function messageBackground(data, callback) {
		if (bgConnectionPort) {
			if (typeof callback == "function") {
				tempHandlersId++;
				callbacksArray[tempHandlersId] = callback;
			}
			var message = {data: data, callback: tempHandlersId};
			try {
				bgConnectionPort.postMessage(message);
			} catch (e) {
				console.log(e, e.message);
				console.log("failed to message background port");
			}
		} else {
			console.log("no background port cant send message");
		}
	}

	function fireInternalEvent(eventName, data, response) {
		var callbacks = eventsCallbacks[eventName];
		if (callbacks && callbacks.length > 0) {
			for (var i in callbacks) {
				if (typeof callbacks[i] == "function") {
					try {
						if (callbacks[i]) {
							callbacks[i](data, response);
						}
					} catch (e) {
						console.warn("error in event handler: ", e, e.message, "removing handler");
//                                                callbacks.splice(i, 1);
					}
				}
			}
		}
	}

	/**
	 *  Triggers the event
	 *  Usage: eventBus.fire('event-name' [, optional {object data} [, optional callback function]]);
	 * @param eventName - event name
	 * @param data - object data
	 * @param response -  you can supply response callback that the bind function can call
	 */
	bus.fire = function (eventName, data, response) {
		var obj = {
			type: "eventBus",
			data: data,
			eventName: eventName
		};

		if (!isBackground) {
			try {
				if (typeof response == "function") {
					messageBackground(obj, response);
				} else {
					messageBackground(obj);
				}
			} catch (e) {
				console.log("failed to message background page", e, e.message);
			}
		} else {
			messageAllExtensionsPorts(null, obj, response);
		}
		fireInternalEvent(eventName, data, response);
	};

	/**
	 * Checks if eventBus on background has loaded
	 * @returns (boolean)
	 */
	bus.isBackGroundLoaded = function () {
		if (isBackground) {
			return _isBackgroundLoaded;
		}

		var bg = chrome.extension.getBackgroundPage();
		return (bg && bg.eventBus && bg.eventBus.isBackGroundLoaded && bg.eventBus.isBackGroundLoaded());
	};

	/**
	 * This event will trigger when eventBus on background page has loaded.
	 * @param callback
	 */
	bus.onBackgroundLoaded = function (callback) {
		if (typeof callback == "function") {
			if (bus.isBackGroundLoaded()) {
				callback(true);
			} else {
				var interval = setInterval(function () {
					if (bus.isBackGroundLoaded()) {
						callback(true);
						clearInterval(interval);
						interval = 0;
					}
				}, 50);
			}
		}
	};

	/**
	 * Attaching events.
	 * Usage: eventBus.on('event-name', callback function);
	 * @param eventName
	 * @param callback - the callback function accept data as first param and response as second param,
	 * please note that the same response can be called from multiple sources
	 */
	bus.on = function (eventName, callback) {
		if (!eventsCallbacks[eventName]) {
			eventsCallbacks[eventName] = [];
		}
		eventsCallbacks[eventName].push(callback);
	};

	/**
	 * Un-Attaches the events from the eventBus.
	 * Usage: eventBus.off('eventName', [optional callback function]);
	 * If you pass in a referance to a callback function, this will detach this specific function
	 * Not passing a function referance will detach all callbacks from this event.
	 * @param eventName
	 * @param callback
	 * @returns {boolean} - true if the callback was detached from this event.
	 */
	bus.off = function (eventName, callback) {
		if (eventsCallbacks[eventName] && eventsCallbacks[eventName].length > 0) {
			if( typeof callback === "function" ) {
				for (var i in eventsCallbacks[eventName]) {
					if (eventsCallbacks[eventName][i] === callback) {
						eventsCallbacks[eventName].splice(i, 1);
						return true;
					}
				}
			} else {
				delete eventsCallbacks[eventName];
			}
		}
		return false;
	};

	// Initialization
	(function () {
		chrome.extension.onMessage.addListener(onBackgroundMessage);

		//lets bind to opening port
		if (isBackgroundPage()) {
			bindExtensionsConnections();
			_isBackgroundLoaded = true;
		} else {
			//open port to background page
			bus.onBackgroundLoaded(connectToBackgroundPage);
		}
	})();

	return bus;

}());
