var app = window.app;
app.controller('HomeController', function($scope,$http,httpService,storageService) {
	$scope.homeImageUrl = "images/Home/home_shop_slider.jpg";
	$scope.email;
	$scope.password;

	// http Methods
	$scope.login = function () {
		var loginInfo = { "email": $scope.email,"password": $scope.password };
		httpService.callHttp("POST","users/authenticate",{},loginInfo,$scope.onLoginSuccess,$scope.onLoginFailure,true);
	}

	$scope.signUp = function () {
		var signUpInfo = { "email": $scope.email,"password": $scope.password ,"contactNumber":$scope.contactNumber};
		httpService.callHttp("POST","users",{},signUpInfo,$scope.onSignUpSuccess,$scope.onSignUpFailure,true);
	}

	$scope.getDesigners = function () {
		httpService.callHttp("GET","designers",{},{},$scope.onGetDesignersSuccess,$scope.onGetDesignersFailure,true);
	}

	// http Success and Failure Methods
	$scope.onLoginSuccess = function (response) {
		var userCreated = response.statusText == "Created";
		if (userCreated) {
			storageService.set("accessToken",response.data.accessToken);
			alert("Login Successful!");
		};
	}
	$scope.onLoginFailure = function (response) {
		if (!response.data) {
			alert("Oops something went wrong. Login failed!");
		} else {
			alert(response.data.message);
		}
	}

	$scope.onSignUpSuccess = function (response) {
		console.log("SIGN UP: ",response);
		// var userCreated = response.statusText == "Created";
		// if (userCreated) {
		// 	storageService.set("accessToken",response.data.accessToken);
		// 	alert("Login Successful!");
		// };
	}
	$scope.onSignUpFailure = function (response) {
		alert(response.data.message);
	}

	$scope.onGetDesignersSuccess = function (response) {
		$scope.designers = response.data;
	}
	$scope.onGetDesignersFailure = function (response) {
		alert(response.data.message);
	}

	$scope.getDesigners();
});