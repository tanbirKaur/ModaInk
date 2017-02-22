var app = window.app;
app.controller('DesignerLabelsController', function($scope,$rootScope,$compile,$stateParams,httpService,storageService) {
    var productId = $stateParams.productId;
    var designerId = $stateParams.designerId;
    $scope.products = storageService.get("products");
    $scope.designer = {};
    $scope.productId = productId;
    $scope.designerId = designerId;
    $scope.reviews = [];
    $scope.newReview = {rating:0};
    $rootScope.addReview = false;

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

    $scope.updateRating = function (rating) {
        $scope.newReview.rating = rating;
    };

    $scope.addNewReview = function () {
        if(!$rootScope.userLoggedIn){
            hideModal("reviewModal");
            showModal("loginModal");
            $rootScope.addReview = true;
        } else {
            httpService.addNewReview(productId,{
                title: $scope.newReview.title,
                description: $scope.newReview.review,
                rating: $scope.newReview.rating,
                userId: storageService.get('userDetails').id
            },function (response) {
                $scope.reviews.push(response.data);
                hideModal("reviewModal");
                $scope.newReview = {rating:0};
                showModal("addReviewSuccess");
            },function (err) {
                $scope.newReview = {rating:0};
                console.log(err.data.message);
            })
        }
    };

    $scope.setSku = function (sku,$event) {
        $scope.productSku = sku;
        $scope.productSkuMessage = undefined;
        var $this = $($event.currentTarget).parent();
        $this.addClass("sku-select").siblings().removeClass("sku-select");
    };

    $scope.addItemToCart = function(){
        var itemInfo = {skuId: $scope.productSku,quantity: 1};
        httpService.callHttp("POST","users/"+$rootScope.userDetails.id+"/shoppingcartItems",{},{},itemInfo,function (response) {
            var successTemplate = angular.element("#cartAddSuccess");
            $compile(successTemplate)({title:'Add Item To Bag',message:'Item Added Successfully!'},function (elem, scope) {
                elem.modal('show');
            });
            $scope.getShoppingCartItems();
        },function (failure) {
            $scope.error =  failure.data.message;
            showModal("cartAddFailure");
        });
    };

    $scope.addToCart = function (product) {
        if($rootScope.userLoggedIn){
            $scope.addItemToCart();
        } else {
            if(!$scope.productSku){
                $scope.productSkuMessage = 'Select product size first';
                return;
            }
            var itemInfo = {sku: {sizeVariantValue:$scope.productSku},quantity: 1,product:product};
            var guestItems = storageService.get('guestCartItems');
            if(!guestItems) guestItems = [];
            guestItems.push(itemInfo);
            storageService.set('guestCartItems',guestItems);
            $scope.$emit('updateCartDetails',{cartItems:guestItems});
            $compile(angular.element("#cartAddSuccess"))({title:'Add Item To Bag',message:'Item Added Successfully!'},function (elem, scope) {
                elem.modal('show');
            });

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

    $scope.fbShare = function (product) {
            FB.ui({
                method: 'feed',
                name: product.productName + " [ Rs. "+ product.price +"]",
                picture : product.images[0].url,
                link: "www.modaink.com/#/product-details/" +product.id +"/"+ product.designerId ,
                caption: 'Modaink | www.modaink.com',
                description: "["+ product.brandName +"] " + product.productDescription,
                message: "Checkout this design"
            });

    }

    $scope.range = function(n) {
        var count = new Array();
        for (i = 1 ; i <=n ; i++) {
            count.push(i);
        }
        return count;
    };

    $scope.getProductsOfSameBrand = function () {
        params = {offset:0,limit:4};

        var filterInfo = {
            "filters": [
                {
                    "filterName": "brandName",
                    "filterTerms": [$scope.product.brandName]
                }
            ]
        }
        httpService.callHttp("POST","products/searchService/search/filteredSearch",params,{},filterInfo,$scope.onGetProductsOfSameBSuccess,$scope.onGetProductsFailure);
    };

    $scope.getSimilarProducts = function () {
        params = {offset:0,limit:4};
        var filterInfo = {
            "filters": [
                {
                    "filterName": "subCategories",
                    "filterTerms": [$scope.product.subCategories[0]]
                }
            ]
        }
        httpService.callHttp("POST","products/searchService/search/filteredSearch",params,{},filterInfo,$scope.onGetSimilarProductsSuccess,$scope.onGetProductsFailure);
    };

    $scope.onGetProductsOfSameBSuccess = function (response) {
        $scope.sameBrandProductInfo = response.data;
        $scope.sameBrandProducts = response.data.products;
    };
    $scope.onGetSimilarProductsSuccess = function (response) {
        $scope.similarProductInfo = response.data;
        $scope.similarProducts = response.data.products;
    };

    $scope.onGetProductsFailure = function (response) {
        console.log("onGetProductsFailure:",response);
    }

    //custom methods
    var findProductById = function (id) {
        return $scope.products.find(function(product){
            return product.id == id;
        });
    }
    var hideModal = function(modal) {
        return angular.element('#'+modal).modal('hide');
    };
    var showModal = function(modal) {
        return angular.element('#'+modal).modal('show');
    };

    if (productId) {
        $scope.product = findProductById(productId);
        $scope.previewImage = $scope.product.previewImage;
        if(!$scope.product.images) $scope.product.images = [];
        $scope.product.images.push({url:$scope.product.previewImage});
        httpService.getProductReviews(productId,function (response) {
            $scope.reviews = response.data;
        },function (err) {
            console.log(err.data.message);
        });
        $scope.getProductsOfSameBrand();
        $scope.getSimilarProducts();
    };



});
