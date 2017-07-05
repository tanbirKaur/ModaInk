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

    httpService.getProductReviews = function (productId,successCallback,failureCallback) {
        httpService.callHttp("GET","products/"+productId+"/reviews",{},{},{},function (response) {
            redirectCallback(response,emptyFunction,successCallback);
        },function (response) {
            redirectCallback(response,httpFailed,failureCallback,"getProductReviews");
        },true);
    }

    httpService.searchProducts = function (query,successCallback,failureCallback) {
        httpService.callHttp("GET","/products/searchService/search/querySearch",query,{},{},function (response) {
            redirectCallback(response,emptyFunction,successCallback);
        },function (response) {
            redirectCallback(response,httpFailed,failureCallback,"searchProducts");
        },true);
    }

    httpService.getDesigners = function (successCallback,failureCallback) {
        httpService.callHttp("POST","designers/searchService/search/filteredSearch",{},{},{},function (response) {
            redirectCallback(response,emptyFunction,successCallback);
        },function (response) {
            redirectCallback(response,httpFailed,failureCallback,"getDesigners");
        },true);
    }

    httpService.addNewReview = function (productId,review,successCallback,failureCallback) {
        httpService.callHttp("POST","products/"+productId+"/reviews",{},{},review,function (response) {
            redirectCallback(response,emptyFunction,successCallback);
        },function (response) {
            redirectCallback(response,httpFailed,failureCallback,"addNewReview");
        });
    }

    httpService.createOrder = function (orderInfo,successCallback,failureCallback) {
        httpService.callHttp("POST","orders",{},{},orderInfo,function (response) {
            redirectCallback(response,emptyFunction,successCallback);
        },function (response) {
            redirectCallback(response,httpFailed,failureCallback,"createOrder");
        });
    }

    httpService.getPaymentUrl = function (orderId,successCallback,failureCallback) {
        httpService.callHttp("POST","orders/"+orderId+"/makePaymentURL",{},{},{},function (response) {
            redirectCallback(response,emptyFunction,successCallback);
        },function (response) {
            redirectCallback(response,httpFailed,failureCallback,"createOrder");
        });
    }

    httpService.updateBagItemQuantity = function (bagItemId,qty,userId,successCallback,failureCallback) {
        var quantity = {quantity:qty};
        httpService.callHttp("PUT","users/"+userId+"/shoppingcartItems/"+bagItemId,{},{},quantity,function (response) {
            redirectCallback(response,emptyFunction,successCallback);
        },function (response) {
            redirectCallback(response,httpFailed,failureCallback,"updateBagItemQuantity");
        });
    };

    return httpService;
 }]);