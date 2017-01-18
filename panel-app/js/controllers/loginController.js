var app = window.app;
app.controller('LoginController', function($scope,$rootScope,$stateParams,$location, httpService, storageService) {
    $scope.email = "tanbirkaur16@gmail.com";
    $scope.password = "P@ssw0rd";
    $rootScope.isAdmin = storageService.get("isAdmin");
    $scope.$watch("isAdmin",function(newValue, oldValue, scope){
        storageService.set("isAdmin",newValue);
    });
	$scope.login = function () {
		var loginInfo = { "email": $scope.email,"password": $scope.password };
        httpService.login(loginInfo,$scope.onLoginSuccess);
	}

	$scope.onLoginSuccess = function (response) {
        httpService.getCurrentUserDetails(function(res){
            $location.path( "/");
        });
	}
})

