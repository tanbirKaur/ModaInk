var app = window.app;
app.controller('LoginController', function($scope,$stateParams,$location, httpService, storageService) {
	$scope.login = function () {
		$scope.email = "tanbirkaur16@gmail.com";
		$scope.password = "P@ssw0rd";
		var loginInfo = { "email": $scope.email,"password": $scope.password };
		httpService.designerLogin(loginInfo,$scope.onLoginSuccess);
	}

	$scope.onLoginSuccess = function (response) {
		$location.path( "/");
	}
})

