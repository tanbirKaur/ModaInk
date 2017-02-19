var app = window.app;
app.controller('HomeController', function($scope,$rootScope,$state,$stateParams, $auth,httpService,storageService) {
	$scope.homeImageUrl = "images/Home/home_shop_slider.jpg";
	$scope.userName = undefined;
	$scope.shoppingcartItemCount = 0;
	$scope.productFilters = [];
    $scope.searchQuery = {};
	$scope.sortOption = {};
	$scope.filterParams = {};
	$scope.filterGender = $stateParams.gender;
    $scope.topCategory = $stateParams.topCategory;
	$scope.subCategory = $stateParams.subCategory;
    $scope.isCustomizable = $stateParams.isCustomizable;
    $scope.queryFilters = [];
	$scope.alertHidden = function(){};
	if($stateParams.exclusive){
        $scope.searchQuery.isExclusive = true;
	}
	if($stateParams.brand) $scope.productFilters.push({name:$stateParams.brand,key:'brandName',value:$stateParams.brand})

    $scope.authLogin= function (provider) {
		$auth.authenticate(provider).then(function(response) {
			var socialLoginInfo = {network:provider,socialToken:response.access_token};
            httpService.callHttp("POST","users/social/authenticate",{},{},socialLoginInfo,function (response) {
                $scope.$emit("loginSuccess",response);
                $scope.message = "Login Successful"
                if($rootScope.addReview){
                    showModal('reviewModal')
                }
                else {
                    showModal('loginSuccess')
                }
                hideModal('loginModal')

            },function (err) {
                $scope.$emit("loginFailure",response);
                if(response.data){
                    $scope.message = response.data.message;

                }
                else{
                    $scope.message = "OOPS!! Something went wrong. Please try again";

                }
                showModal('loginFailure')
            });
        }).catch(function(response) {
        	console.log(response);
            $scope.$emit("loginFailure",response);
		});
    };

	$scope.getUserDetails = function () {
		httpService.callHttp("GET","users/me",{},{},{},$scope.onGetUserDetailsSuccess,$scope.onGetUserDetailsFailure);
	};

	$scope.getShoppingCartItems= function () {
		httpService.callHttp("GET","users/"+$scope.userDetails.id+"/shoppingcartItems",{},{},{},$scope.onGetShoppingCartItemsSuccess,$scope.onGetShoppingCartItemsFailure);
	};

	$scope.getDesigners = function () {
		httpService.callHttp("GET","designers/publicInfo",{},{},{},$scope.onGetDesignersSuccess,$scope.onGetDesignersFailure,true);
	};

	$scope.getCategories = function () {
		var params = {includeSubCategories:true};
		httpService.callHttp("GET","categories",params,{},{},$scope.onGetCategorySuccess,$scope.onGetCategoryFailure,true);
	};

	$scope.getProducts = function (params) {
		if (!params) params = {offset:0,limit:30};
		var filterInfo = {filters:[],sortBy:[]};
		filterInfo.query = $scope.searchQuery;
		Object.keys($scope.sortOption).forEach(function(key){
			filterInfo.sortBy.push({sortAttribute:key,sortOrder:$scope.sortOption[key]});
		});
		var filters = {};
		$scope.productFilters.forEach(function (filter) {
			if(filter.key == 'price'){
				var minPrice = filter.value.split('-')[0];
                var maxPrice = filter.value.split('-')[1];
                minPrice = minPrice.replace('*',0);
                maxPrice = maxPrice.replace('*',1000000);
                filterInfo.filters.push({filterName:filter.key,filterRange:{gte: minPrice, lte: maxPrice}});
			} else {
                var filterVals = filters[filter.key];
                if (!filterVals)filterVals = [];
                filterVals.push(filter.value);
                filters[filter.key] = filterVals;
			}
        });
		Object.keys(filters).forEach(function (filterName) {
			filterInfo.filters.push({filterName:filterName,filterTerms:filters[filterName]});
        });
		httpService.callHttp("POST","products/searchService/search/filteredSearch",params,{},filterInfo,$scope.onGetProductsSuccess,$scope.onGetProductsFailure);
	};

	$scope.openMyCart = function () {
		$state.go("cart");
    };

	//Product filters and sort

	$scope.sortBy = function (key) {
		var sortValue = $scope.sortOption[key];
		$scope.sortOption = {};
		$scope.sortOption[key] = sortValue;
		if (!$scope.sortOption[key] || $scope.sortOption[key] == 'desc') {
			$scope.sortOption[key] = 'asc'
		} else {
			$scope.sortOption[key] = 'desc'
		}
		$scope.getProducts($scope.filterParams);
	};

	// http Success and Failure Methods
	$scope.$on("loginSuccess",function (event,response) {
		$rootScope.userLoggedIn = true;
		$scope.alertHidden = function () {
			alert("Login Successful!");
		};
		hideModal("loginModal");
        hideModal("registerModal");
		storageService.set("accessToken",response.data.accessToken);
		$scope.getUserDetails();
	});

    $scope.$on("loginFailure",function (event,response) {
        $rootScope.userLoggedIn = false;
		$scope.alertHidden = function () {
			if (!response.data) {
				alert("Oops something went wrong. Login failed!");
			} else {
				alert(response.data.message);
			}
		};
	});

    $scope.$on("updateCartDetails",function (event,response) {
        $scope.shoppingcartItems = response.cartItems;
        $scope.shoppingcartItemCount = $scope.shoppingcartItems.length;
    });

    $scope.logout = function () {
        storageService.removeAll();
        $rootScope.userLoggedIn = false;
        $scope.shoppingcartItems = [];
        $scope.shoppingcartItemCount = 0;
        $scope.$broadcast('logout');
        $state.go("/");
    };

    $scope.onGetUserDetailsSuccess = function (response) {
        $scope.userDetails = response.data;
        $rootScope.userDetails = $scope.userDetails;
        storageService.set("userDetails",$scope.userDetails);
        $scope.userName = $scope.userDetails.firstName;
		$scope.getShoppingCartItems();
	};

    $scope.onGetUserDetailsFailure = function () {
        console.log('onGetUserDetailsFailure');
	};

	$scope.onGetShoppingCartItemsSuccess = function (response) {
        updateCart(response);
	};

	$scope.$on('refreshCart',function (event,args) {
		updateCart(args);
    });

	var updateCart = function (res) {
        $scope.shoppingcartItems = res.data;
        $scope.shoppingcartItemCount = $scope.shoppingcartItems.length;
        storageService.setLocal("cartItems",$scope.shoppingcartItems);
    };

    $scope.onGetShoppingCartItemsFailure = function () {
		console.log('onGetShoppingCartItemsFailure');
		storageService.set("cartItems",	$scope.shoppingcartItems);
	};

	$scope.onGetDesignersSuccess = function (response) {
		$scope.designers = response.data;
	};
	$scope.onGetDesignersFailure = function (response) {
		console.log("onGetDesignersFailure:",response);
	};

	$scope.onGetProductsSuccess = function (response) {
		$scope.allProductInfo = response.data;
		$scope.allProducts = response.data.products;
		$scope.products = response.data.products;
		// applyFilters();
		storageService.set("products",$scope.products);
	};

	$scope.onGetProductsFailure = function (response) {
		console.log("onGetProductsFailure:",response);
	}

	$scope.onGetCategorySuccess = function (response) {
		$scope.productCategories = response.data;
        $scope.menProducts = filteredProductsCategory('men');
        $scope.womenProducts = filteredProductsCategory('women');
	}

	$scope.onGetCategoryFailure = function (response) {
		console.log('onGetCategoryFailure');
	}

	$scope.getFilterKey = function (name) {
        var filterKeyNames = {
            'prices':'price',
            'categories':'masterCategory',
            'subCategories':'subCategories',
            'brands':'brandName',
            'colours':'colours',
            'sizes':'sizes'
        };
        return filterKeyNames[name];
    };

	//Web View Methods
	$scope.addFilter = function(name,key,val,checked){
		var filter = {name:name,key:key,value:val};
		if(key=='gender' || key == 'masterCategory'){
			$scope.searchQuery[key] = val;
			var filterUpdated = false;
			$scope.queryFilters = $scope.queryFilters.map(function (queryFilter) {
				if(queryFilter.key == 'gender'){
					filterUpdated = true;
					queryFilter.name = name;
					queryFilter.val = val;
				}
				return queryFilter;
			});
			if(!filterUpdated){
				if(checked){
                    $scope.queryFilters.push({name:name,key:key});
				} else {
                    delete $scope.searchQuery[key];
                    $scope.queryFilters = $scope.queryFilters.filter(function (aFilter) {
                    	return aFilter.name != name;
                    });
				}
			}
			applyFilters();
			return;
		}
		var alreadyAddedFilter = $scope.productFilters.contains(filter);
		if (alreadyAddedFilter) {
            $scope.productFilters = $scope.productFilters.filter(function(name){
            	return !angular.equals(filter,name);
            });
		} else {
            $scope.productFilters.push(filter);
        }
		applyFilters();
	};

    $scope.removeFilter = function (filter) {
        console.log('Removing Filter:',filter.name);
        if (filter.key == 'gender' || filter.key == 'masterCategory'){
            for (var filterIndex = 0; filterIndex < $scope.queryFilters.length; filterIndex++) {
                var existingFilter = $scope.queryFilters[filterIndex];
                var filterIsPresent = angular.equals(filter,existingFilter);
                if (filterIsPresent) {
                	delete $scope.searchQuery[filter.key];
                    $scope.queryFilters.splice(filterIndex,1);
                    console.log('Filter Removed');
                    applyFilters();
                    return true;
                }
            }
		}
        for (var filterIndex = 0; filterIndex < $scope.productFilters.length; filterIndex++) {
            var existingFilter = $scope.productFilters[filterIndex];
            var filterIsPresent = angular.equals(filter,existingFilter);
            if (filterIsPresent) {
                $scope.productFilters.splice(filterIndex,1);
                applyFilters();
                return true;
            }
        }
        applyFilters();
        return false;
    }

    $scope.isFilterApplied = function (name) {
		for(var index in $scope.productFilters){
			if($scope.productFilters[index].name == name){
				return true;
			}
		}
		return '';
    }

    $scope.shouldShowResetFilters = function () {
        var shouldShowResetFilters = $scope.queryFilters.length > 0;
    	shouldShowResetFilters = shouldShowResetFilters || $scope.productFilters.length > 0;
		return shouldShowResetFilters;
    }

    $scope.resetGender = function () {
        delete $scope.searchQuery['gender'];
        $scope.queryFilters = $scope.queryFilters.filter(function (filter) {
			return filter.key != 'gender';
        });
        applyFilters();
    };

    $scope.resetFilters = function(){
    	delete $scope.searchQuery['gender'];
        delete $scope.searchQuery['masterCategory'];
    	$scope.queryFilters.length = 0;
		$scope.productFilters.length = 0;
		applyFilters();
	}

	//custom methods
	var applyFilters = function(){
	    $scope.getProducts($scope.filterParams);
	};

    var filteredProductsCategory = function(gender){ 
    	return $scope.productCategories.filter(function (product) { 
    		return product.gender == gender; 
    	}); 
    }

	var hideModal = function(modal) {
       return angular.element('#'+modal).modal('hide');
	};
    var showModal = function(modal) {
        return angular.element('#'+modal).modal('show');
    };
	angular.element('#loginModal').on('hidden.bs.modal', function () {
		$scope.alertHidden();
	});
    if($scope.isCustomizable){
    	$scope.searchQuery.isCustomizable = $scope.isCustomizable;
    	applyFilters();
    }
	if ($scope.filterGender) {
        $scope.addFilter($scope.filterGender+' products', "gender", $scope.filterGender);
        $scope.addFilter($scope.topCategory, "masterCategory", $scope.topCategory);
        if($scope.subCategory){
            $scope.addFilter($scope.subCategory, "subCategories", $scope.subCategory);
		}
	} else {
		$scope.getDesigners();
		$scope.getCategories();
		$scope.getProducts($scope.filterParams);
		if(storageService.get("accessToken")){
            $rootScope.userLoggedIn = true;
            $scope.getUserDetails();
        } else {
			$scope.shoppingcartItems = storageService.get('guestCartItems');
			if(!$scope.shoppingcartItems) $scope.shoppingcartItems = [];
            $scope.shoppingcartItemCount = $scope.shoppingcartItems.length;
		}
	}

    $scope.hasImaget = function (designer) {
        return designer.avatarUrl != undefined;
    }

});