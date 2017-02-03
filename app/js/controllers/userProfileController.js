var app = window.app;
app.controller('UserProfileController', function($scope,httpService,storageService) {
    $scope.cartItems = storageService.getLocal("cartItems");
    $scope.userDetails = storageService.get("userDetails");

    if (!$scope.cartItems) $scope.cartItems = [];

    $scope.addItemToWishList= function (id) {
        var data = {"item":{"id":id}};
        httpService.callHttp("POST","users/"+$scope.userDetails.id+"/wishlist/items ",{},{},data,$scope.onAddItemToWishListSuccess,$scope.onAddItemToWishListFailure);
    }

    $scope.onAddItemToWishListSuccess = function (response) {
        alert(response.data.message);
    }

    $scope.onAddItemToWishListFailure = function (response) {
        console.log('onAddItemToWishListFailure',response);
    }

    //Controller function calls
    $scope.totalPrice = $scope.cartItems.reduce(function (prev,next) {
        return prev+next.item.price-next.item.discountPrice;
    },0);
});
