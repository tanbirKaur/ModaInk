var app = window.app;
app.controller('DesignerController', function($scope,$stateParams, httpService, $state, $rootScope) {
	//helper methods

	$scope.redirectToViewProduct = function (mode, product) {
		$state.go("add-product",{mode:mode,product:product});
    }

	// http Methods
	$scope.getDesignerDetails = function (designerId) {
		httpService.getDesignerDetails(designerId,$scope.onGetDesignerDetailsSuccess);
	}
	$scope.getDesigners = function () {

		httpService.getDesigners($scope.onGetDesignersSuccess);
	}

	$scope.getDesignerProducts = function(designerId){
		httpService.getProducts(designerId,$scope.onGetDesignerProductsSuccess)
	}
	// http Success and Failure Methods
	$scope.onGetDesignerDetailsSuccess = function (response) {
		var designerDetailsFound = response.status == 200;
		if (designerDetailsFound) {
			$scope.designerDetails = response.data;
			if($scope.designerDetails.brand){
				if(!$scope.designerDetails.brand.pickupAddress){
                    $scope.designerDetails.brand.pickupAddress = {}
				}
                if(!$scope.designerDetails.brand.portfolioImages){
                    $scope.designerDetails.brand.portfolioImages = {}
                }
			} else {
                $scope.designerDetails.brand = {}
			}
		};
	}

	$scope.onGetDesignersSuccess = function (response) {
		var designersFound = response.status == 200;
		if (designersFound) {
			$scope.designerList = response.data;
		}
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
	$scope.submitForApproval = function () {
			console.log('pending approval');
    }


    $scope.uploadImages = function (imageName) {
        httpService.uploadImage('designers',imageName,function(res){
            var imageUploaded = res.data;
            imageUploaded.forEach(function(image){
                alert('image uploaded:'+image.originalFileName);
                $scope.designerDetails.brand.portfolioImages.push({url:image.fileUrl});
            })
        })
    }


	var designerId = $stateParams.id;
	if (designerId ) {
		$scope.getDesignerDetails(designerId);
		$scope.getDesignerProducts(designerId);
	} else {
		$scope.getDesignerDetails($rootScope.userId)
		$scope.getDesigners();
	}


});
