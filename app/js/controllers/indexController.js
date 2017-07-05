app.controller('IndexController', function($scope,$state,$rootScope,$window,httpService,storageService) {
    $scope.homeImageUrl = "images/Home/home_shop_slider.jpg";

    $scope.getDesigners = function () {
        httpService.getDesigners(function (res) {
            $scope.designers = res.data;
        })
    };
});