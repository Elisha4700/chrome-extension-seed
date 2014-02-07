setTimeout(function () {
	var btn = document.getElementById('test-buttton');
	btn.onclick = function onButtonClick() {
		var bg = chrome.extension.getBackgroundPage();
		bg.runTest();
	};
}, 1500);