var app = window.app;
app.controller('DesignerLabelsController', function($scope,$rootScope,$compile,$stateParams,httpService,storageService) {
    var productId = $stateParams.productId;
    var designerId = $stateParams.designerId;
    $scope.products = storageService.get("products");
    $scope.designer = {};

    $scope.getShoppingCartItems= function () {
        httpService.callHttp("GET","users/"+$scope.userDetails.id+"/shoppingcartItems ",{},{},{},$scope.onGetShoppingCartItemsSuccess,$scope.onGetShoppingCartItemsFailure);
    };

    $scope.onGetShoppingCartItemsSuccess = function (response) {
        $scope.$emit("refreshCart",response);
    };

    $scope.onGetShoppingCartItemsFailure = function () {
        console.log('onGetShoppingCartItemsFailure');
        $scope.shoppingcartItems = [];
        $scope.shoppingcartItemCount = $scope.shoppingcartItems.length;
    };

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


    $scope.setSku = function (sku,$event) {
        $scope.productSku = sku;
        var $this = $($event.currentTarget).parent();
        $this.addClass("sku-select").siblings().removeClass("sku-select");
    };

    $scope.addItemToCart = function(){
        var itemInfo = {skuId: $scope.productSku,quantity: 1};
        httpService.callHttp("POST","users/"+$rootScope.userDetails.id+"/shoppingcartItems",{},{},itemInfo,function (response) {
            var successTemplate = angular.element("#cartAddSuccess");
            $compile(successTemplate)({title:'Add Item To Cart',message:'Item Added Successfully!'},function (elem, scope) {
                elem.modal('show');
            });
            $scope.getShoppingCartItems();
        },function (failure) {
            alert(failure.data.message);
        });
    };

    $scope.addToCart = function () {
        if($rootScope.userLoggedIn){
            $scope.addItemToCart();
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
