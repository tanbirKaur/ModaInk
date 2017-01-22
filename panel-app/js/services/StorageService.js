angular.module('portal-modaink')
  .factory('storageService',['localStorageService' ,function(localStorageService) {
	var storageService = {};
	storageService.get = function (key) {
		return callStorageMethod("get",key);
	};

	storageService.set = function (key,val) {
		callStorageMethod("set",key,val);
	};

	storageService.remove = function (key) {
		callStorageMethod("remove",key);
    };

	storageService.clear = function () {
	  if (localStorageService.isSupported) {
		  return localStorageService.clearAll();
	  } else {
		  return localStorage.clear();
	  }
	};

	var callStorageMethod = function (method, key, val) {
		if (localStorageService.isSupported) {
			return localStorageService[method](key,val);
		} else {
			return localStorage[method+"Item"](key,val);
		}
	}
	return storageService;
 }]);