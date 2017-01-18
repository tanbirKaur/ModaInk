angular.module('portal-modaink')
       .factory('httpService', ['$rootScope','$http','storageService', function($rootScope,$http,storageService) {
		var emptyFunction = function (response) {}
       	var redirectCallback = function (res,localCallback,ctrlCallback,name) {
			localCallback(res,name);
			if (ctrlCallback) {
				ctrlCallback(res);
			};
       	}

       	var httpFailed = function (res,name) {
       		console.log('Failed:'+name);
       	}

   		var onDesignerLoginSuccess = function (response) {
			storageService.set('accessToken',response.data.accessToken);
			storageService.set('isAdmin',true);
			$rootScope.userLoggedIn = true;
		}

		var onGetCurrentUserDetails = function (response){
			$rootScope.userDetails = response.data;
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

		httpService.login = function (loginInfo,successCallback,failureCallback) {
			var url = storageService.get("isAdmin") ? "admins/authenticate/" : "designers/authenticate/"
			httpService.callHttp("POST",url,{},{},loginInfo,function (response) {
				redirectCallback(response,onDesignerLoginSuccess,successCallback);
			},function (response) {
				redirectCallback(response,httpFailed,failureCallback,"login");
			},true);
		}

		httpService.getDesigners = function (successCallback,failureCallback) {
			httpService.callHttp("GET","designers/publicInfo",{},{},{},function (response) {
				redirectCallback(response,emptyFunction,successCallback);
			},function (response) {
				redirectCallback(response,httpFailed,failureCallback,"getDesigners");
			},true);
		}

		httpService.getCurrentUserDetails = function(successCallback,failureCallback){
			var url = storageService.get("isAdmin") ? "admins/me" : "designers/me"
			httpService.callHttp("GET",url,{},{},{},function (response) {
				redirectCallback(response,onGetCurrentUserDetails,successCallback);
			},function (response) {
				redirectCallback(response,httpFailed,failureCallback,"getCurrentUserDetails");
			});
		}

		httpService.getDesignerDetails = function (designerId,successCallback,failureCallback) {
			httpService.callHttp("GET","designers/"+designerId,{},{},{},function (response) {
				redirectCallback(response,emptyFunction,successCallback);
			},function (response) {
				redirectCallback(response,httpFailed,failureCallback,"getDesignerDetails");
			});
		}

		httpService.getProducts = function (designerId,successCallback,failureCallback) {
			var url = storageService.get("isAdmin") ? "products" : "designers/"+designerId+'/products';
			var params = {isApproved:true};
			httpService.callHttp("GET",url,params,{},{},function (response) {
				redirectCallback(response,emptyFunction,successCallback);
			},function (response) {
				redirectCallback(response,httpFailed,failureCallback,"getProducts");
			});
		}

		httpService.createProduct = function(productDetails,successCallback,failureCallback){
			httpService.callHttp("POST","products",{},{},productDetails,function (response) {
				redirectCallback(response,emptyFunction,successCallback);
			},function (response) {
				redirectCallback(response,httpFailed,failureCallback,"createProduct");
			});
		}

		// httpService.uploadImage = function(type,url,successCallback,failureCallback){
		// 	httpService.callHttp("POST","upload/"+type+"/images",{},{},{},function (response) {
		// 		redirectCallback(response,emptyFunction,successCallback);
		// 	},function (response) {
		// 		redirectCallback(response,httpFailed,failureCallback,"createProduct");
		// 	});
		// }

		httpService.getProductCategories = function(successCallback,failureCallback){
			var params = {includeSubCategories:true};
			httpService.callHttp("GET","categories",params,{},{},function (response) {
				redirectCallback(response,emptyFunction,successCallback);
			},function (response) {
				redirectCallback(response,httpFailed,failureCallback,"getProductCategories");
			});
		}
		return httpService;
	 }]);