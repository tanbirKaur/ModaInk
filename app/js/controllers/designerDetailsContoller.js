var app = window.app;
app.controller('DesignerDetailsController', function($scope,$stateParams, httpService) {
    // http Methods
    $scope.getDesignerDetails = function (designerId) {
        httpService.callHttp("GET", "designers/" + designerId + "/publicInfo", {}, {}, {}, $scope.onGetDesignerDetailsSuccess, $scope.onGetDesignerDetailsFailure, false);
    }

    // $scope.getDesignerProducts = function (designerId) {
    //     var params = {designerId : designerId};
    //     httpService.callHttp("GET","products",params,{},{},$scope.onGetDesignerProductsSuccess,$scope.onGetDesignerProductsFailure,true);
    // }

    // http Success and Failure Methods
    $scope.onGetDesignerDetailsSuccess = function (response) {
        var designerDetailsFound = response.statusText == "OK";
        if (designerDetailsFound) {
            $scope.designerDetails = response.data;
        }
        ;
    }
    $scope.onGetDesignerDetailsFailure = function (response) {
        console.log("onGetDesignerDetailsFailure", response);
    }

    $scope.getDesignerDetails($stateParams.designerId)
})
