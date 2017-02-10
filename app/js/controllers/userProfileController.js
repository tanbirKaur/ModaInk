var app = window.app;
app.controller('UserProfileController', function($scope,$rootScope,httpService,storageService) {
    $scope.cartItems = storageService.getLocal("cartItems");
    $scope.userDetails = storageService.get("userDetails");
    $scope.newAddress = {};
    $scope.countries = ['India'];
    $scope.addressTypes = ['Home','Office'];
    $scope.selectedAddress = 0;

    if (!$scope.cartItems) $scope.cartItems = [];
    if (!$rootScope.userLoggedIn) $scope.cartItems = storageService.get('guestCartItems');

    $scope.addItemToWishList= function (id) {
        var data = {"productId":id};
        httpService.callHttp("POST","users/"+$scope.userDetails.id+"/wishlistItems ",{},{},data,$scope.onAddItemToWishListSuccess,$scope.onAddItemToWishListFailure);
    };

    $scope.getUserAddresses= function () {
        httpService.callHttp("GET","users/"+$scope.userDetails.id+"/addresses",{},{},{},function (response) {
            $scope.addresses = response.data;
        },function (err) {
            console.log('failed: getUserAddresses');
        });
    };

    $scope.addNewAddress= function () {
        httpService.callHttp("POST","users/"+$scope.userDetails.id+"/addresses",{},{},$scope.newAddress,function (response) {
            $scope.showAddAddress = false;
            $scope.getUserAddresses();
        },function (err) {
            alert(err.data.message)
        });
    }

    $scope.onAddItemToWishListSuccess = function (response) {
        alert(response.data.message);
    }

    $scope.onAddItemToWishListFailure = function (response) {
        alert(response.data.message);
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
