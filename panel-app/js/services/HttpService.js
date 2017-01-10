angular.module('portal-modaink')
       .factory('httpService', ['$http','storageService', function($http,storageService) {
		var emptyFunction = function (response) {}
       	var redirectCallback = function (res,localCallback,ctrlCallback,name) {
			localCallback(res,name);
			if (ctrlCallback) {
				ctrlCallback(res);
			};
       	}

       	var httpFailed = function (res,name) {
       		console.log(name+' Failed');
       	}

   		var onDesignerLoginSuccess = function (response) {
			storageService.set('accessToken',response.data.accessToken);
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
				redirectCallback(response,onDesignerLoginSuccess,successCallback);
			},function (response) {
				redirectCallback(response,httpFailed,failureCallback,httpService.designerLogin);
			},true);
		}

		httpService.getDesigners = function (successCallback,failureCallback) {
			httpService.callHttp("GET","designers/publicInfo",{},{},{},function (response) {
				redirectCallback(response,emptyFunction,successCallback);
			},function (response) {
				redirectCallback(response,httpFailed,failureCallback,httpService.getDesigners);
			},true);
		}

		httpService.getDesignerDetails = function (designerId,successCallback,failureCallback) {
			httpService.callHttp("GET","designers/"+designerId,{},{},{},function (response) {
				redirectCallback(response,emptyFunction,successCallback);
			},function (response) {
				redirectCallback(response,httpFailed,failureCallback,httpService.getDesignerDetails);
			});
		}

		httpService.getDesignerProducts = function (designerId,successCallback,failureCallback) {
			var params = {designerId : designerId};
			httpService.callHttp("GET","products",params,{},{},function (response) {
				redirectCallback(response,emptyFunction,successCallback);
			},function (response) {
				redirectCallback(response,httpFailed,failureCallback,httpService.getDesignerProducts);
			});
		}


		return httpService;
	 }]);