app.controller('PaymentsController', function($scope,$state,$rootScope,$window,httpService,storageService) {
    $scope.paymentSteps = ["Select Address","Select Paymend mode"];
    $scope.paymentStep = 0;
    $scope.userDetails = storageService.get("userDetails");
    $scope.newAddress = {};
    $scope.countries = ['India'];
    $scope.addressTypes = ['Home','Office'];
    $scope.paymentMode = 3;

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
            $scope.showAddAddress = false;
            $scope.getUserAddresses();
        },function (err) {
            console.log(err.data.message);
        });
    };

    $scope.createOrder = function (success) {
        var orderInfo = {
            user: {id: $scope.userDetails.id},
            items: [],
            address: {id: $scope.selectedAddress}
        };
        $scope.cartItems = storageService.getLocal("cartItems");
        $scope.cartItems.forEach(function (cartItem) {
            orderInfo.items.push({sku:{id:cartItem.SkuId},quantity:cartItem.quantity});
        });
        httpService.createOrder(orderInfo,function (response) {
            console.log(response);
            success(response);
        },function (err) {
            alert(err.data.message);
        });
    };

    $scope.moveToPaymentMode = function () {
        if($scope.selectedAddress == -1){
            alert('Select delivery address first')
        } else {
            $state.go('payment-method');
        }
    };

    $scope.makePayment = function () {
        $scope.createOrder(function (response) {
            var order = response.data;
            httpService.getPaymentUrl(order.id,function (response) {
                $window.location.href = response.data.paymentURL;
            },function (err) {
                alert(err.data.response);
            })
        });
    };

    $scope.getUserAddresses();
});