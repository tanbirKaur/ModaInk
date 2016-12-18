var app = window.app;
app.controller('DesignerLabelsController', function($scope,$stateParams,httpService,storageService) {
    var productId = $stateParams.productId;
    var designerId = $stateParams.designerId;
    $scope.products = storageService.get("products");

    //custom methods
    var findProductById = function (id) {
        return $scope.products.find(function(product){
            return product.id == id;
        });
    }

    $scope.product = findProductById(productId);
    $scope.sku = $scope.product.skus[0];
});
