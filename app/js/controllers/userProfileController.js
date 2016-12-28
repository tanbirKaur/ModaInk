var app = window.app;
app.controller('UserProfileController', function($scope,httpService,storageService) {
    $scope.cartItems = storageService.get("cartItems");
    if (!$scope.cartItems) $scope.cartItems = [];


    //Controller function calls
    $scope.totalPrice = $scope.cartItems.reduce(function (prev,next) {
        return prev+next.item.price-next.item.discountPrice;
    },0);
});
