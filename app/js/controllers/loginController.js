var app = window.app;
app.controller('LoginController', function($scope,$rootScope,httpService,storageService,$location) {
    var token = $location.search().token;
    var email = $location.search().email;
    var baererType = $location.search().bearerType;
    $scope.email = '';
    $scope.password = '';


    // http Methods
    $scope.login = function (email, password) {
        var loginInfo = { "email": email,"password": password };
        httpService.login(loginInfo,function (response) {
            $scope.$emit('loginSuccess',response);
        },function (response) {
            $scope.$emit('loginFailure',response);
        });
    };

    $scope.$on("logout",function () {
        $scope.email = '';
        $scope.password = '';
    });

    $scope.verifyEmail = function () {
        httpService.verifyEmail({
            token:token,
            email:email
        },function (res) {
            alert(JSON.stringify(res.data));
        },function (res) {
            alert('i should fail, but lets fill further info for now!')
        })
    };
});
