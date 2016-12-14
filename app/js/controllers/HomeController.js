var app = window.app;
app.controller('HomeController', function($scope,$http,httpService,storageService) {
	$scope.homeImageUrl = "images/Home/home_shop_slider.jpg";
	$scope.email;
	$scope.password;
	$scope.login = function () {
		var loginInfo = { "email": $scope.email,"password": $scope.password };
		httpService.callHttp("POST","users/authenticate",{},loginInfo,$scope.onLoginSuccess,$scope.onLoginFailure,true);
	}

	$scope.signUp = function () {
		var signUpInfo = { "email": $scope.email,"password": $scope.password ,"contactNumber":$scope.contactNumber};
		httpService.callHttp("POST","users",{},signUpInfo,$scope.onSignUpSuccess,$scope.onSignUpFailure,true);
	}

	$scope.onLoginSuccess = function (response) {
		var userCreated = response.statusText == "Created";
		if (userCreated) {
			storageService.set("accessToken",response.data.accessToken);
			alert("Login Successful!");
		};
	}
	$scope.onLoginFailure = function (response) {
		alert(response.data.message);
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
});