var app = window.app;
app.controller('HomeController', function($scope,$rootScope,$location, httpService, storageService) {
    $scope.onGetDesignerProductsSuccess = function (response) {
        if (response.status == 200) {
            $scope.products = response.data;
        }
    }

    $scope.getUnApprovedProducts = function () {
        httpService.getUnApprovedProducts(function(response){
            $scope.unApprovedProducts = response.data;
        });
    }

    $scope.approveProduct = function (productId) {
        httpService.approveProduct(productId,function(response){
            $scope.getUnApprovedProducts();
        });
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
