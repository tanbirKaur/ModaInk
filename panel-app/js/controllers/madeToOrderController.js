var app = window.app;
app.controller('MadeToOrderController', function($scope,$rootScope,$location, httpService,storageService,$stateParams) {
    $scope.activeTab = 1;

    $scope.setActiveTab = function (tabToSet) {
        $scope.activeTab = tabToSet;
    }
    $scope.activeTabb = 1;
    $scope.setActiveTabb= function(tabToSet) {
        $scope.activeTabb = tabToSet;
    }
    $scope.hidesidebar = function(){
        console.log($rootScope);
        $rootScope.showSidePanel = false;
    }
    $scope.hideSidebar = function () {
        console.log("Hiiiiiii");
    }
});