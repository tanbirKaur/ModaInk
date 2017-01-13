var app = window.app;
app.controller('HomeController', function($scope,$rootScope,$location, httpService, storageService) {
    $scope.onGetDesignerProductsSuccess = function (response) {
        if (response.status == 200) {
            $scope.products = response.data;
        }
    }

    if (!storageService.get('accessToken')) {
        $location.path("/login");
    } else {
        httpService.getDesignerProducts($rootScope.userDetails.id,$scope.onGetDesignerProductsSuccess);
    }
});
