angular.module('locale', [])
	.filter('locale', function () {

		/**
		 * This is a semi- automatic translation Filter for chrome ext + angular
		 * Author: Alex Wolkov
		 * Usage :
		 * 1) Write all strings in your app like so {{"my cool string" | localize}}
		 * 2) Set TRANSLATION_DEBUG flag to true to see changes
		 * 3) All "unlocalized strings" (strings that have no representation in any messages.json)
		 * will appear with _T in front of them.
		 * 4) Run the function window.getMissingTranslations() to generate all missing translations JSON in console
		 * 5) Send to Simon to translate them and rejoice!!
		 */

		var bg = chrome.extension.getBackgroundPage();

		var prefix = '';
		if (Config.translationDebug) {
			bg.trans = {};
			window.getMissingTranslations = function () {
				console.log("************** MISSING TRANSLATIONS **********");
				console.log(JSON.stringify(BG.TRANS, null, '\t'));
			};
			prefix = '_T_';
		}

		//String.prototype.format - http://bit.ly/PFZBhQ
		//heavily modified, to be NOT zero based, and accept an Array instead of arguments
		if (!String.prototype.format) {
			String.prototype.format = function (args) {
				return this.replace(/\$(\d+)/g, function (match, number) {
					return typeof args[number - 1] != 'undefined' ? args[number - 1] : match;
				});
			};
		}

		return function (text, arr) {

			var _key = text.replace(/\W/g, '_').toLowerCase();
			var _msg = chrome.i18n.getMessage(_key, arr);

			if (_msg !== "") {
				// return the translated string
				text = _msg;
			} else {
				if (Config.translationDebug && _key) {
					bg.trans[_key] = {
						message: text,
						description: 'Auto Generated locale string'
					};
				}
				text = text.format(arr);
				text = (text) ? prefix + text : text;
			}

			return text;
		};
	});