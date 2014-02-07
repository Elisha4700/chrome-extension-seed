App.directive('myExample', function () {
    return {
        restrict: 'E',  // Define a new element
        replace: true,  // Replace custom directive tag with template
        scope: {        // Isolated scope
            bind: '='   // Two-way-binding
        },
        templateUrl: 'scripts/directives/partials/exampleDirective.html',
        link: function postLink($scope, element, attrs) {
            //todo: Put directive logic, event listeners and watchers here
        }
    }
});