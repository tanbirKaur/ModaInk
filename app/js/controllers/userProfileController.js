var app = window.app;
app.controller('UserProfileController', function($scope,$state,$rootScope,httpService,storageService) {
    $scope.cartItems = storageService.getLocal("cartItems");
    $scope.userDetails = storageService.get("userDetails");

    if (!$scope.cartItems) $scope.cartItems = [];
    if (!$rootScope.userLoggedIn) $scope.cartItems = storageService.get('guestCartItems');

    $scope.addItemToWishList= function (id) {
        var data = {"productId":id};
        httpService.callHttp("POST","users/"+$scope.userDetails.id+"/wishlistItems",{},{},data,$scope.onAddItemToWishListSuccess,$scope.onAddItemToWishListFailure);
    };

    $scope.removeItemFromWishList= function (id) {
        httpService.callHttp("DELETE","users/"+$scope.userDetails.id+"/shoppingcartItems/"+id,{},{},{},function (response) {
            $scope.getShoppingCartItems();
        },function (response) {
            alert(response.data.message);
        });
    };

    $scope.getShoppingCartItems= function () {
        httpService.callHttp("GET","users/"+$scope.userDetails.id+"/shoppingcartItems",{},{},{},function (response) {
            $scope.cartItems = response.data;
            $scope.$emit('refreshCart',response);
        },function (response) { /* DO NOTHING */});
    };

    $scope.onAddItemToWishListSuccess = function (response) {
        alert(response.data.message);
    }

    $scope.onAddItemToWishListFailure = function (response) {
        alert(response.data.message);
    }

    $scope.moveToCheckout = function () {
        if($rootScope.userLoggedIn){
            $state.go('billing-details')
        } else {
            showModal('loginModal');
        }
    };

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
        if($scope.cartItems.length == 0){
            $scope.getShoppingCartItems()
        }
    }
});
