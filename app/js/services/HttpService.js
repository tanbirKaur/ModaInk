var app = window.app;
app.factory('httpService', ['$http', function($http) {
	var httpService = {};
    httpService.callHttp = function (method,resouceName, headers, data, successCallback, errorCallback) {
		$http({	method: method, 
			url: window.apiUrl+"/"+resouceName,
			headers: headers,
			data:data
		}).then(successCallback, errorCallback);
	};
	return httpService;
 }]);