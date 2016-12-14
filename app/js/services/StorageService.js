var app = window.app;
app.factory('storageService', function(localStorageService) {
	var storageService = {};
	storageService.get = function (key) {
		return callStorageMethod("get",key);
	}

	storageService.set = function (key,val) {
		callStorageMethod("set",key,val);
	}

	storageService.remove = function (key) {
		callStorageMethod("remove",key);
	}

	var callStorageMethod = function (method, key, val) {
		if (localStorageService.isSupported) {
			return localStorageService[method](key,val);
		} else {
			return localStorage[method+"Item"](key,val);
		}
	}
	return storageService;
 });