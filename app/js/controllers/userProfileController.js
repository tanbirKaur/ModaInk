var app = window.app;
app.controller('UserProfileController', function($scope,$state,$rootScope,httpService,storageService,$stateParams) {
    $scope.userDetails = storageService.get("userDetails");
    $scope.newAddress = {};
    $scope.countries = ['India'];
    $scope.addressTypes = ['Home','Office'];
    $scope.param = $stateParams.param;
    $scope.cartInfo = {shoppingcartItems:[]};

    var updatePricingDetails = function () {
        $scope.cartInfo.shoppingcartCharges.itemsAmount = $scope.cartInfo.shoppingcartItems.reduce(function (prev,next) {
            var priceExclusiveDiscount = next.product.price+((next.product.price/(100-next.product.discountPercent))*next.product.discountPercent)
            return prev+(priceExclusiveDiscount*next.quantity);
        },0);
        $scope.cartInfo.shoppingcartCharges.itemsDiscountAmount = $scope.cartInfo.shoppingcartItems.reduce(function (prev,next) {
            if (next.product.isDiscounted){
                var discountAmount = ((next.product.price/(100-next.product.discountPercent))*next.product.discountPercent);
                return prev+(discountAmount*next.quantity);
            };
            return 0;
        },0);
        $scope.cartInfo.shoppingcartCharges.itemsTotalAmount = $scope.cartInfo.shoppingcartCharges.itemsAmount-$scope.cartInfo.shoppingcartCharges.itemsDiscountAmount;
        $scope.cartInfo.shoppingcartCharges.shippingAmount = 0;
        $scope.cartInfo.shoppingcartCharges.taxAmount = 100;
        $scope.cartInfo.shoppingcartCharges.totalAmount = $scope.cartInfo.shoppingcartCharges.itemsTotalAmount +
            $scope.cartInfo.shoppingcartCharges.shippingAmount +
            $scope.cartInfo.shoppingcartCharges.taxAmount;
        if($scope.cartInfo.shoppingcartCharges.totalAmount > 2000){
            $scope.cartInfo.shoppingcartCharges.taxAmount = 0;
            $scope.cartInfo.shoppingcartCharges.totalAmount = $scope.cartInfo.shoppingcartCharges.itemsTotalAmount +
                $scope.cartInfo.shoppingcartCharges.shippingAmount +
                $scope.cartInfo.shoppingcartCharges.taxAmount;
        }
    };

    if (!$rootScope.userLoggedIn) {
        $scope.cartInfo = {shoppingcartItems:storageService.get('guestCartItems'),shoppingcartCharges:{}};
        updatePricingDetails();
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

    $scope.getWishlistItems= function () {
        httpService.callHttp("GET","users/"+$scope.userDetails.id+"/wishlistItems",{},{},{},function (response) {
            $scope.wishlistItems = response.data;
        },function (response) {
            console.log(response)
        });
    };

    $scope.removeItemFromWishlist= function (id) {
        httpService.callHttp("DELETE","users/"+$scope.userDetails.id+"/wishlistItems/"+id,{},{},{},function (response) {
            $scope.getWishlistItems();
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
        httpService.callHttp("GET","users/"+$scope.userDetails.id+"/shoppingcartItems/checkout",{},{},{},function (response) {
            $scope.cartInfo = response.data;
            $scope.$emit('refreshCart',{data:$scope.cartInfo.shoppingcartItems});
        },function (response) { /* DO NOTHING */});
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
    }

    $scope.getUserAddresses= function () {
        httpService.callHttp("GET","users/"+$scope.userDetails.id+"/addresses",{},{},{},function (response) {
            $scope.addresses = response.data;
            if ($scope.addresses.length > 0){
                $scope.selectedAddress = $scope.addresses[0].id;
            }
        },function (err) {
            console.log('failed: getUserAddresses');
        });
    };

    $scope.addNewAddress= function () {
        httpService.callHttp("POST","users/"+$scope.userDetails.id+"/addresses",{},{},$scope.newAddress,function (response) {
            $scope.getUserAddresses();
            $scope.message = 'New address added succesfully';
            showModal('addAddressSuccessModal');
        },function (err) {
            console.log(err.data.message);
        });
    };

    $scope.removeAddress = function (addressId) {
        httpService.callHttp("DELETE","users/"+$scope.userDetails.id+"/addresses/"+addressId,{},{},{},function (response) {
            $scope.getUserAddresses();
            $scope.message = 'Address removed from your account';
            showModal('addAddressSuccessModal');
        },function (response) {
            $scope.message = response.data.message;
            showModal('moveProductFailure');
        });
    }


    $scope.getUserOrders = function () {
        httpService.callHttp("GET","users/"+$scope.userDetails.id+"/orders",{},{},{},function (response) {
            $scope.orders = response.data;
        },function (err) {
            console.log('failed: getUserOrders');
        });
    }
    //Controller function calls
    var showModal = function(modal) {
        return angular.element('#'+modal).modal('show');
    };

    if($rootScope.userLoggedIn){
        $scope.getShoppingCartItems()
    }
    if ($scope.userDetails){
        $scope.getUserAddresses()
        $scope.getUserOrders()
        $scope.getWishlistItems()
    }
});
