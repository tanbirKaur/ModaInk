var app = window.app;
app.controller('HomeController', function($scope,$http) {
	var method = "POST";
	var data = {};
	var callApiService = function (resouceName, headers, data, successCallback, errorCallback) {
		$http({	method: 'POST', 
			url: window.apiUrl+"/"+resouceName,
			headers: headers,
			data:data
		}).then(successCallback, errorCallback);
	}
	$scope.homeImageUrl = "images/Home/home_shop_slider.jpg";
	$scope.email;
	$scope.password;
	$scope.login = function () {
		var loginInfo = { "email": "test@mailinator.com","password": "test123" };
		callApiService("users/authenticate",{},loginInfo,$scope.onLoginSuccess,$scope.onLoginFailure);
	}

	$scope.onLoginSuccess = function (response) {
		alert(response);
	}
	$scope.onLoginFailure = function (response) {
		console.log(response);
	}
});