var app = window.app;
app.controller('DesignerDetailsController', function($scope,$window,$stateParams, httpService) {
    // http Methods
    $scope.getDesignerDetails = function (designerId) {
        httpService.callHttp("GET", "designers/searchService" + designerId , {}, {}, {}, $scope.onGetDesignerDetailsSuccess, $scope.onGetDesignerDetailsFailure, false);
    }

    $scope.showBrandProducts = function (brand,customized) {
        var productsUrl = '/#/products?brand='+encodeURIComponent(brand);
        if (customized){
            productsUrl = '/#/products?'+customized+'=true';;
        }
        $window.location.href = productsUrl;
    };

    // http Success and Failure Methods
    $scope.onGetDesignerDetailsSuccess = function (response) {
        var designerDetailsFound = response.statusText == "OK";
        if (designerDetailsFound) {
            $scope.designerDetails = response.data;
        }
    }
    $scope.onGetDesignerDetailsFailure = function (response) {
        console.log("onGetDesignerDetailsFailure", response);
    }

    $scope.getDesignerDetails($stateParams.designerId)
})
