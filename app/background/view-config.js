/**
 *  View config object.
 *  Holds parameters and arguments needed to open full view and quick view.
 *  Used by framework-base.js on Always on.
 */
window.viewConfig = {
	enableQuickView: true, // if set to false - Full view will open instead of Quick View.
	quickView: {
		view: 'quickView',
		reason: 'Clicked on track details',
		height: 380,
		mode: 'click',
		url: Config.extensionUrl + chrome.app.getDetails().smartapp.quick_view.url,
		headerFGColor: "dark",
		headerBGColor: "white"
	},
	fullAppView: {
		'view': 'fullAppView',
		'reason': 'View in full view button clicked',
		'metadata': {}
	}
};
