var app = window.app;
app.controller('DesignersController', function($scope,$stateParams, httpService) {
	// http Methods
	$scope.getDesignerDetails = function () {
		var designerId = $stateParams.designerId;
		httpService.callHttp("GET","designers/"+designerId,{},{},$scope.onGetDesignerDetailsSuccess,$scope.onGetDesignerDetailsFailure,true);
	}

	// http Success and Failure Methods
	$scope.onGetDesignerDetailsSuccess = function (response) {
		var designerDetailsFound = response.statusText == "OK";
		if (designerDetailsFound) {
			$scope.designerDetails = response.data;
		};
	}
	$scope.onGetDesignerDetailsFailure = function (response) {
		console.log(response);
	}
	$scope.getDesignerDetails();
});
