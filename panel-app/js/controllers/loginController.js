var app = window.app;
app.controller('LoginController', function($scope,$rootScope,$stateParams,$location, httpService, storageService) {
    $scope.email = "designer@mailinator.com";
    $scope.password = "Test123$";
    $rootScope.isAdmin = storageService.get("isAdmin");

    $scope.$watch("isAdmin",function(newValue, oldValue, scope){
        storageService.set("isAdmin",newValue);
    });

    $scope.resetStorage = function () {
        storageService.clear();
    };

	$scope.login = function () {
		var loginInfo = { "email": $scope.email,"password": $scope.password };
        httpService.login(loginInfo,$scope.onLoginSuccess, $scope.onLoginFailure);
	};

	$scope.onLoginSuccess = function (response) {
        httpService.getCurrentUserDetails(function(res){
            $rootScope.userId =  res.data.id;
            $rootScope.isActive = res.data.isActive;
            $rootScope.isApproved = res.data.isApproved;

            if(!$rootScope.isActive && !$rootScope.isApproved && !$rootScope.isAdmin){
                $location.path("/register-designer");
            }
            else
                $location.path( "/home");
        });
	};

    $scope.onLoginFailure = function (response) {
        alert(response.data.message);
    }


});

