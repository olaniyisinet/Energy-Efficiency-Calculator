(function () {
	'use strict';

	var app = angular.module('cloudheatengineer');

	app.controller('ForgotController', ['$scope', '$rootScope', '$http', '$location', 'alertService',
		function ($scope, $rootScope, $http, $location, alertService) {

			$rootScope.showHeader = false;
			$rootScope.showFooter = false;
			$rootScope.heatmanagerview = true;

			$scope.resetPassword = function () {
				$http.post('/auth/forgot', { email: $scope.user.email })
					.success(function (response) {
						alertService('success', 'Forgot Password', response.message);
						$location.path('/');
					})
					.error(function (error) {
						alertService('danger', 'Forgot Password', error.message);
					});
			};

		}]);

	app.controller('ResetPasswordController', ['$scope', '$rootScope', '$routeParams', '$location', 'alertService', 'userService', 'dataService',
		function ($scope, $rootScope, $routeParams, $location, alertService, userService, dataService) {

			var token = $routeParams.token;
			$rootScope.showHeader = false;
			$rootScope.showFooter = false;

			$scope.updatePassword = function () {
				userService.updatePassword(token, $scope.user.password)
					.then(function (res) {
						dataService.setupAll();
						alertService('success', 'Welcome', 'Thanks for coming back ' + res.data.user.first_name + ' ' + res.data.user.surname + '!');
						$location.path('/dashboard');
					}, function () {
						alertService('danger', 'Forgot Password', error.message);
						$location.path('/forgot');
					});
			};
		}]);
}());
