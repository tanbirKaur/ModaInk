var app = window.app;
app.factory('httpService', ['$http','storageService', function($http,storageService) {
    var emptyFunction = function (response) {}
    var httpFailed = function (res,name) { console.log('Failed:'+name); }
    var redirectCallback = function (res,localCallback,ctrlCallback,name) {
        localCallback(res,name);
        if (ctrlCallback) {
            ctrlCallback(res);
        };
    }


    var httpService = {};
    httpService.callHttp = function (method, resouceName, params, headers, data, successCallback, errorCallback,noAuthentication) {
        if (!noAuthentication) {
            headers.Authorization = 'Bearer ' + storageService.get("accessToken");
        };
            $http({ method: method, 
            url: window.apiUrl+"/"+resouceName,
            headers: headers,
            data:data,
            params:params
        }).then(successCallback, errorCallback);
    };

    httpService.login = function (loginInfo,successCallback,failureCallback) {
        httpService.callHttp("POST","users/authenticate",{},{},loginInfo,function (response) {
            redirectCallback(response,emptyFunction,successCallback);
        },function (response) {
            redirectCallback(response,httpFailed,failureCallback,"login");
        },true);
    }


    httpService.verifyEmail = function (info,successCallback,failureCallback) {
        httpService.callHttp("PUT","designers/verifyEmail",{},info,{},function (response) {
            redirectCallback(response,emptyFunction,successCallback);
        },function (response) {
            redirectCallback(response,httpFailed,failureCallback,"login");
        },true);
    }

    return httpService;
 }]);