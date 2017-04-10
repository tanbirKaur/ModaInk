var app = window.app;
app.controller('cartController', function($scope,$state,$rootScope,httpService,storageService) {
    $scope.userDetails = storageService.get("userDetails");
    $scope.cartInfo = {shoppingcartItems:[]};

    var updatePricingDetails = function () {
        $scope.cartInfo.shoppingcartCharges.itemsTotalAmount = $scope.cartInfo.shoppingcartItems.reduce(function (prev,next) {
            var priceExclusiveDiscount = next.product.price
            return prev+(priceExclusiveDiscount*next.quantity);
        },0);

        $scope.cartInfo.shoppingcartCharges.itemsTotalDiscountAmount = $scope.cartInfo.shoppingcartItems.reduce(function (prev,next) {
            var discountAmount = (next.product.price / (1 - next.product.discountPercent/100)) - next.product.price
            return prev+(discountAmount*next.quantity);
        },0);

        $scope.cartInfo.shoppingcartCharges.itemsTotalAmountExclusiveTax = $scope.cartInfo.shoppingcartItems.reduce(function (prev,next) {
            var productPrice = next.product.price * (100/115)
            return prev+(productPrice*next.quantity);
        },0);

        $scope.cartInfo.shoppingcartCharges.itemsTotalTaxAmount = $scope.cartInfo.shoppingcartItems.reduce(function (prev,next) {
            var productTax = next.product.price - (next.product.price * (100/115))
            return prev+(productTax*next.quantity);
        },0);

        $scope.cartInfo.shoppingcartCharges.shippingAmount = $scope.cartInfo.shoppingcartCharges.itemsTotalAmount > 2000 ? 0 : 100;
        $scope.cartInfo.shoppingcartCharges.itemsTotalAmount  = $scope.cartInfo.shoppingcartCharges.itemsTotalAmount + $scope.cartInfo.shoppingcartCharges.shippingAmount;
    };

    if (!$rootScope.userLoggedIn) {
        $scope.cartInfo = {shoppingcartItems:storageService.get('guestCartItems'),shoppingcartCharges:{}};
        updatePricingDetails();
    };

    $scope.addItemToCart = function(product){
        var itemInfo = {skuId: product.sku.skuId,quantity: product.quantity};
        httpService.callHttp("POST","users/"+$rootScope.userDetails.id+"/shoppingcartItems",{},{},itemInfo,function () {
            $scope.userDetails = storageService.get("userDetails");
            $scope.getShoppingCartItems();
        });
    };


    $scope.addItemToWishList= function (id,cartItemId) {
        var data = {"productId":id};
        if($rootScope.userLoggedIn){
            httpService.callHttp("POST","users/"+$scope.userDetails.id+"/wishlistItems",{},{},data,function () {
                $scope.removeItemFromBag(cartItemId);
                $scope.message = 'Item added to your wishlist';
                showModal('moveProductSuccess');
            },function (response) {
                $scope.message = response.data.message;
                showModal('moveProductFailure');
            });
        }
        else {
            showModal('loginModal')
        }
    };

    $scope.removeItemFromWishlist= function (id) {
        httpService.callHttp("DELETE","users/"+$scope.userDetails.id+"/wishlistItems/"+id,{},{},{},function (response) {
            $scope.message = 'Item removed from your wishlist';
            showModal('addAddressSuccessModal');
        },function (response) {
            $scope.message = response.data.message;
            showModal('moveProductFailure');
        });
    };

    $scope.removeItemFromBag= function (id,productId) {
        if($rootScope.userLoggedIn){
            httpService.callHttp("DELETE","users/"+$scope.userDetails.id+"/shoppingcartItems/"+id,{},{},{},function (response) {
                $scope.getShoppingCartItems();
                $scope.message = 'Item removed from your bag';
                showModal('moveProductSuccess');
            },function (response) {
                $scope.message = response.data.message;
                showModal('moveProductFailure');
            });
        } else {
            $scope.cartInfo.shoppingcartItems = $scope.cartInfo.shoppingcartItems.filter(function (cartItem) {
                return cartItem.product.id != productId;
            });
            $rootScope.$broadcast("updateCartDetails",{
                cartItems:$scope.cartInfo.shoppingcartItems
            });
            storageService.set('guestCartItems',$scope.cartInfo.shoppingcartItems);
            updatePricingDetails();
        }
    };

    $scope.getStockQuantityForProductSku = function (sku, allSkus) {
        var skuId = sku;
        return (allSkus.filter(function (productSku) {
            return productSku.skuId == skuId;
        })[0]).inStockQuantity;
    };

    $scope.getShoppingCartItems= function () {
        if(!$scope.userDetails){
            $scope.userDetails = storageService.get("userDetails");
        }
        if($scope.userDetails) {
            httpService.callHttp("GET", "users/" + $scope.userDetails.id + "/shoppingcartItems/checkout", {}, {}, {}, function (response) {
                $scope.cartInfo = response.data;
                $scope.cartInfo.shoppingcartCharges.itemsTotalAmount = $scope.cartInfo.shoppingcartCharges.itemsTotalAmount + $scope.cartInfo.shoppingcartCharges.shippingAmount;
                $rootScope.$broadcast("updateCartDetails",{
                    cartItems:$scope.cartInfo.shoppingcartItems
                });
            }, function (response) { /* DO NOTHING */});
        } else {
            httpService.callHttp("GET","users/me",{},{},{},function (res) {
                $scope.userDetails = res.data;
                $rootScope.userDetails = $scope.userDetails;
                storageService.set("userDetails",$scope.userDetails);
                $scope.getShoppingCartItems();
            });
        }
    };

    $scope.moveToCheckout = function () {
        if($rootScope.userLoggedIn){
            $state.go('billing-details')
        } else {
            showModal('loginModal');
        }
    };

    $scope.updateQuantity = function (id,qty) {
        if ($rootScope.userLoggedIn){
            httpService.updateBagItemQuantity(id,qty,$scope.userDetails.id,function (res) {
                $scope.getShoppingCartItems();
            },function (res) {
                console.log('Could not update price');
            })
        } else {
            updatePricingDetails();
        }
    };

    $scope.getUserOrders = function () {
        httpService.callHttp("GET","users/"+$scope.userDetails.id+"/orders",{},{},{},function (response) {
            $scope.orders = response.data;
        },function (err) {
            console.log('failed: getUserOrders');
        });
    };

    $scope.$on("loginSuccess",function (event,response) {
        $scope.userDetails = storageService.get("userDetails");
        addNewItemsToCart()
    });

    var addNewItemsToCart = function () {
        var shoppingcartItems = storageService.get('guestCartItems');
        if(shoppingcartItems.length > 0){
            var cartItem =shoppingcartItems.splice(0,1);
            storageService.set('guestCartItems',shoppingcartItems);
            if($scope.userDetails){
                $scope.addItemToCart(cartItem[0])
            } else {
                httpService.callHttp("GET","users/me",{},{},{},function (res) {
                    $scope.userDetails = res.data;
                    $rootScope.userDetails = $scope.userDetails;
                    storageService.set("userDetails",$scope.userDetails);
                    $scope.addItemToCart(cartItem[0])
                });
            }
            addNewItemsToCart();
        }
    };
    //Controller function calls
    var showModal = function(modal) {
        return angular.element('#'+modal).modal('show');
    };

    if($rootScope.userLoggedIn){
        $scope.getShoppingCartItems()
    }
    if ($scope.userDetails){
        $scope.getUserOrders()
    }
});
