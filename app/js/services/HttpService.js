var app = window.app;
app.factory('httpService', ['$http', function($http,storageService) {
	var httpService = {};
    httpService.callHttp = function (method,resouceName, headers, data, successCallback, errorCallback,noAuthentication) {
    	if (!noAuthentication) {
	    	headers.accessToken = storageService.get("accessToken");
    	};
		$http({	method: method, 
			url: window.apiUrl+"/"+resouceName,
			headers: headers,
			data:data
		}).then(successCallback, errorCallback);
	};
	return httpService;
 }]);