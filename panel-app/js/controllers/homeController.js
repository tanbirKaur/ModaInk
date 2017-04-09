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
            $scope.products = $scope.products.map(function (product) {
                product.alphabet = product.designer.firstName[0];
                product.designer = product.designer.firstName+product.designer.lastName;
                return product;
            });
        }
    };

    $scope.getUnApprovedProducts = function () {
        $scope.unApprovedProducts = [];
        httpService.getUnApprovedProducts(function(response){
            response.data.forEach(function (product) {
                $scope.unApprovedProducts.push(product);
            });
        });
    };

    $scope.getUnApprovedChangesProducts = function () {
        $scope.unApprovedChangesProducts = [];
        httpService.getUnApprovedChangesProducts(function (res) {
            res.data.forEach(function (product) {
                $scope.unApprovedChangesProducts.push(product);
            })
        })
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
        httpService.rejectProduct(productId,function(response){
            $scope.getUnApprovedProducts();
        });
    };

    $scope.approveProductChanges = function (productId) {
        httpService.approveProductChanges(productId,function(response){
            $scope.getUnApprovedChangesProducts();
        });
    };

    $scope.rejectProductChanges = function (productId) {
        httpService.rejectProductChanges(productId,function(response){
            $scope.getUnApprovedChangesProducts();
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
