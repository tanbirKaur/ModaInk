angular.module('portal-modaink')
       .factory('httpService', ['$http','storageService', function($http,storageService) {
   		var onDesignerLoginSuccess = function (response) {
			storageService.set('accessToken',response.data.accessToken);
		}
		var onDesignerLoginFailure = function (response) {
			console.log(response);
		}

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

		httpService.designerLogin = function (loginInfo,successCallback,failureCallback) {
			httpService.callHttp("POST","designers/authenticate/",{},{},loginInfo,function (response) {
				onDesignerLoginSuccess(response);
				if (successCallback) {
					successCallback(response);
				};
			},function (response) {
				onDesignerLoginFailure(response);
				if (failureCallback) {
					failureCallback(response);
				};
			},true);
		}


		return httpService;
	 }]);