angular.module('portal-modaink')
       .factory('httpService', ['$http','storageService', function($http,storageService) {
		var httpService = {};
	    httpService.callHttp = function (method, resouceName, params, headers, data, successCallback, errorCallback,noAuthentication) {
	    	if (!noAuthentication) {
		    	headers.Authorization = 'Bearer ' + storageService.get("accessToken");
	    	};
				$http({	method: method, 
				url: window.apiUrl+"/"+resouceName,
				headers: headers,
				data:data,
				params:params
			}).then(successCallback, errorCallback);
		};
		return httpService;
	 }]);