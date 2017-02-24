var app = window.app;
app.controller('UserProfileController', function($scope,$state,$rootScope,httpService,storageService,$stateParams) {
    $scope.cartItems = storageService.getLocal("cartItems");
    $scope.userDetails = storageService.get("userDetails");
    $scope.newAddress = {};
    $scope.countries = ['India'];
    $scope.addressTypes = ['Home','Office'];
    $scope.param = $stateParams.param;



    if (!$scope.cartItems) $scope.cartItems = [];
    if (!$rootScope.userLoggedIn) $scope.cartItems = storageService.get('guestCartItems');

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
            console.log(reponse)
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

    $scope.removeItemFromBag= function (id) {
        httpService.callHttp("DELETE","users/"+$scope.userDetails.id+"/shoppingcartItems/"+id,{},{},{},function (response) {
            $scope.getShoppingCartItems();
            $scope.message = 'Item removed from your bag';
            showModal('moveProductSuccess');
        },function (response) {
            $scope.message = response.data.message;
            showModal('moveProductFailure');
        });
    };

    $scope.getShoppingCartItems= function () {
        httpService.callHttp("GET","users/"+$scope.userDetails.id+"/shoppingcartItems",{},{},{},function (response) {
            $scope.cartItems = response.data;
            $scope.$emit('refreshCart',response);
        },function (response) { /* DO NOTHING */});
    };

    $scope.moveToCheckout = function () {
        if($rootScope.userLoggedIn){
            $state.go('billing-details')
        } else {
            showModal('loginModal');
        }
    };

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
    $scope.totalPrice = $scope.cartItems.reduce(function (prev,next) {
        return prev+parseFloat(next.product.price-next.product.discountPrice);
    },0);
    $scope.totalDiscount = $scope.cartItems.reduce(function (prev,next) {
        return prev+parseFloat(next.product.discountPrice);
    },0);

    var showModal = function(modal) {
        return angular.element('#'+modal).modal('show');
    };

    $scope.subTotal = $scope.totalPrice-$scope.totalDiscount;
    $scope.vatPrice = 0;
    $scope.deliveryCharges = 0;
    $scope.payableAmount = $scope.subTotal-$scope.vatPrice-$scope.deliveryCharges;
    if($rootScope.userLoggedIn){
        if($scope.cartItems.length > 0){
            $scope.getShoppingCartItems()
        }
    }
    if ($scope.userDetails){
        $scope.getUserAddresses()
        $scope.getUserOrders()
        $scope.getWishlistItems()
    }
});
