var app = window.app;
app.controller('DesignerController', function($scope,$stateParams,$location, httpService, $state, $rootScope) {
    $scope.errors = {};
	//helper methods

	$scope.redirectToViewProduct = function (mode, product) {
		$state.go("addProduct",{mode:mode,product:product});
    }

	// http Methods
	$scope.getDesignerDetails = function (designerId) {
		httpService.getDesignerDetails(designerId,$scope.onGetDesignerDetailsSuccess,function (response) {
            $scope.designerDetails = {brand:{pickupAddress:{},portfolioImages:[],dateOfBirth:''}};
        });
	}
	$scope.getDesigners = function () {
		httpService.getDesigners($scope.onGetDesignersSuccess);
	}

	$scope.getDesignerProducts = function(designerId){
		httpService.getProductsOfDesigner(designerId,$scope.onGetDesignerProductsSuccess)
	}

	$scope.getDesignerUnapprovedProducts = function(designerId){
		httpService.getUnApprovedProductsOfDesigner(designerId,$scope.onGetDesignerUnapprovedProductsSuccess)
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
			$scope.products = response.data;
		};
	}

	$scope.onGetDesignerUnapprovedProductsSuccess = function (response) {
		var designersFound = response.status == 200;
		if (designersFound) {
			$scope.unApprovedProducts = response.data;
		};
	}
	$scope.submitForApproval = function () {
	    if($rootScope.isAdmin){
            $scope.addDesignerAsAdmin(function (response) {
                $('#addDesignerSuccess').modal();
            }, function (response) {
                $scope.error = (response.data.message).match(/[^[\]]+(?=])/g);
                if(!$scope.error){
                    $scope.error = response.data.message;
                }
                $('#addDesignerFailure').modal();
            })
            return;
        }
		var designerDetails = {
            firstName: $scope.designerDetails.firstName,
            lastName: $scope.designerDetails.lastName,
            dateOfBirth: $scope.designerDetails.dateOfBirth,
            mobile: $scope.designerDetails.mobile,
            description: $scope.designerDetails.description,
            type: $scope.designerDetails.type,
            avatarUrl: $scope.designerDetails.avatarUrl
        }
		httpService.updateDesignerDetails($scope.designerDetails.id,designerDetails,function (response) {
            var brandDetails = {
                email: $scope.designerDetails.brand.email,
                logoUrl: $scope.designerDetails.brand.logoUrl,
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
				brandDetails.portfolioImages.push({url:image.url,description:image.description});
            });
			httpService.updateDesignerBrandDetails($scope.designerDetails.id,brandDetails,function (response) {
				$location.path('/waiting-for-approval');
            })
        },function (res) {
			alert('Update failed! try again');
        });
    };

	$scope.addDesignerAsAdmin = function (success, failure) {
        var newDesignerRequest = {
            firstName: $scope.designerDetails.firstName,
            lastName: $scope.designerDetails.lastName,
            dateOfBirth: $( "#dateOfBirth" ).datepicker( "getDate" ).toISOString(),
            mobile: $scope.designerDetails.mobile,
            description: $scope.designerDetails.description,
            type: $scope.designerDetails.type,
            avatarUrl: $scope.designerDetails.avatarUrl,
            referrerCode: $scope.designerDetails.referrerCode,
            email: $scope.designerDetails.email,
            brand: {
                name:$scope.designerDetails.brand.name,
                email: $scope.designerDetails.brand.email,
                TINumber: $scope.designerDetails.brand.TINumber,
                logoUrl: $scope.designerDetails.brand.logoUrl,
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
                    pincode: $scope.designerDetails.brand.pickupAddress.pincode,
                    city: $scope.designerDetails.brand.pickupAddress.city,
                    state: $scope.designerDetails.brand.pickupAddress.state,
                    country: "India"
                }
            },
        };
        if(!newDesignerRequest.referrerCode)delete newDesignerRequest.referrerCode;

        newDesignerRequest.brand.portfolioImages = [];
        $scope.designerDetails.brand.portfolioImages.forEach(function (image) {
            newDesignerRequest.brand.portfolioImages.push({url:image.url,description:image.description});
        });
        httpService.addApprovedDesigner(newDesignerRequest,success,failure);
    }

    $scope.updateImage = function (type) {
        var imageClick = $scope.imageButtons[type];
        if(imageClick){
            imageClick();
        }
    };

    $scope.imageButtons = {
        'avatar':function () { $('#profileImage').trigger('click'); },
        "brandLogo":function () { $('#brandLogo').trigger('click'); },
        "image1":function () {
            startUploadingImage('image1');
        },
        "image2":function () {
            startUploadingImage('image2');
        },
        "image3":function () {
            startUploadingImage('image3');
        },
        "image4":function () {
            startUploadingImage('image4');
        }
    };

    $scope.uploadImages = function (imageName , id) {
        httpService.uploadImage('designers',imageName,function(res){
            var imageUploaded = res.data;
            imageUploaded.forEach(function(image){
                imageDescription = $(id).val();
                if(!$scope.designerDetails) $scope.designerDetails = {brand:{portfolioImages:[]},pickupAddress:{}};
                $scope.designerDetails.brand.portfolioImages.push({url:image.fileUrl,description:imageDescription});
                $scope.errors['image'+$scope.designerDetails.brand.portfolioImages.length+'Description'] = '';
                alert('image uploaded sucessfully');
            }, function (res) {
                alert('Something went wrong. Please try with some other image')
            })
        })
    }

    $scope.uploadProfileImage = function (imageName) {
        if(!imageName)return;
        $scope.$apply(function () {
            httpService.uploadImage('designers',imageName,function(res){
                var imageUploaded = res.data;
                $scope.designerDetails.avatarUrl = imageUploaded[0].fileUrl;
                alert('image uploaded sucessfully');
            }, function (res) {
                alert('Something went wrong. Please try a different image')
            })
        });
	};

	$scope.uploadBrandLogo = function (imageName) {
        if(!imageName)return;
        httpService.uploadImage('designers',imageName,function(res){
            var imageUploaded = res.data;
                alert('image uploaded sucessfully');
                $scope.designerDetails.brand.logoUrl = imageUploaded[0].fileUrl;
            }, function (res) {
            alert('Something went wrong. Please try a different image')

        })
	}

	var startUploadingImage = function(name){
        if($('#'+name+'Description').val()){
            $('#'+name).trigger('click');
            $scope.errors[name+'Description']= ''
        } else {
            $scope.errors[name+'Description'] = 'Enter image description'
        }
    }

	var designerId = $stateParams.id;
	if (designerId ) {
		$scope.getDesignerDetails(designerId);
		$scope.getDesignerProducts(designerId);
		$scope.getDesignerUnapprovedProducts(designerId);
	} else {
	    if($rootScope.userId){
            $scope.getDesignerDetails($rootScope.userId);
        }
		$scope.getDesigners();
	}
    $scope.getDesignerRequests()
});
