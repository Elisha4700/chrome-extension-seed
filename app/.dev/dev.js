var dev = {

	/**
	 //	 * Logs the chrome storage object.
	 * @param key (optional) - if key provided, then logs only that key in store data.
	 */
	printStore: function (key) {
		chrome.storage.local.get(function (data) {
			var log;
			if (typeof key === "undefined") {
				log = data;
			} else {
				log = ( data.hasOwnProperty(key) ) ? data[key] : "Store does not have the key: " + key;
			}
			console.log(log);
		});
	},

	printStoreKeys: function () {
		chrome.storage.local.get(function (data) {
			var _allKeys = [];
			for (var _key in data ) {
				_allKeys.push(_key);
			}
			console.log("Storage Keys: ", _allKeys);
		});
	},

	/**
	 * Removes all the data from chrome storage.
	 */
	cleanStore: function () {
		chrome.storage.local.get(function (data) {
			var _allKeys = [];
			for (var _key in data ) {
				_allKeys.push(_key);
			}
			chrome.storage.local.remove(_allKeys);
			console.warn("Deleted from storage: ", _allKeys);
		});
	},

	assertFirstRun: function () {
		chrome.storage.local.remove('firstRun');
	},

	/**
	 * Appends a screenshot and displays it on top of the card.
	 * @param {string} imageUrl - url relative to .dev directory.
	 * @param {number} top - css top attribute (without the prepended px).
	 * @param {number} left - css left attribute (without the prepended px).
	 */
	pixelPerfect: function (imageUrl, top, left) {
		var el = document.createElement('div');
		top = top || 0;
		left = left || 0;
		el.id = 'px-perfect-bg';
		var cssText = 'position: absolute;' +
			'width: 100%;' +
			'height: 100%;' +
			"background-image: url('../.dev/" + imageUrl + ".png');" +
			'background-repeat: no-repeat;' +
			'pointer-events: none;' +
			'z-index: 99999;' +
			'top: ' + top + 'px;' +
			'left: ' + left + 'px;' +
			'opacity: 0.4;';
		//	if (customCssText)
		//		cssText += customCssText;
		el.style.cssText = cssText;
		document.body.appendChild(el);
	},

	/**
	 * Appends a little tag on the top right corner of the card
	 * with the envieroment statement.
	 */
	addEnvTag: function () {
		var el = document.createElement('div');
		var text = CONFIG.ENV + ' DBG: ' + ((CONFIG.DEBUG) ? 'on' : 'off');
		el.id = 'env-tag';
		el.innerText = text;
		el.style.cssText = 'position: absolute;' +
			'width: 100px;' +
			'height: 17px;' +
			'top: 3px;' +
			'right: 3px;' +
			'background: #BADA55;' +
			'font-size: 11px;' +
			'color: black;' +
			'z-index: 999999;' +
			'border-radius: 3px;' +
			'padding: 4px;' +
			'box-sizing: border-box;' +
			'opacity: .5;' +
			'text-align: center;';
		document.body.appendChild(el);
	},

	removeEnvTag: function () {
		var envTag = document.getElementById('env-tag');
		if( envTag ) {
			envTag.remove();
		}
	}

};

//dev.addEnvTag();
