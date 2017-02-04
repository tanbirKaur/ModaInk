var app = window.app;
app.factory('storageService', function(localStorageService) {
	var storageService = {};
	var localInfo = {};
	storageService.get = function (key) {
		return callStorageMethod("get",key);
	}

	storageService.set = function (key,val) {
		callStorageMethod("set",key,val);
	}

	storageService.remove = function (key) {
		callStorageMethod("remove",key);
	}

    storageService.removeAll = function () {
        localStorage.clear();
        localStorageService.clearAll();
    };

    //save locally instead of storage
    storageService.getLocal = function (key) {
        return localInfo[key];
    }

    storageService.setLocal = function (key,val) {
        localInfo[key] = val;
    }

    storageService.removeLocal = function (key) {
        delete localInfo[key]
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