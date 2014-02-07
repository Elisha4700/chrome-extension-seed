/**
 * Created with JetBrains WebStorm.
 * User: Tammy.Kaldes
 * Date: 12/4/13
 * Time: 1:25 PM
 *
 * this directive will fire on the event of an app load (only after app-enabled),
 * after the app declasres that it has finished loading and is ready.
 * it inject the splash animation to the always on card,
 * fades it out to the app's content after a few seconds
 * and removes the animation from the dom
 *
 * to use the directive INCLUDE THIS JS FILE in your always on html,
 * and ADD <splash img-url="''"></splash> to the top of your always on html code
 * where the img-url attribute should include the splash img url between the single quotes.
 *
 * CHANGE THE APP NAME in this file to the name of your ng-app.
 *
 * also ADD THESE STYLES to your always on stylesheet
 *
 * .splashContainer { width: 235px; height: 150px; overflow: hidden; border-radius: 8px; background-color: rgba(255, 255, 255, 0.32); background-image: -webkit-linear-gradient(bottom, rgba(14, 35, 48, 0.25), rgba(14, 35, 48, 0) 65%); background-image: linear-gradient(to top, rgba(14, 35, 48, 0.25), rgba(14, 35, 48, 0) 65%); position: absolute; left: 0; top: 0; }
 * .splashAmination { position: absolute; left: 0; top: 0; opacity: 0; width: 100%; height: 100%; z-index: 1000; background-color: #f05514; background-repeat: no-repeat; background-position: center center; }
 * .splashFadeIn { opacity: 1; transition: opacity 0.6s ease-in-out; -webkit-transition: opacity 0.6s ease-in-out; }
 * .splashFadeOut { opacity: 0; transition: opacity 0.6s ease-in-out; -webkit-transition: opacity 0.6s ease-in-out; }
 *
 * and make sure that you use the correct background color for your app:
 * Facebook #3b5998
 * YouTube #b31217
 * Instagram #3f729b
 * Songza #39a5f0
 * music #1c9c88
 * vice #111
 * Accuweather #f05514
 * 365 #3c3646
 */

angular.module("splash", [])
	.directive("splash", function () {
		return {
			restrict: "E",
			scope: {
				imgUrl: "="
			},
			template: "<div class='splashContainer'></div>",
			link: function (scope, element, attrs) {

				scope.init = function () {
//					chrome.u.platform.onPlatformEvent.addListener(function (data) {
//						if (data.type == "app_started") {
					scope.injectSplash(function () {
						setTimeout(function () {
							scope.splashDiv.className = "splashAmination splashFadeIn";
							setTimeout(scope.removeSplash, 2600);
						}, 300);
					});
//						}
//					});
				};

				scope.injectSplash = function (callback) {
//					console.debug("injectSplash");
					scope.splashDiv = document.createElement("div");
					scope.splashDiv.className = "splashAmination";
					scope.splashDiv.style.backgroundImage = "url(" + scope.imgUrl + ")";
					document.getElementsByClassName("splashContainer")[0].appendChild(scope.splashDiv);
					if (callback && typeof callback == "function") {
						callback();
					}
				};

				scope.removeSplash = function () {
//					console.debug("start fade out");
					var splashContainer = scope.splashDiv.parentNode;
					splashContainer.className = "";
					scope.splashDiv.className = "splashAmination splashFadeOut";
					setTimeout(function () {
//						console.debug("remove splash div");
						scope.splashDiv.parentNode.removeChild(scope.splashDiv);
					}, 500);
				};

				scope.init();
			}
		}

	});