var app = window.app;
app.factory('callApiService', ['$http', function($http) {
    return function (method,resouceName, headers, data, successCallback, errorCallback) {
		$http({	method: method, 
			url: window.apiUrl+"/"+resouceName,
			headers: headers,
			data:data
		}).then(successCallback, errorCallback);
	};
 }]);