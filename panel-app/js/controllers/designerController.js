var app = window.app;
app.controller('DesignerController', function($scope,$stateParams,$location, httpService, $state, $rootScope) {
    $scope.errors = {};
    $scope.designerDetails = {};
    $scope.designerBrandDetails ={};


    $scope.editMode= false;

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

	$scope.updateDetails = function () {

		var designerDetails = {
            firstName: $scope.designerDetails.firstName,
            lastName: $scope.designerDetails.lastName,
            dateOfBirth: $scope.designerDetails.dateOfBirth != null ? $scope.designerDetails.dateOfBirth  :$( "#dateOfBirth" ).datepicker( "getDate" ).toISOString(),
            mobile: $scope.designerDetails.mobile,
            description: $scope.designerDetails.description,
            type: $scope.designerDetails.type,
            avatarUrl: $scope.designerDetails.avatarUrl
        }
        httpService.updateDesignerDetails($scope.designerDetails.id,designerDetails,function (response) {
            var brandDetails = {
                email: $scope.designerBrandDetails.email,
                TINumber: $scope.designerBrandDetails.TINumber,
                IECNumber: !$scope.designerBrandDetails.IECNumber ? '0' : $scope.designerBrandDetails.IECNumber,
                bankName: $scope.designerBrandDetails.bankName,
                bankBranch: $scope.designerBrandDetails.bankBranch,
                bankIFSCode: $scope.designerBrandDetails.bankIFSCode,
                bankAccountName: $scope.designerBrandDetails.bankAccountName,
                bankAccountNumber: $scope.designerBrandDetails.bankAccountNumber,
                pickupAddress: {
	                fullName: $scope.designerBrandDetails.pickupAddress.fullName,
                    mobile: $scope.designerBrandDetails.pickupAddress.mobile,
                    line1: $scope.designerBrandDetails.pickupAddress.line1,
                    line2: $scope.designerBrandDetails.pickupAddress.line2,
                    landmark: $scope.designerBrandDetails.pickupAddress.landmark,
                    pincode: $scope.designerDetails.pincode,
                    city: $scope.designerBrandDetails.pickupAddress.city,
                    state: $scope.designerBrandDetails.pickupAddress.state,
                    country: $scope.designerBrandDetails.pickupAddress.country
				}

            };
            if($scope.designerBrandDetails.logoUrl){

                brandDetails.logoUrl = $scope.designerBrandDetails.logoUrl
            }
            brandDetails.portfolioImages = [];
            $scope.designerBrandDetails.portfolioImages.forEach(function (image) {
				brandDetails.portfolioImages.push({url:image.url,description:image.description});
            });
			httpService.updateDesignerBrandDetails($scope.designerDetails.id,brandDetails,function (response) {
				if ($rootScope.isAdmin){
                    $location.path('/designer-profile/{{designerDetails.id}}')


                }

                else{
                    $location.path('/waiting-for-approval');

                }
            })
        },function (response) {
            $scope.error = response.data.message;
            $('#addDesignerFailure').modal();
        });
    };
	$scope.addDesignerAsAdmin = function () {
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
                name:$scope.designerBrandDetails.name,
                email: $scope.designerBrandDetails.email,
                TINumber: $scope.designerBrandDetails.TINumber,
                IECNumber: !$scope.designerBrandDetails.IECNumber ? '0' : $scope.designerBrandDetails.IECNumber,
                bankName: $scope.designerBrandDetails.bankName,
                bankBranch: $scope.designerBrandDetails.bankBranch,
                bankIFSCode: $scope.designerBrandDetails.bankIFSCode,
                bankAccountName: $scope.designerBrandDetails.bankAccountName,
                bankAccountNumber: $scope.designerBrandDetails.bankAccountNumber,
                pickupAddress: {
                    fullName: $scope.designerBrandDetails.pickupAddress.fullName,
                    mobile: $scope.designerBrandDetails.pickupAddress.mobile,
                    line1: $scope.designerBrandDetails.pickupAddress.line1,
                    line2: $scope.designerBrandDetails.pickupAddress.line2,
                    landmark: $scope.designerBrandDetails.pickupAddress.landmark,
                    pincode: $scope.designerBrandDetails.pickupAddress.pincode,
                    city: $scope.designerBrandDetails.pickupAddress.city,
                    state: $scope.designerBrandDetails.pickupAddress.state,
                    country: "India"
                }
            },
        };

        if($scope.designerBrandDetails.logoUrl){

            newDesignerRequest.brand.logoUrl = $scope.designerBrandDetails.logoUrl
        }
        if(!newDesignerRequest.referrerCode)delete newDesignerRequest.referrerCode;

        newDesignerRequest.brand.portfolioImages = [];
        $scope.designerBrandDetails.portfolioImages.forEach(function (image) {
            newDesignerRequest.brand.portfolioImages.push({url:image.url,description:image.description});
        });
        httpService.addApprovedDesigner(newDesignerRequest,function () {
                $('#addDesignerSuccess').modal();
            }, function (response) {
                $scope.error = response.data.message;
                $('#addDesignerFailure').modal();
            })
    }


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
                if(!$scope.designerBrandDetails.portfolioImages)
                    $scope.designerBrandDetails.portfolioImages = [];
                $scope.designerBrandDetails.portfolioImages.push({url:image.fileUrl,description:imageDescription});
                $scope.errors['image'+$scope.designerBrandDetails.portfolioImages.length+'Description'] = '';

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
            }, function (res) {
                alert('Something went wrong. Please try a different image')
            })
        });
    };

    $scope.uploadBrandLogo = function (imageName) {
        if(!imageName)return;
        httpService.uploadImage('designers',imageName,function(res){
            var imageUploaded = res.data;
            $scope.designerBrandDetails.logoUrl = imageUploaded[0].fileUrl;
        }, function (res) {
            alert('Something went wrong. Please try a different image')

        })
    }

    //helper methods

    $scope.getDesigners = function () {
        httpService.getDesigners($scope.onGetDesignersSuccess);
    }

    $scope.redirectToViewProduct = function (mode, product) {
        $state.go("addProduct",{mode:mode,product:product});
    }

    // http Methods
    $scope.getDesignerDetails = function (designerId) {
        httpService.getDesignerDetails(designerId,$scope.onGetDesignerDetailsSuccess,function (response) {
            // $scope.designerDetails = {brand:{pickupAddress:{},portfolioImages:[],dateOfBirth:''}};
        });
    }

    $scope.getDesignerBrandDetails = function (designerId) {
        httpService.getDesignerBrandDetails(designerId,$scope.onGetDesignerBrandDetailsSuccess,function (response) {
            // $scope.designerDetails = {brand:{pickupAddress:{},portfolioImages:[],dateOfBirth:''}};
        });
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

    $scope.deactivateDesigner = function () {
        httpService.deactivateDesigner($stateParams.id,function (res) {
            $scope.message = "Designer Successfully Deactivated. It will no longer be displayed in the website"
            $('#successModal').modal();
        },function (res) {
            if(!$scope.error){
                $scope.error = res.data.message;
            }
            $('#failureModal').modal();
        })

    }
     $scope.activateDesigner = function () {
            httpService.activateDesigner($stateParams.id,function (res) {
                $scope.message = "Designer Successfully Activated. It will be displayed in the website now"
                $('#successModal').modal();

            },function (res) {
                if(!$scope.error){
                    $scope.error = res.data.message;
                }
                $('#failureModal').modal();
            })

        }


    // http Success and Failure Methods
    $scope.onGetDesignerDetailsSuccess = function (response) {
        var designerDetailsFound = response.status == 200;
        if (designerDetailsFound) {
            $scope.designerDetails = response.data;
            $scope.editMode = true;
        };
    }

    $scope.onGetDesignerBrandDetailsSuccess = function (response) {
        var designerDetailsFound = response.status == 200;
        if (designerDetailsFound) {
            $scope.designerBrandDetails = response.data;
        };
    }

    $scope.onGetDesignersSuccess = function (response) {
        var designersFound = response.status == 200;
        if (designersFound) {
            $scope.designerList = response.data;
            $scope.designerList = $scope.designerList.map(function (designer) {
                designer.alphabet = designer.firstName[0];
                return designer;
            });

            $scope.activeDesigners = $scope.designerList.filter(function (designer) {
                return designer.isActive == true;
            })

            $scope.deactivatedDesigners = $scope.designerList.filter(function (designer) {
                return designer.isActive == false;
            })
        }
    };

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


    $scope.updateImage = function (type) {
        var imageClick = $scope.imageButtons[type];
        if(imageClick){
            imageClick();
        }
    };
    



	var startUploadingImage = function(name){
        if($('#'+name+'Description').val()){
            $('#'+name).trigger('click');
            $scope.errors[name+'Description']= ''
        } else {
            $scope.errors[name+'Description'] = 'Enter image description'
        }
    }

	var designerId = $stateParams.id || $rootScope.userId;
	if (designerId ) {
		$scope.getDesignerDetails(designerId);
		$scope.getDesignerProducts(designerId);
		$scope.getDesignerUnapprovedProducts(designerId);
		$scope.getDesignerBrandDetails(designerId)
	} else {
		$scope.getDesigners();
	}
    $scope.getDesignerRequests()
});
