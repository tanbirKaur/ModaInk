var app = window.app;
app.controller('HomeController', function($scope,$rootScope,$location,$state, httpService, storageService) {

    if(!$rootScope.isActive && !$rootScope.isApproved && !$rootScope.isAdmin){
        $state.go("login");
    }

    $scope.setProduct = function (mode, product) {
        storageService.set('product',product);
    };

    $scope.onGetDesignerProductsSuccess = function (response) {
        if (response.status == 200) {
            $scope.products = response.data;
        }
    };

    $scope.getUnApprovedProducts = function () {
        httpService.getUnApprovedProducts(function(response){
            $scope.unApprovedProducts = response.data;
        });
    };

    $scope.getRejectedProducts = function () {
        httpService.getRejectedProducts(function(response){
            $scope.rejectedProducts = response.data;
        });
    };

    $scope.approveProduct = function (productId) {
        httpService.approveProduct(productId,function(response){
            $scope.getUnApprovedProducts();
        });
    };

    $scope.rejectProduct = function (productId) {
        httpService.approveProduct(productId,function(response){
            $scope.getUnApprovedProducts();
        });
    };

    $rootScope.userLoggedIn = storageService.get('accessToken');
    $rootScope.isAdmin = storageService.get("isAdmin");

    if (!$rootScope.userLoggedIn) {
        $location.path("/login");
    } else {
        httpService.getCurrentUserDetails(function(response){
            httpService.getProducts($rootScope.userDetails.id,$scope.onGetDesignerProductsSuccess);
        });
    }
});
