var app = window.app;
app.controller('LoginController', function($scope,$stateParams,$location, httpService, storageService) {
    $scope.email = "tanbirkaur16@gmail.com";
    $scope.password = "P@ssw0rd";
	$scope.login = function () {
		var loginInfo = { "email": $scope.email,"password": $scope.password };
        httpService.designerLogin(loginInfo,$scope.onLoginSuccess);
	}

	$scope.onLoginSuccess = function (response) {
        httpService.getCurrentUserDetails(function(res){
            $location.path( "/");
        });
	}
})

