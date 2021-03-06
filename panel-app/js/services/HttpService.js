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
            var params = {isApproved:'true'};
            httpService.callHttp("GET","designers",params,{},{},function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"getDesigners");
            });
        };
        httpService.getDesignersWithPendingProfileUpadation = function (successCallback,failureCallback) {
            var params = {isChangesApproved :'false'};
            httpService.callHttp("GET","designers",params,{},{},function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"getDesigners");
            });
        };

        httpService.getDesignerRequests = function (successCallback,failureCallback) {
            var params = {isApproved:'null'};
            httpService.callHttp("GET","designers",params,{},{},function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"getDesignerRequests");
            });
        };

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

        httpService.addApprovedDesigner = function (data,successCallback,failureCallback) {
            httpService.callHttp("POST","designers/asApproved",{},{},data,function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"addApprovedDesigner");
            });
        }

        httpService.updateDesignerDetails = function (designerId,data,successCallback,failureCallback) {
            httpService.callHttp("PUT","designers/"+designerId,{},{},data,function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"updateDesignerDetails");
            });
        }

        httpService.updateDesignerBrandDetails = function (designerId,data,successCallback,failureCallback) {
            httpService.callHttp("PUT","designers/"+designerId+"/brand",{},{},data,function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"updateDesignerBrandDetails");
            });
        }

        httpService.getDesignerBrandDetails = function (designerId,successCallback,failureCallback) {
            httpService.callHttp("GET","designers/"+designerId+"/brand",{},{},{},function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"getDesignerBrandDetails");
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

        httpService.getProductsOfDesigner = function (designerId,successCallback,failureCallback) {
            var url =  "designers/"+designerId+'/products';
            var params = {isApproved:true};
            httpService.callHttp("GET",url,params,{},{},function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"getProducts");
            });
        }

        httpService.getUnApprovedProducts = function (successCallback,failureCallback) {
            var params = {isApproved:'null'};
            httpService.callHttp("GET","products",params,{},{},function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"getUnApprovedProducts");
            });
        };

        httpService.getUnApprovedProductsOfDesigner = function (designerId,successCallback,failureCallback) {
            var url =  "designers/"+designerId+'/products';
            var params = {isApproved:'null'};
            httpService.callHttp("GET",url,params,{},{},function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"getUnApprovedProducts");
            });
        };

        httpService.getUnApprovedChangesProducts = function (successCallback,failureCallback) {
            var params = {isChangesApproved:'null'};
            httpService.callHttp("GET","products",params,{},{},function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"getUnApprovedProducts");
            });
        };

        httpService.getRejectedProducts = function (successCallback,failureCallback) {
            var params = {isApproved:'false'};
            httpService.callHttp("GET","products",params,{},{},function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"getUnApprovedProducts");
            });
        };

        httpService.approveProduct = function (id,successCallback,failureCallback) {
            httpService.callHttp("PUT","products/"+id+"/approve",{},{},{},function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"approveProduct");
            });
        };

        httpService.rejectProduct = function (id,successCallback,failureCallback) {
            httpService.callHttp("PUT","products/"+id+"/reject",{},{},{},function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"rejectProduct");
            });
        };

        httpService.approveProductChanges = function (id,successCallback,failureCallback) {
            httpService.callHttp("PUT","products/"+id+"/approveChanges",{},{},{},function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"approveProductChanges");
            });
        };

        httpService.rejectProductChanges = function (id,successCallback,failureCallback) {
            httpService.callHttp("PUT","products/"+id+"/rejectChanges",{},{},{},function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"rejectProductChanges");
            });
        };

        httpService.approveDesigner = function (id,successCallback,failureCallback) {
            httpService.callHttp("PUT","designers/"+id+"/approve",{},{},{},function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"approveProduct");
            });
        };

        httpService.rejectDesigner = function (id,successCallback,failureCallback) {
            httpService.callHttp("PUT","designers/"+id+"/reject",{},{},{},function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"rejectProduct");
            });
        };

        httpService.createProduct = function(productDetails,successCallback,failureCallback){
            httpService.callHttp("POST","products",{},{},productDetails,function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"createProduct");
            });
        };

        httpService.updateProduct = function(id,productDetails,successCallback,failureCallback){
            httpService.callHttp("PUT","products/"+id,{},{},productDetails,function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"updateProduct");
            });
        };

        httpService.uploadImage = function(type,url,successCallback,failureCallback){
            var headers = {};
            headers['Content-Type'] = undefined;
            var fd = new FormData();
            fd.append('file', url);
            httpService.callHttp("POST","upload/"+type+"/images",{},headers,fd,function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"createProduct");
            });
        };

        httpService.getProductCategories = function(successCallback,failureCallback){
            var params = {includeSubCategories:true};
            httpService.callHttp("GET","categories",params,{},{},function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"getProductCategories");
            });
        };

        httpService.getPayouts = function(from,to,successCallback,failureCallback){
            var designerId =  $rootScope.userDetails.id;
            var params = {from:from,to:to};
            designerId =1;
            httpService.callHttp("GET","designers/"+designerId+"/payoutInvoices",params,{},{},function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"getPayouts");
            });
        };

        httpService.verifyEmail = function (info,successCallback,failureCallback) {
            httpService.callHttp("PUT","designers/verifyEmail",info,{},{},function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"login");
            },true);
        };

        httpService.resetPwd = function (email,token,newPassword, successCallback,failureCallback) {
            var params = {email:email, token: token};

            httpService.callHttp("PUT","designers/resetPassword",params,{},newPassword,function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"login");
            },true);
        };

        httpService.sendResetLink = function (email, successCallback,failureCallback) {
            var params = {email:email};
            httpService.callHttp("PUT","designers/forgotPassword",params,{},{},function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"sendResetLink");
            });
        };

        httpService.deactiveProduct = function (id, successCallback,failureCallback) {

            httpService.callHttp("PUT","/products/" + id + "/deactivate",{},{},{},function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"deactiveProduct");
            });
        };
        httpService.activeProduct = function (id, successCallback,failureCallback) {

            httpService.callHttp("PUT","/products/" + id + "/activate",{},{},{},function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"activeProduct");
            });
        };

        httpService.deactivateDesigner = function (id, successCallback,failureCallback) {

            httpService.callHttp("PUT","/designers/" + id + "/deactivate",{},{},{},function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"deactivateDesigner");
            });
        };

        httpService.activateDesigner = function (id, successCallback,failureCallback) {

            httpService.callHttp("PUT","/designers/" + id + "/activate",{},{},{},function (response) {
                redirectCallback(response,emptyFunction,successCallback);
            },function (response) {
                redirectCallback(response,httpFailed,failureCallback,"activateDesigner");
            });
        };


        return httpService;
    }]);