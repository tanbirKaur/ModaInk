var app = window.app;
app.controller('DesignerController', function($scope,$stateParams,$location, httpService, $state, $rootScope) {
	//helper methods

	$scope.redirectToViewProduct = function (mode, product) {
		$state.go("addProduct",{mode:mode,product:product});
    }

	// http Methods
	$scope.getDesignerDetails = function (designerId) {
		httpService.getDesignerDetails(designerId,$scope.onGetDesignerDetailsSuccess,function (response) {
            $scope.designerDetails = {brand:{pickupAddress:{},portfolioImages:[]}};
        });
	}
	$scope.getDesigners = function () {
		httpService.getDesigners($scope.onGetDesignersSuccess);
	}

	$scope.getDesignerProducts = function(designerId){
		httpService.getProducts(designerId,$scope.onGetDesignerProductsSuccess)
	}

    $scope.getDesignerRequests = function(){
        httpService.getDesignerRequests(function (response) {
			$scope.unApprovedDesigners = response.data;
            $scope.unApprovedDesigners.forEach(function (designer) {
                httpService.getDesignerBrandDetails(designer.id,function (response) {
					designer.brandDetails = response.data;
                })
            });
        })
    };

    $scope.approveDesigner = function (designerId) {
        httpService.approveDesigner(designerId,function(response){
            $scope.getDesignerRequests();
        });
    };

    $scope.rejectDesigner = function (designerId) {
        httpService.rejectDesigner(designerId,function(response){
            $scope.getDesignerRequests();
        });
    };

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
                    $scope.designerDetails.brand.portfolioImages = []
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
	    if($rootScope.isAdmin){
	        $scope.addDesignerAsAdmin(function (response) {
                alert(JSON.stringify(response.data));
            })
            return;
        }
		var designerDetails = {
            "firstName": $scope.designerDetails.firstName,
            "lastName": $scope.designerDetails.lastName,
            "dateOfBirth": $scope.designerDetails.dateOfBirth,
            "mobile": $scope.designerDetails.mobile,
            "description": $scope.designerDetails.description,
            "type": $scope.designerDetails.type
        }
		httpService.updateDesignerDetails($scope.designerDetails.id,designerDetails,function (response) {
            var brandDetails = {
                email: $scope.designerDetails.brand.email,
                TINumber: $scope.designerDetails.brand.TINumber,
                IECNumber: $scope.designerDetails.brand.IECNumber,
                bankName: $scope.designerDetails.brand.bankName,
                bankBranch: $scope.designerDetails.brand.bankBranch,
                bankIFSCode: $scope.designerDetails.brand.bankIFSCode,
                bankAccountName: $scope.designerDetails.brand.bankAccountName,
                bankAccountNumber: $scope.designerDetails.brand.bankAccountNumber,
                pickupAddress: {
	                fullName: $scope.designerDetails.brand.pickupAddress.fullName,
                    mobile: $scope.designerDetails.brand.pickupAddress.mobile,
                    line1: $scope.designerDetails.brand.pickupAddress.line1,
                    line2: $scope.designerDetails.brand.pickupAddress.line2,
                    landmark: $scope.designerDetails.brand.pickupAddress.landmark,
                    pincode: $scope.designerDetails.pincode,
                    city: $scope.designerDetails.brand.pickupAddress.city,
                    state: $scope.designerDetails.brand.pickupAddress.state,
                    country: $scope.designerDetails.brand.pickupAddress.country
				}
            };
            brandDetails.portfolioImages = [];
            $scope.designerDetails.brand.portfolioImages.forEach(function (image) {
				brandDetails.portfolioImages.push({url:image.url,description:image.imageDescription});
            });
			httpService.updateDesignerBrandDetails($scope.designerDetails.id,brandDetails,function (response) {
				$location.path('/waiting-for-approval');
            })
        },function (res) {
			alert('Update failed! try again');
        });
    };

	$scope.addDesignerAsAdmin = function (success, failure) {
        newDesignerRequest = {"brand":{"pickupAddress":{"fullName":"Sambha","mobile":"7766443322","line1":"Bade pathar ke pas","line2":"Nadi kinare","city":"Ramgarh","state":"Karnataka","country":"India","landmark":"none","pincode":"554433"},"portfolioImages":[{"url":"https://dev-modaink-assets.s3.amazonaws.com/designers/U3lUS3ZIVndnaG9tZV9zdG9yZV9wcm9kdWN0MS0zMDB4MzAw.jpg","description":"description","$$hashKey":"object:102"}],"name":"KILLERS","email":"sambha@gabbar.com","TINumber":"12","IECNumber":"iiiccc","bankName":"SAMBHA","bankAccountName":"ididid","bankAccountNumber":"665544","bankIFSCode":"icici","bankBranch":"BBBB"},"firstName":"Gabbar","lastName":"SIngh","dateOfBirth":"2017-01-24T03:02:11.614Z","mobile":"7766554433","email":"gabbar@gabbar.com","type":"Established Designer","description":"desc"}
        httpService.addApprovedDesigner(newDesignerRequest,function (response) {
            alert(JSON.stringify(response.data));
        });
        return;

        var newDesignerRequest = {
            firstName: $scope.designerDetails.firstName,
            lastName: $scope.designerDetails.lastName,
            dateOfBirth: $scope.designerDetails.dateOfBirth,
            mobile: $scope.designerDetails.mobile,
            description: $scope.designerDetails.description,
            type: $scope.designerDetails.type,
            referrerCode: $scope.designerDetails.referrerCode,
            brand: {
                email: $scope.designerDetails.brand.email,
                TINumber: $scope.designerDetails.brand.TINumber,
                IECNumber: $scope.designerDetails.brand.IECNumber,
                bankName: $scope.designerDetails.brand.bankName,
                bankBranch: $scope.designerDetails.brand.bankBranch,
                bankIFSCode: $scope.designerDetails.brand.bankIFSCode,
                bankAccountName: $scope.designerDetails.brand.bankAccountName,
                bankAccountNumber: $scope.designerDetails.brand.bankAccountNumber,
                pickupAddress: {
                    fullName: $scope.designerDetails.brand.pickupAddress.fullName,
                    mobile: $scope.designerDetails.brand.pickupAddress.mobile,
                    line1: $scope.designerDetails.brand.pickupAddress.line1,
                    line2: $scope.designerDetails.brand.pickupAddress.line2,
                    landmark: $scope.designerDetails.brand.pickupAddress.landmark,
                    pincode: $scope.designerDetails.pincode,
                    city: $scope.designerDetails.brand.pickupAddress.city,
                    state: $scope.designerDetails.brand.pickupAddress.state,
                    country: $scope.designerDetails.brand.pickupAddress.country
                }
            },
        };
        newDesignerRequest.brand.portfolioImages = [];
        $scope.designerDetails.brand.portfolioImages.forEach(function (image) {
            newDesignerRequest.brand.portfolioImages.push({url:image.url,description:image.imageDescription});
        });
    }

    $scope.uploadImages = function (imageName) {
        httpService.uploadImage('designers',imageName,function(res){
            var imageUploaded = res.data;
            imageUploaded.forEach(function(image){
                alert('image uploaded:'+image.originalFileName);
                $scope.designerDetails.brand.portfolioImages.push({url:image.fileUrl,imageDescription:$scope.imageDescription});
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
    $scope.getDesignerRequests()
});
