var app = window.app;
app.controller('DesignerDetailsController', function($scope,$window,$stateParams, httpService,ngMeta) {
    // http Methods
    $scope.getDesignerDetails = function (designerId) {
        httpService.callHttp("GET", "designers/searchService/" + designerId , {}, {}, {}, $scope.onGetDesignerDetailsSuccess, $scope.onGetDesignerDetailsFailure, false);
    };



    $scope.encodeUrl = function(string){
        return encodeURIComponent(string);
    };

    $scope.showBrandProducts = function (brand,customized) {
        var productsUrl = '/#/products?brand='+encodeURIComponent(brand);
        if (customized){
            productsUrl = '/#/products?'+customized+'=true';
        }
        $window.location.href = productsUrl;
    };

    // http Success and Failure Methods
    $scope.onGetDesignerDetailsSuccess = function (response) {
        var designerDetailsFound = response.statusText == "OK";
        if (designerDetailsFound) {
            $scope.designerDetails = response.data;
            ngMeta.setTitle($scope.designerDetails.brandName + ' By ' + $scope.designerDetails.firstName + ' ' + $scope.designerDetails.lastName + ' | Modaink');
            ngMeta.setTag('og:title' ,$scope.designerDetails.brandName + ' By ' + $scope.designerDetails.firstName + ' ' + $scope.designerDetails.lastName + ' | Modaink');
            ngMeta.setTag('og:image',$scope.designerDetails.brandLogoUrl);

            ngMeta.setTag('twitter:title' ,$scope.designerDetails.brandName + ' By ' + $scope.designerDetails.firstName + ' ' + $scope.designerDetails.lastName + ' | Modaink');
            ngMeta.setTag('twitter:image',$scope.designerDetails.brandLogoUrl);

            ngMeta.setTag('description',$scope.designerDetails.description);

        }
    }
    $scope.onGetDesignerDetailsFailure = function (response) {
        console.log("onGetDesignerDetailsFailure", response);
    }

    $scope.getDesignerDetails($stateParams.designerId)
})
