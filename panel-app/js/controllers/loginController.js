var app = window.app;
app.controller('LoginController', function($scope,$rootScope,$stateParams,$location, httpService, storageService) {
    $scope.email = "go4taj@gmail.com";
    $scope.password = "T@J@modaink123";
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

            if($scope.isAdmin){
                $location.path( "/home");
            }
            else if(!$rootScope.isActive  && !$rootScope.isApproved ){
                $location.path("/register-designer");
            }
            else if ($rootScope.isActive  && !$rootScope.isApproved) {
                $location.path('/waiting-for-approval')
            }
            else
                $location.path( "/login");
        });
	};

    $scope.onLoginFailure = function (response) {
        $scope.error = response.data.message;
        $('#loginFailure').modal();
    }


});

