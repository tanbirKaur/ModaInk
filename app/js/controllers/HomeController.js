var app = window.app;
app.controller('HomeController', function($scope,httpService,storageService) {
	$scope.homeImageUrl = "images/Home/home_shop_slider.jpg";
	$scope.email;
	$scope.password;
	$scope.menProducts = undefined;
	$scope.womenProducts = undefined;
	$scope.alertHidden = function(){};

	// http Methods
	$scope.login = function () {
		var loginInfo = { "email": $scope.email,"password": $scope.password };
		httpService.callHttp("POST","users/authenticate",{},{},loginInfo,$scope.onLoginSuccess,$scope.onLoginFailure,true);
	}

	$scope.signUp = function () {
		var signUpInfo = { "email": $scope.email,"password": $scope.password ,"mobile":$scope.contactNumber};
		httpService.callHttp("POST","users",{},{},signUpInfo,$scope.onSignUpSuccess,$scope.onSignUpFailure,true);
	}

	$scope.getDesigners = function () {
		httpService.callHttp("GET","designers",{},{},{},$scope.onGetDesignersSuccess,$scope.onGetDesignersFailure,true);
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
		console.log("onGetDesignersFailure:"+response);
	}

	$scope.onGetProductsSuccess = function (response) {
		$scope.products = response.data;
		$scope.exclusiveProducts = filteredProducts("isExclusive",true);
		storageService.set("products",$scope.products);
	}
	$scope.onGetProductsFailure = function (response) {
		console.log("onGetProductsFailure:"+response);
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
	//custom methods
	var filteredProductsCategory = function(gender){
		return $scope.productCategories.filter(function (product) {
			return product.gender == gender;
		});
	}

	var filteredProducts = function(filterKey,value){
		return $scope.products.filter(function (product) {
			return product[filterKey] == value;
		});
	}

	var hideModal = function(modal) {
       return angular.element('#'+modal).modal('hide');
	}
	angular.element('#loginModal').on('hidden.bs.modal', function () {
		$scope.alertHidden();
	});
});