var app = window.app;
app.controller('DesignersController', function($scope,$stateParams, httpService) {
	// http Methods
	$scope.getDesignerDetails = function (designerId) {
		httpService.callHttp("GET","designers/"+designerId,{},{},{},$scope.onGetDesignerDetailsSuccess,$scope.onGetDesignerDetailsFailure,true);
	}
	$scope.getDesigners = function () {
		httpService.callHttp("GET","designers",{},{},{},$scope.onGetDesignersSuccess,$scope.onGetDesignersFailure,true);
	}

	// http Success and Failure Methods
	$scope.onGetDesignerDetailsSuccess = function (response) {
		var designerDetailsFound = response.statusText == "OK";
		if (designerDetailsFound) {
			$scope.designerDetails = response.data;
		};
	}
	$scope.onGetDesignerDetailsFailure = function (response) {
		console.log("onGetDesignerDetailsFailure",response);
	}

	$scope.onGetDesignersSuccess = function (response) {
		var designersFound = response.statusText == "OK";
		if (designersFound) {
			var designers = response.data;
			// map designers to alphabets
			$scope.designerList = designers.map(function(designer){
				designer.alphabet = designer.firstName[0];
				return designer;
			});
		};
	}
	$scope.onGetDesignersFailure = function (response) {
		console.log("onGetDesignersFailure",response);
	}
	var designerId = $stateParams.designerId;
	if (designerId) {
		$scope.getDesignerDetails(designerId);
	} else {
		$scope.getDesigners();
	}
});
