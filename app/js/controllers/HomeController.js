var app = window.app;
app.controller('HomeController', function($scope,httpService,storageService) {
	$scope.homeImageUrl = "images/Home/home_shop_slider.jpg";
	$scope.email;
	$scope.password;
	$scope.menProducts = undefined;
	$scope.womenProducts = undefined;
	$scope.filterApplied = false;
	$scope.productFilters = [{key:"isExclusive",val:true}];
	$scope.alertHidden = function(){};

	// http Methods
	$scope.login = function () {
		var loginInfo = { "email": $scope.email,"password": $scope.password };
		httpService.callHttp("POST","users/authenticate",{},{},loginInfo,$scope.onLoginSuccess,$scope.onLoginFailure,true);
	}

	$scope.getUserDetails = function () {
		httpService.callHttp("GET","users/me",{},{},{},$scope.onGetUserDetailsSuccess,$scope.onGetUserDetailsFailure);
	}

	$scope.signUp = function () {
		var signUpInfo = { "email": $scope.email,"password": $scope.password ,"mobile":$scope.contactNumber};
		httpService.callHttp("POST","users",{},{},signUpInfo,$scope.onSignUpSuccess,$scope.onSignUpFailure,true);
	}

	$scope.getDesigners = function () {
		httpService.callHttp("GET","designers/publicInfo",{},{},{},$scope.onGetDesignersSuccess,$scope.onGetDesignersFailure,true);
	}

	$scope.getCategories = function () {
		var params = {includeSubCategories:true};
		httpService.callHttp("GET","categories",params,{},{},$scope.onGetCategorySuccess,$scope.onGetCategoryFailure,true);
	}

	$scope.getProducts = function (params) {
		if (!params) params = {};
		httpService.callHttp("GET","products",params,{},{},$scope.onGetProductsSuccess,$scope.onGetProductsFailure,true);
	}

	// http Success and Failure Methods
	$scope.onLoginSuccess = function (response) {
		var userCreated = response.statusText == "Created";
		if (userCreated) {
			$scope.alertHidden = function () {
				storageService.set("accessToken",response.data.accessToken);
				$scope.getUserDetails();
				alert("Login Successful!");
			}
			hideModal("loginModal");
		};
	}
	$scope.onLoginFailure = function (response) {
		$scope.alertHidden = function () {
			if (!response.data) {
				alert("Oops something went wrong. Login failed!");
			} else {
				alert(response.data.message);
			}
		}
		hideModal("loginModal");
	}

	$scope.onGetUserDetailsSuccess = function (response) {
		$scope.userDetails = response.data;
	}
	$scope.onGetUserDetailsFailure = function (response) {
		console.log('onGetUserDetailsFailure');
	}

	$scope.onSignUpSuccess = function (response) {
		$scope.alertHidden = function () {
			var userCreated = response.statusText == "Created";
			if (userCreated) {
				alert("Sign Up Successful!");
			};
		}
		hideModal("registerModal");
	}
	$scope.onSignUpFailure = function (response) {
		if (!response.data) {
			alert("Oops something went wrong. Login failed!");
		} else {
			alert(response.data.message);
		}
	}

	$scope.onGetDesignersSuccess = function (response) {
		$scope.designers = response.data;
	}
	$scope.onGetDesignersFailure = function (response) {
		console.log("onGetDesignersFailure:",response);
	}

	$scope.onGetProductsSuccess = function (response) {
		$scope.allProducts = response.data;
		$scope.products = response.data;
		applyFilters();
		storageService.set("products",$scope.products);
	}

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
	$scope.getDesigners();
	$scope.getCategories();
	$scope.getProducts();
	//Web View Methods
	$scope.addFilter = function(key,val){
		var filter = {key:key,val:val};
		console.log('Adding Filter:',filter);
		var alreadyAddedFilter = $scope.productFilters.contains(filter);
		if (!alreadyAddedFilter) {
			$scope.productFilters.push(filter);
			console.log('Filter Added');
		};
		applyFilters();
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

	$scope.removeFilter = function (key,val,checked) {
		if (checked) {
			return false;
		}
		var filter = {key:key,val:val};
		console.log('Removing Filter:',filter);
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

	$scope.resetFilters = function(){
		$scope.productFilters = [];
		applyFilters();
	}

	$scope.productCountForCategory = function(category){
		return filterProducts($scope.allProducts,"category.name",category).length;
	}

	//custom methods
	var applyFilters = function(){
		var products = [];
		if ($scope.productFilters.length == 0) {
			$scope.products = $scope.allProducts;
		}else {$scope.productFilters.forEach(function (filter) {
			filterProducts($scope.allProducts,filter.key,filter.val).forEach(function (product) {
					products.push(product);
				})
			});
			$scope.products = products;
		}
	}

	var filterProducts = function(products,filterKey,value){
		var keys = filterKey.split('.');
		return products.filter(function (product) {
			var keyLevel = 0;
			var obj = product;
			while(keyLevel < keys.length) obj = obj[keys[keyLevel++]];
			return obj == value;
		});
	}
	var filteredProductsCategory = function(gender){
		return $scope.productCategories.filter(function (product) {
			return product.gender == gender;
		});
	}

	var hideModal = function(modal) {
       return angular.element('#'+modal).modal('hide');
	}
	angular.element('#loginModal').on('hidden.bs.modal', function () {
		$scope.alertHidden();
	});
});