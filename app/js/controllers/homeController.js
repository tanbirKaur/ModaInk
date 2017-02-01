var app = window.app;
app.controller('HomeController', function($scope,$rootScope,$state,$stateParams,httpService,storageService) {
	$scope.homeImageUrl = "images/Home/home_shop_slider.jpg";
	$scope.email;
	$scope.password;
	$scope.userName = undefined;
	$scope.shoppingcartItemCount = 0;
	$scope.productFilters = [{name:'Exclusive',key:'isExclusive',value:'true'}];
	$scope.sortOption = {};
	$scope.filterParams = {};
	$scope.parentCategory = $stateParams.topCategory;
	$scope.subCategory = $stateParams.subCategory;
	$scope.alertHidden = function(){};

	// http Methods
	$scope.login = function () {
		var loginInfo = { "email": $scope.email,"password": $scope.password };
		httpService.login(loginInfo,$scope.onLoginSuccess,$scope.onLoginFailure);
	};

	$scope.getUserDetails = function () {
		httpService.callHttp("GET","users/me",{},{},{},$scope.onGetUserDetailsSuccess,$scope.onGetUserDetailsFailure);
	};

	$scope.getShoppingCartItems= function () {
		httpService.callHttp("GET","users/"+$scope.userDetails.id+"/shoppingcart/items ",{},{},{},$scope.onGetShoppingCartItemsSuccess,$scope.onGetShoppingCartItemsFailure);
	};

	$scope.signUp = function () {
		var signUpInfo = { "email": $scope.email,"password": $scope.password ,"mobile":$scope.contactNumber};
		httpService.callHttp("POST","users",{},{},signUpInfo,$scope.onSignUpSuccess,$scope.onSignUpFailure,true);
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
		params = {};
		var filterInfo = {filters:[],sortBy:[]};
		Object.keys($scope.sortOption).forEach(function(key){
			filterInfo.sortBy.push({sortAttribute:key,sortOrder:$scope.sortOption[key]});
		});
		$scope.productFilters.forEach(function (filter) {
            filterInfo.filters.push({filterName:filter.key,filterMatch:filter.value});
        });
		httpService.callHttp("POST","products/searchService",params,{},filterInfo,$scope.onGetProductsSuccess,$scope.onGetProductsFailure);
	};

	$scope.openMyCart = function () {
		if($rootScope.userLoggedIn){
			$state.go("cart");
		} else {
			showModal("errorModal");
		}
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
	$scope.onLoginSuccess = function (response) {
		var userCreated = response.statusText == "Created";
		if (userCreated) {
			$rootScope.userLoggedIn = true;
			$scope.alertHidden = function () {
				alert("Login Successful!");
			};
			hideModal("loginModal");
            storageService.set("accessToken",response.data.accessToken);
            $scope.getUserDetails();
		}
	};
	$scope.onLoginFailure = function (response) {
        $rootScope.userLoggedIn = false;
		$scope.alertHidden = function () {
			if (!response.data) {
				alert("Oops something went wrong. Login failed!");
			} else {
				alert(response.data.message);
			}
		};
		hideModal("loginModal");
	};

	$scope.onGetUserDetailsSuccess = function (response) {
        $scope.userDetails = response.data;
        storageService.set("userDetails",$scope.userDetails);
        $scope.userName = $scope.userDetails.firstName;
//		$scope.getShoppingCartItems();
	};
    $scope.onGetUserDetailsFailure = function () {
        console.log('onGetUserDetailsFailure');
		$scope.userDetails = {"id":1,"firstName":"Taj","lastName":"Ahmed","email":"test@mailinator.com","mobile":"9999999999","dateOfBirth":null,"avatarUrl":null,"isEmailVerified":false,"isActive":true,"createdBy":null,"updatedBy":null,"createdAt":"2016-12-18T08:51:25.000Z"};
		storageService.set("userDetails",$scope.userDetails);
		$scope.userName = $scope.userDetails.firstName + $scope.userDetails.lastName;
//		$scope.getShoppingCartItems();
	};

	$scope.onGetShoppingCartItemsSuccess = function (response) {
		$scope.shoppingcartItems = response.data;
	};
    $scope.onGetShoppingCartItemsFailure = function () {
        $scope.shoppingcartItems = [{"id":11,"item":{"skuCode":"PR3-XL-PK","quantity":10,"price":2999,"discountPrice":100,"variantValues":[{"id":11,"name":"XL","description":"Extra Large","variant":{"name":"Size"}},{"id":16,"name":"#dd2f86","description":"pink","variant":{"name":"Colour"}}],"product":{"id":15,"name":"Product 3","description":"This is the description of product 3","isExclusive":false,"designer":{"id":7,"firstName":"Designer 2","lastName":"Mailinator"},"category":{"id":8,"name":"Tops","createdAt":"2016-12-16T20:18:45.000Z"},"images":[{"url":"http://modaink.s3.url/image1.png","sortOrder":1},{"url":"http://modaink.s3.url/image2.png","sortOrder":2},{"url":"http://modaink.s3.url/image3.png","sortOrder":3}]}}},{"id":12,"item":{"skuCode":"PR3-S-PK","quantity":10,"price":2999,"discountPrice":100,"variantValues":[{"id":8,"name":"S","description":"Small","variant":{"name":"Size"}},{"id":16,"name":"#dd2f86","description":"pink","variant":{"name":"Colour"}}],"product":{"id":15,"name":"Product 3","description":"This is the description of product 3","isExclusive":false,"designer":{"id":7,"firstName":"Designer 2","lastName":"Mailinator"},"category":{"id":8,"name":"Tops","createdAt":"2016-12-16T20:18:45.000Z"},"images":[{"url":"http://modaink.s3.url/image1.png","sortOrder":1},{"url":"http://modaink.s3.url/image2.png","sortOrder":2},{"url":"http://modaink.s3.url/image3.png","sortOrder":3}]}}}];
		$scope.shoppingcartItemCount = $scope.shoppingcartItems.length;
		storageService.set("cartItems",$scope.shoppingcartItems);
		console.log('onGetShoppingCartItemsFailure');
		$scope.shoppingcartItems = [{"id":11,"item":{"skuCode":"PR3-XL-PK","quantity":10,"price":2999,"discountPrice":100,"variantValues":[{"id":11,"name":"XL","description":"Extra Large","variant":{"name":"Size"}},{"id":16,"name":"#dd2f86","description":"pink","variant":{"name":"Colour"}}],"product":{"id":15,"name":"Product 3","description":"This is the description of product 3","isExclusive":false,"designer":{"id":7,"firstName":"Designer 2","lastName":"Mailinator"},"category":{"id":8,"name":"Tops","createdAt":"2016-12-16T20:18:45.000Z"},"images":[{"url":"http://modaink.s3.url/image1.png","sortOrder":1},{"url":"http://modaink.s3.url/image2.png","sortOrder":2},{"url":"http://modaink.s3.url/image3.png","sortOrder":3}]}}},{"id":12,"item":{"skuCode":"PR3-S-PK","quantity":10,"price":2999,"discountPrice":100,"variantValues":[{"id":8,"name":"S","description":"Small","variant":{"name":"Size"}},{"id":16,"name":"#dd2f86","description":"pink","variant":{"name":"Colour"}}],"product":{"id":15,"name":"Product 3","description":"This is the description of product 3","isExclusive":false,"designer":{"id":7,"firstName":"Designer 2","lastName":"Mailinator"},"category":{"id":8,"name":"Tops","createdAt":"2016-12-16T20:18:45.000Z"},"images":[{"url":"http://modaink.s3.url/image1.png","sortOrder":1},{"url":"http://modaink.s3.url/image2.png","sortOrder":2},{"url":"http://modaink.s3.url/image3.png","sortOrder":3}]}}}];
		$scope.shoppingcartItemCount = $scope.shoppingcartItemCount.length;
		storageService.set("cartItems",	$scope.shoppingcartItems);
	};

	$scope.onSignUpSuccess = function (response) {
		$scope.alertHidden = function () {
			var userCreated = response.statusText == "Created";
			if (userCreated) {
				alert("Sign Up Successful!");
			}
		};
		hideModal("registerModal");
	};
	$scope.onSignUpFailure = function (response) {
		if (!response.data) {
			alert("Oops something went wrong. Login failed!");
		} else {
			alert(response.data.message);
		}
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
		alert(response.data.message);
	}

	//Web View Methods
	$scope.addFilter = function(name,key,val){
		var filter = {name:name,key:key,value:val};
		console.log('Adding Filter:',filter.name);
		var alreadyAddedFilter = $scope.productFilters.contains(filter);
		if (!alreadyAddedFilter) {
			$scope.productFilters.push(filter);
			console.log('Filter Added');
		}
		applyFilters();
	};

    $scope.removeFilter = function (filter) {
        console.log('Removing Filter:',filter.name);
        for (var filterIndex = 0; filterIndex < $scope.productFilters.length; filterIndex++) {
            var existingFilter = $scope.productFilters[filterIndex];
            var filterIsPresent = angular.equals(filter,existingFilter);
            if (filterIsPresent) {
                $scope.productFilters.splice(filterIndex,1);
                console.log('Filter Removed');
                break;
            }
        }
        applyFilters();
        return true;
    }


    $scope.resetCheckBoxForCategoryFilter = function (val) {
		$scope.productCategories.forEach(function (category) {
			category.subCategories = category.subCategories.map(function (subCategory) {	
				if (subCategory.name == val) {
					subCategory.checked = false;
				}
				return subCategory;
			});
		});
	}

	$scope.resetFilters = function(){
		$scope.productFilters = [];
		applyFilters();
	}

	$scope.productCountForCategory = function(category){
		return filterProducts($scope.allProducts,"category.name",category).length;
	}

	//custom methods
	var applyFilters = function(){
	    $scope.getProducts($scope.filterParams);
	};

	var filterProducts = function(products,filterKey,value){
		return products.filter(function (product) {
			var keyLevel = 0;
			var obj = product;
			if (filterKey == 'category') {
				var keyName = 'category';
				while(obj[keyName]){
					obj = obj[keyName];
					if (obj.name == value) {
						return true;
					}
					if (obj) {
						keyName = 'subcategory';
					}
				}
			} else if (filterKey == 'gender') {
				obj = obj.category[filterKey];
			}else {
				obj = obj[filterKey];
			}
			return obj == value;
		});
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

	if ($scope.parentCategory) {
		$scope.productFilters.push({key:"category",val:$scope.subCategory});
		applyFilters();
	} else {
		$scope.getDesigners();
		$scope.getCategories();
		$scope.getProducts($scope.filterParams);
	}

    $scope.hasImaget = function (designer) {
        return designer.avatarUrl != undefined;
    }

});