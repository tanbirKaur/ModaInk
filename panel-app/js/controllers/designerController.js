var app = window.app;
app.controller('DesignerController', function($scope,$stateParams,$location, httpService, $state, $rootScope,$filter) {
    $scope.errors = {};
    $scope.designerDetails = {};
    $scope.designerBrandDetails ={};

    $scope.$watch('designerDetails.dateOfBirth', function (newValue) {
        $scope.designerDetails.dateOfBirth = $filter('date')(newValue, 'yyyy-MM-dd');
    });

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

    $scope.updateDesignerDetails = function(){
        var shouldShowApprovalModal = $scope.shouldShowApprovalModal($scope.unEditedBrandDetails,$scope.designerBrandDetails)
        if(shouldShowApprovalModal.length > 0 && !$rootScope.isAdmin){
            $scope.approvalMessage = shouldShowApprovalModal.join();
            $('#confirmApprovalUpdate').modal('show');
        } else {
            $scope.updateDetails();
        }
    };

	$scope.updateDetails = function () {
        $('#confirmApprovalUpdate').modal('hide');
		var designerDetails = {
            dateOfBirth: $scope.designerDetails.dateOfBirth != null ? $scope.designerDetails.dateOfBirth  :$( "#dateOfBirth" ).datepicker( "getDate" ).toISOString(),
            description: $scope.designerDetails.description,
            type: $scope.designerDetails.type,
            avatarUrl: $scope.designerDetails.avatarUrl
        };
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

                    pincode: $scope.designerDetails.pincode,
                    city: $scope.designerBrandDetails.pickupAddress.city,
                    state: $scope.designerBrandDetails.pickupAddress.state,
                    country: $scope.designerBrandDetails.pickupAddress.country
				}
            };
            if($scope.designerBrandDetails.pickupAddress.landmark){
                brandDetails.pickupAddress.landmark = $scope.designerBrandDetails.pickupAddress.landmark
            }
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

                    pincode: $scope.designerBrandDetails.pickupAddress.pincode,
                    city: $scope.designerBrandDetails.pickupAddress.city,
                    state: $scope.designerBrandDetails.pickupAddress.state,
                    country: "India"
                }
            },
        };

        if($scope.designerBrandDetails.pickupAddress.landmark){
            newDesignerRequest.pickupAddress.landmark = $scope.designerBrandDetails.pickupAddress.landmark
        }
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
 $scope.getDesignersWithPendingProfileUpadation = function () {
        httpService.getDesignersWithPendingProfileUpadation($scope.onGetDesignersWithPendingProfileUpadationSuccess);
    }

    $scope.redirectToViewProduct = function (mode, product) {
        $state.go("addProduct",{mode:mode,product:product});
    }

    // http Methods
    $scope.getDesignerDetails = function (designerId) {
        httpService.getDesignerDetails(designerId,$scope.onGetDesignerDetailsSuccess,function (response) {
            $scope.designerDetails = {brand:{pickupAddress:{},portfolioImages:[],dateOfBirth:''}};
        });
    }

    $scope.getDesignerBrandDetails = function (designerId) {
        httpService.getDesignerBrandDetails(designerId,$scope.onGetDesignerBrandDetailsSuccess,function (response) {
            $scope.designerDetails = {brand:{pickupAddress:{},portfolioImages:[],dateOfBirth:''}};
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
        };


    // http Success and Failure Methods
    $scope.onGetDesignerDetailsSuccess = function (response) {
        var designerDetailsFound = response.status == 200;
        if (designerDetailsFound) {
            $scope.designerDetails = response.data;
            $scope.unEditedDesignerDetails = angular.copy($scope.designerDetails);
            $scope.editMode = true;
        }
    };

    $scope.onGetDesignerBrandDetailsSuccess = function (response) {
        var designerDetailsFound = response.status == 200;
        if (designerDetailsFound) {
            $scope.designerBrandDetails = response.data;
            $scope.unEditedBrandDetails = angular.copy($scope.designerBrandDetails);
        }
    };

    $scope.onGetDesignersSuccess = function (response) {
        var designersFound = response.status == 200;
        if (designersFound) {
            $scope.designerList = response.data;
            $scope.designerList = $scope.designerList.map(function (designer) {
                designer.alphabet = designer.firstName[0];
                return designer;
            });

            $scope.activeDesigners = $scope.designerList.filter(function (designer) {
                return designer.isActive == true ;
            });

            $scope.deactivatedDesigners = $scope.designerList.filter(function (designer) {
                return designer.isActive == false ;
            })
        }
    };
    $scope.onGetDesignersWithPendingProfileUpadationSuccess = function (response) {
        var designersFound = response.status == 200;
        if (designersFound) {
            $scope.designersWithPendingProfileUpdate = response.data;
        }
    };

    $scope.onGetDesignerProductsSuccess = function (response) {
        var designersFound = response.status == 200;
        if (designersFound) {
            $scope.products = response.data;
        }
    };

    $scope.onGetDesignerUnapprovedProductsSuccess = function (response) {
        var designersFound = response.status == 200;
        if (designersFound) {
            $scope.unApprovedProducts = response.data;
        }
    };

    $scope.updateImage = function (type) {
        var imageClick = $scope.imageButtons[type];
        if(imageClick){
            imageClick();
        }
    };

    $scope.shouldShowApprovalModal = function (unEditBrand,brand) {
        var changedKeys = {
            "mobile":"Mobile Number",
            "line1":"Address line 1",
            "line2":"Address line 2",
            "city":"City",
            "state":"State",
            "landmark":"Landmark",
            "pincode":"Pincode"
        };
        var changed = [];
        compare(unEditBrand.pickupAddress.mobile,brand.pickupAddress.mobile,changedKeys,"mobile",changed);
        compare(unEditBrand.pickupAddress.line1,brand.pickupAddress.line1,changedKeys,"line1",changed);
        compare(unEditBrand.pickupAddress.line2,brand.pickupAddress.line2,changedKeys,"line2",changed);
        compare(unEditBrand.pickupAddress.city,brand.pickupAddress.city,changedKeys,"city",changed);
        compare(unEditBrand.pickupAddress.state,brand.pickupAddress.state,changedKeys,"state",changed);
        compare(unEditBrand.pickupAddress.landmark,brand.pickupAddress.landmark,changedKeys,"landmark",changed);
        compare(unEditBrand.pickupAddress.pincode,brand.pickupAddress.pincode,changedKeys,"pincode",changed);
        return changed;
    };

    var compare = function (one, two,keys,name,changed) {
        var equal = one == two;
        if(!equal){
            changed.push(keys[name]);
        }
        return equal;
    };

	var startUploadingImage = function(name){
        if($('#'+name+'Description').val()){
            $('#'+name).trigger('click');
            $scope.errors[name+'Description']= ''
        } else {
            $scope.errors[name+'Description'] = 'Enter image description'
        }
    };

	var loggedIndesgnerId= !$rootScope.isAdmin ? $rootScope.userId : ""

	var designerId = $stateParams.id || loggedIndesgnerId
    if (designerId) {
        $scope.getDesignerDetails(designerId);
        $scope.getDesignerProducts(designerId);
        $scope.getDesignerUnapprovedProducts(designerId);
        $scope.getDesignerBrandDetails(designerId)
    }else {
		$scope.getDesigners();
        $scope.getDesignersWithPendingProfileUpadation()

    }
    $scope.getDesignerRequests()
});
