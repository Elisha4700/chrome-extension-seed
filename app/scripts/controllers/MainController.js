function MainCtrl($scope, sharedServices) {
    $scope.bound = Config.appName;

	sharedServices.analytics.send({eventId: ""})

}