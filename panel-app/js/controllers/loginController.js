var app = window.app;
app.controller('LoginController', function($scope,$rootScope,$stateParams,$location, httpService, storageService) {
    $scope.email = "";
    $scope.password = "";
    $rootScope.isAdmin = storageService.get("isAdmin");
    $scope.newPassword = "";
    $scope.confirmPassword = "";


    $scope.$watch("isAdmin",function(newValue, oldValue, scope){
        storageService.set("isAdmin",newValue);
        $rootScope.isAdmin = storageService.get("isAdmin");
    });

    $scope.resetStorage = function () {
        storageService.clear();
        $rootScope.userLoggedIn = false;
    };

    $scope.resetPwd = function () {
        var email = $stateParams.email;
        var token = $stateParams.token;

        if($scope.newPassword == $scope.confirmPassword) {
            var newPassword = {
                newPassword: $scope.newPassword,
                confirmPassword: $scope.confirmPassword

            }

            httpService.resetPwd(email, token, newPassword, function (response) {
                $location.path("/login");
            });
        }
        else{
            $scope.error = "Passwords do not match. Please make sure both passwords are same";

            $('#Failure').modal();

        }

    }

    $scope.sendResetLink = function () {
        httpService.sendResetLink($scope.email,function (response) {
            $location.path( "/reset-pwd/sentLink");
        })
    }


	$scope.login = function () {
		var loginInfo = { "email": $scope.email,"password": $scope.password };
        httpService.login(loginInfo,$scope.onLoginSuccess, $scope.onLoginFailure);
	};

	$scope.onLoginSuccess = function (response) {
        httpService.getCurrentUserDetails(function(res){
            $rootScope.currentUser = res.data;
            $rootScope.userId =  res.data.id;
            $rootScope.isActive = res.data.isActive;
            $rootScope.isApproved = res.data.isApproved;

            if($scope.isAdmin || ($rootScope.isActive  && $rootScope.isApproved)){
                $location.path( "/home");
            }
            else if(!$rootScope.isActive  && !$rootScope.isApproved ){
                $location.path("/register-designer");
            }
            else if ($rootScope.isActive  && !$rootScope.isApproved) {
                $location.path("/waiting-for-approval")
            }
            else
                $location.path( "/login");
        });
	};

    $scope.onLoginFailure = function (response) {
        $scope.error = (response.data.message).match(/[^[\]]+(?=])/g);
        if(!$scope.error){
            $scope.error = response.data.message;
        }
        $('#loginFailure').modal();
    }

});

