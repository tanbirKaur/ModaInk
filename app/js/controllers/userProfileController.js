var app = window.app;
app.controller('UserProfileController', function($scope,httpService,storageService) {
    $scope.cartItems = storageService.getLocal("cartItems");
    $scope.userDetails = storageService.get("userDetails");

    if (!$scope.cartItems) $scope.cartItems = [];

    $scope.addItemToWishList= function (id) {
        var data = {"productId":id};
        httpService.callHttp("POST","users/"+$scope.userDetails.id+"/wishlist/items ",{},{},data,$scope.onAddItemToWishListSuccess,$scope.onAddItemToWishListFailure);
    }

    $scope.getUserAddresses= function () {
        httpService.callHttp("GET","users/"+$scope.userDetails.id+"/addresses",{},{},{},function (response) {
            $scope.addresses = response.data;
            $scope.selectedAddress = 0;
        },function (err) {
            console.log('failed: getUserAddresses');
        });
    }

    $scope.onAddItemToWishListSuccess = function (response) {
        alert(response.data.message);
    }

    $scope.onAddItemToWishListFailure = function (response) {
        console.log('onAddItemToWishListFailure',response);
    }

    //Controller function calls
    $scope.totalPrice = $scope.cartItems.reduce(function (prev,next) {
        return prev+parseFloat(next.product.price-next.product.discountPrice);
    },0);
    $scope.totalDiscount = $scope.cartItems.reduce(function (prev,next) {
        return prev+parseFloat(next.product.discountPrice);
    },0);

    $scope.subTotal = $scope.totalPrice-$scope.totalDiscount;
    $scope.vatPrice = 0;
    $scope.deliveryCharges = 0;
    $scope.payableAmount = $scope.subTotal-$scope.vatPrice-$scope.deliveryCharges;

    $scope.getUserAddresses();
});
