(function () {
	if (!jasmine) {
		throw new Exception("jasmine library does not exist in global namespace!");
	}

	var specResults = {
		finished: false
	};

	var GlobalReporter = function () {
		this.started = false;
		this.finished = false;
	};

	GlobalReporter.prototype = {

		reportRunnerStarting: function (runner) {
			this.started = true;
			this.start_time = (new Date()).getTime();
			this.executed_specs = 0;
			this.passed_specs = 0;
			this.executed_asserts = 0;
			this.passed_asserts = 0;

			specResults.finished = false;

			// should have at least 1 spec, otherwise it's considered a failure
//			this.log('1..' + Math.max(runner.specs().length, 1));
		},

		reportSpecStarting: function (spec) {
			this.executed_specs++;
//			window.specResults.executed_specs++;
		},

		reportSpecResults: function (spec) {
			var resultText = "not ok";
			var errorMessage = '';

			var results = spec.results();
			if (results.skipped) {
				return;
			}
			var passed = results.passed();

			this.passed_asserts += results.passedCount;
			this.executed_asserts += results.totalCount;

			if (passed) {
				this.passed_specs++;
				resultText = "ok";
			} else {
				var items = results.getItems();
				var i = 0;
				var expectationResult, stackMessage;
				while (expectationResult = items[i++]) {
					if (expectationResult.trace) {
						stackMessage = expectationResult.trace.stack ? expectationResult.trace.stack : expectationResult.message;
						errorMessage += '\n  ' + stackMessage;
					}
				}
			}

//			this.log(resultText + " " + (spec.id + 1) + " - " + spec.suite.description + " : " + spec.description + errorMessage);
		},

		reportRunnerResults: function (runner) {
			var dur = (new Date()).getTime() - this.start_time;
			var failed = this.executed_specs - this.passed_specs;
			var spec_str = this.executed_specs + (this.executed_specs === 1 ? " spec, " : " specs, ");
			var fail_str = failed + (failed === 1 ? " failure in " : " failures in ");
			var assert_str = this.executed_asserts + (this.executed_asserts === 1 ? " assertion, " : " assertions, ");

			specResults.dur = dur;
			specResults.spec_str = spec_str;
			specResults.fail_str = fail_str;
			specResults.assert_str = assert_str;
			specResults.executed_specs = this.executed_specs;
			specResults.passed_specs = this.passed_specs;
			specResults.failed = failed;

			this.finished = true;
			specResults.finished = true;

			try{
				var bg = chrome.extension.getBackgroundPage();
				bg.onTestSuiteResults(specResults);
			} catch(err) {
				console.warn("Could not send results to background page", err);
			}
		},

		log: function (str) {
			var console = jasmine.getGlobal().console;
			if (console && console.log) {
				console.log(str);
			}
		}
	};

	// export public
	jasmine.GlobalReporter = GlobalReporter;
})();

jasmine.getEnv().addReporter(new jasmine.GlobalReporter());
