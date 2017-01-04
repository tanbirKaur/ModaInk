var app = window.app;
app.controller('LoginController', function($scope,$stateParams, httpService) {
	$scope.login = function (email, password) {
		$scope.email = "tanbirkaur16@gmail.com";
		$scope.password = "P@ssw0rd";
		var loginInfo = { "email": $scope.email,"password": $scope.password };
		httpService.callHttp("POST","designers/authenticate/",{},{},loginInfo,$scope.onLoginSuccess,$scope.onLoginFailure,true);
	}
	$scope.onLoginSuccess = function (response) {
		console.log(response);
	}
	$scope.onLoginFailure = function (response) {
		console.log(response);
		
	}
})

