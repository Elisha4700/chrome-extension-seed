describe("Making sure the manifest got all the right fields.", function () {
	"use strict";

	var manifest = null;

	beforeEach(function () {
		// async beaforeEach: http://stackoverflow.com/questions/10527394/how-to-test-a-method-in-jasmine-if-the-code-in-beforeeach-is-asynchronous
		runs(function() {
			var xmlhttp = new XMLHttpRequest();
			var manifestUrl = chrome.extension.getURL("/app/manifest.json");
			xmlhttp.onreadystatechange = function () {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					manifest = JSON.parse(xmlhttp.responseText);
					console.debug("Manifest: ", manifest);
				}
			};
			xmlhttp.open("GET", manifestUrl, true);
			xmlhttp.send();
		});

		waitsFor(function () { return !!manifest; } , 'Timed out', 1000);
	});

	it("Should have manifest version to be 2", function () {
		expect(manifest['manifest_version']).toBeDefined();
		expect(manifest['manifest_version']).toBe(2);
	});

	it("Should have name and description", function () {
		expect(manifest['name']).toBeDefined();
		expect(manifest['description']).toBeDefined();
	});

	it("Should have default_locale to be English", function () {
		expect(manifest['default_locale']).toBeDefined();
		expect(manifest['default_locale']).toBe('en');
	});

	it("Should have minimum chrome and UBrowser versions", function () {
		expect(manifest['minimum_chrome_version']).toBeDefined();
		expect(manifest['minimum_u_version']).toBeDefined();
	});

	it("Background page should be declared", function () {
		expect(manifest['background']).toBeDefined();
		expect(manifest['background']['page']).toBeDefined();
	});

	xit("Should test if the manifest has an update URL", function () {
		expect(manifest['update_url']).toBeDefined();
	});

});