var app = window.app;
app.controller('LoginController', function($scope,$rootScope,httpService,storageService,$location) {
    var token = $location.search().token;
    var email = $location.search().email;
    var baererType = $location.search().bearerType;

    httpService.verifyEmail({
        token:token,
        email:email
    },function (res) {
        alert(JSON.stringify(res.data));
    },function (res) {
        alert('i should fail, but lets fill further info for now!')
    })
});
