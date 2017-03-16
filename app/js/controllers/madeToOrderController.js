
var app = window.app;
app.controller('MadeToOrderController', function($scope,$window,$stateParams, httpService) {
    madeToOrder = true;
    $scope.showNewRequestPopup = function () {
        $('#loginModal').modal();
    }

    $scope.submitOrder = function () {
        hideModal('newRequestModal');
        showModal('orderPlaced');
    }

    $scope.hideHeader = function () {
        $scope.madeToOrder = true;
    }

    $scope.activeTab = 1;
    $scope.setActiveTab= function(tabToSet) {
        $scope.activeTab = tabToSet;
    }
    $scope.activeTabb = 1;
    $scope.setActiveTabb= function(tabToSet) {
        $scope.activeTabb = tabToSet;
    }


    var showModal = function(modal) {
        return angular.element('#'+modal).modal('show');
    };

    var hideModal = function(modal) {
        return angular.element('#'+modal).modal('hide');
    };


});
