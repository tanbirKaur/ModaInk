var app = window.app;
app.controller('VerifyEmailController', function($scope,$stateParams,$location, httpService) {

    $scope.token = $location.search().token;
    $scope.email = $location.search().email;
    $scope.baererType = $location.search().bearerType;

    var info = {
        token: $scope.token,
        email: $scope.email
    }

    httpService.verifyEmail(info, function (res) {
            $scope.emailVerified = true
            console.log(res)
        }, function (res) {
            console.log(res)
    })
});