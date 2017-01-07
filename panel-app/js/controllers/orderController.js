var app = window.app;
app.controller('OrderController', function($scope, httpService) {

    $scope.getOrders = function () {
        httpService.callHttp("GET","orders",{},{},{},$scope.onGetOrdersSuccess,$scope.onGetOrdersFailure);
    }

    $scope.getOrders();
})
