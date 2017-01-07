var app = window.app;
app.controller('DesignerController', function($scope,$stateParams, httpService) {
	// http Methods
	$scope.getDesignerDetails = function (designerId) {
		httpService.getDesignerDetails(designerId,$scope.onGetDesignerDetailsSuccess);
	}
	$scope.getDesigners = function () {
		httpService.callHttp("GET","designers/publicInfo",{},{},{},$scope.onGetDesignersSuccess,$scope.onGetDesignersFailure,true);
	}
	$scope.getDesignerProducts = function (designerId) {
		var params = {designerId : designerId};
		httpService.callHttp("GET","products",params,{},{},$scope.onGetDesignerProductsSuccess,$scope.onGetDesignerProductsFailure,true);
	}

	// http Success and Failure Methods
	$scope.onGetDesignerDetailsSuccess = function (response) {
		var designerDetailsFound = response.status == 200;
		if (designerDetailsFound) {
			$scope.designerDetails = response.data;
		};
	}

	$scope.onGetDesignersSuccess = function (response) {
		var designersFound = response.status == 200;
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

	$scope.onGetDesignerProductsSuccess = function (response) {
		var designersFound = response.status == 200;
		if (designersFound) {
			var designers = response.data;
			// map designers to alphabets
			$scope.designerList = designers.map(function(designer){
				designer.alphabet = designer.firstName[0];
				return designer;
			});
		};
	}
	$scope.onGetDesignerProductsFailure = function (response) {
		console.log("onGetDesignerProductsFailure",response);
	}

	var designerId = $stateParams.id;
	if (designerId) {
		$scope.getDesignerDetails(designerId);
		$scope.getDesignerProducts(designerId);
	} else {
		$scope.getDesigners();
	}
});
