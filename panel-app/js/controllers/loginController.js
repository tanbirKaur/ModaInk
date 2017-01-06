var app = window.app;
app.controller('LoginController', function($scope,$stateParams,$location, httpService, storageService) {
	$scope.login = function () {
		$scope.email = "tanbirkaur16@gmail.com";
		$scope.password = "P@ssw0rd";
		var loginInfo = { "email": $scope.email,"password": $scope.password };
		httpService.callHttp("POST","designers/authenticate/",{},{},loginInfo,$scope.onLoginSuccess,$scope.onLoginFailure,true);
	}
	$scope.onLoginSuccess = function (response) {
		storageService.set('accessToken',response.data.accessToken);
		$location.path( "/");
	}
	$scope.onLoginFailure = function (response) {
		console.log(response);
	}
})

