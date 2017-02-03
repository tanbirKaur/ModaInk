var app = window.app;
app.controller('DesignerLabelsController', function($scope,$rootScope,$compile,$stateParams,httpService,storageService) {
    var productId = $stateParams.productId;
    var designerId = $stateParams.designerId;
    $scope.products = storageService.get("products");
    $scope.designer = {};

    $scope.registerDesignerRequest = function (designerInfo) {
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
    };

    $scope.addItemToCart = function(id){
        var itemInfo = {item: {id: id}};
        httpService.callHttp("POST","users/"+$rootScope.userDetails.id+"/shoppingcart/items",{},{},itemInfo,function (response) {
            var successTemplate = angular.element("#cartAddSuccess");
            $compile(successTemplate)({title:'Add Item To Cart',message:'Item Added Successfully!'},function (elem, scope) {
                elem.modal('show');
            });
        },function (failure) {
            alert("ERR! couldn't add item to cart");
        });
    };

    $scope.addToCart = function () {
        if($rootScope.userLoggedIn){
            $scope.addItemToCart(parseInt(productId));
        } else {
            showModal("loginModal");
        }
    };

    $scope.onDesignerRequestSuccess = function (response) {
        $('#sucess').show();
        $('#registrationButtons').addClass('displayNone');
    }
    $scope.onDesignerRequestFailure = function (response) {
        console.log(response);
        $('#failure').show();
        $('#registrationButtons').addClass('displayNone');
    }

    $scope.removeClass = function () {
        $('#registrationButtons').removeClass('displayNone');
    }

    //View methods
    $scope.becomeADesigner = function () {
        $scope.registerDesignerRequest($scope.designer);
    }

    $scope.changeImage = function (image) {
        $scope.previewImage = image;
    }
    //custom methods
    var findProductById = function (id) {
        return $scope.products.find(function(product){
            return product.id == id;
        });
    }

    var showModal = function(modal) {
        return angular.element('#'+modal).modal('show');
    };

    if (productId) {
        $scope.product = findProductById(productId);
        $scope.previewImage = $scope.product.previewImage;
        if(!$scope.product.images) $scope.product.images = [];
        $scope.product.images.push({url:$scope.product.previewImage});
    };

});
