var app = window.app;
app.controller('DesignerLabelsController', function($scope,$stateParams,httpService,storageService) {
    var productId = $stateParams.productId;
    var designerId = $stateParams.designerId;
    $scope.products = storageService.get("products");
    $scope.designer = {};

    $scope.resigterDesignerRequest = function (designerInfo) {
        var designerRequest = {
            "firstName": designerInfo.firstName,
            "lastName": designerInfo.lastName,
            "type":designerInfo.type,
            "description":designerInfo.description,
            "email": designerInfo.email,
            "mobile": designerInfo.mobileNumber,
            "brand": {
                "name": designerInfo.brand.name,
                "pickupAddress" : {
                    "pincode": designerInfo.brand.pickupAddress.pincode,

                }
            },
        }
        if (designerInfo.referrerCode){
            designerRequest.referrerCode = designerInfo.referrerCode;
        }
        httpService.callHttp("POST","designers",{},{},designerRequest,$scope.onDesignerRequestSuccess,$scope.onDesignerRequestFailure,true);
    }

    $scope.onDesignerRequestSuccess = function (response) {
        console.log(response);
        $('#registrationSucessful').modal();


    }
    $scope.onDesignerRequestFailure = function (response) {
        console.log(response);
       $('#registrationFailure').modal();
    }

    //View methods
    $scope.becomeADesigner = function () {
        $scope.resigterDesignerRequest($scope.designer);
    }
    //custom methods
    var findProductById = function (id) {
        return $scope.products.find(function(product){
            return product.id == id;
        });
    }

    if (productId) {
        $scope.product = findProductById(productId);
    };

});
