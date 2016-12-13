var app = window.app;
app.controller('HomeController', function($scope,$http,callApiService) {
	$scope.homeImageUrl = "images/Home/home_shop_slider.jpg";
	$scope.email;
	$scope.password;
	$scope.login = function () {
		var loginInfo = { "email": "test@mailinator.com","password": "test123" };
		callApiService("POST","users/authenticate",{},loginInfo,$scope.onLoginSuccess,$scope.onLoginFailure);
	}

	$scope.onLoginSuccess = function (response) {
		alert(response);
	}
	$scope.onLoginFailure = function (response) {
		console.log(response);
	}
});