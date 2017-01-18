var app = window.app;
app.controller('HomeController', function($scope,$rootScope,$location, httpService, storageService) {
    $scope.onGetDesignerProductsSuccess = function (response) {
        if (response.status == 200) {
            $scope.products = response.data;
        }
    }
    $rootScope.userLoggedIn = storageService.get('accessToken')
    $rootScope.isAdmin = storageService.get("isAdmin");

    if (!$rootScope.userLoggedIn) {
        $location.path("/login");
    } else {
        httpService.getCurrentUserDetails(function(response){
            httpService.getProducts($rootScope.userDetails.id,$scope.onGetDesignerProductsSuccess);
        });
    }
});
