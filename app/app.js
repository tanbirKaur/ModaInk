var app = angular.module("ModaInk", ["ui.router","LocalStorageModule","angular.filter",'satellizer']);
window.app == app;
window.apiUrl = "http://dev.modaink.com/api";
 app.config(function($locationProvider, $stateProvider, $urlRouterProvider, $authProvider,localStorageServiceProvider){
	$stateProvider
		.state("index", {
			url: "/",
			templateUrl : "views/home.html",
			controller : "HomeController"
		})
		.state("madeToOrder",{ 	
			url : '/madeToOrder',
			templateUrl:"views/made-to-order.html",
		})
		.state("customization",{ 	
			url : '/customization',
			templateUrl:"views/customize-how-it-works.html",
			// controller : "logoutController"
		})
		.state("customize",{ 	
			url : '/customize',
			templateUrl:"views/customize.html",
			// controller : "logoutController"
		})	
		.state("footwear",{ 
			url : '/footwear',
			templateUrl:"views/footwear.html",
		})

		.state("/", {
			url: "/products?exclusive",
			templateUrl : "views/products.html",
			controller : "HomeController"
		})
		.state("products", {
			url: "/products/:gender/:topCategory?subCategory",
			templateUrl : "views/products.html",
			controller : "HomeController"
		})

		.state("designers-list", {
			url: "/designers",
			templateUrl : "views/designer-list.html",
			controller : 'DesignersController'
		})
		.state('designer-details', {
			templateUrl : "views/designer-details.html",
			url : "/designer-details/:designerId", 
			controller : 'DesignerDetailsController'
		})
		.state('designer-collections', {
			templateUrl : "views/designer-collections.html",
			url : "/designer/collections",
			// controller : 'designerLabelsController'
		})
		.state('product-details', {
			templateUrl : "views/product-details.html",
			url : "/product-details/:productId/:designerId", 
			controller : 'DesignerLabelsController'
		})
		.state("cart", {
			url: "/checkout/cart",
			templateUrl : "views/cart.html",
			controller : "UserProfileController"
		})
		.state("billing-details", {
			url:"/checkout/billing-details",
			templateUrl : "views/billing-details.html",
			controller:'UserProfileController'
		})
		.state("payment-method", {
			url:"/checkout/payment",
			templateUrl : "views/payment-method.html"
		})
		.state("login", {
			url: "/login",
			templateUrl : "views/login.html",
		    controller : "HomeController"
		})
		.state("women", {
			url:"/women",
			templateUrl : "views/women.html"
		})
		.state("men", {
			url:"/men",
			templateUrl : "views/men.html"
		})
		.state("accessories", {
			url:"/accessories",
			templateUrl : "views/accessories.html"
		})
		.state("diamond-designers", {
			url:"/diamond-designers",
			templateUrl : "views/dimond-designers.html"
		})
		.state("my-profile", {
			url:"/myProfile",
			templateUrl : "views/user-profile.html",
			controller: "UserProfileController"
		})
		.state("become-seller", {
			url:"/becomeSeller",
			templateUrl : "views/vendor-signup-and how-it-works.html",
			controller:'DesignerLabelsController'
		})
		.state("about-us", {
			url:"/aboutUs",
			templateUrl : "views/about-us.html"
		})
		.state("privacy-policy", {
			url:"/privacy-policy",
			templateUrl : "views/privacy-policy.html"
		})
		.state("returns-and-exchange", {
			url:"/returns-and-exchange",
			templateUrl : "views/returns-and-exchange.html"
		})
		.state("shipping-policy", {
			url:"/shipping-policy",
			templateUrl : "views/shipping-policy.html"
		})
		.state("terms-and-cond", {
			url:"/terms-and-cond",
			templateUrl : "views/terms-and-cond.html"
		})
		.state("disclaimer", {
			url:"/disclaimer",
			templateUrl : "views/disclaimer.html"
		})
		.state("sizeChart", {
			url:"/sizechart",
			templateUrl : "views/sizeChart.html"
		});

		$authProvider.httpInterceptor = false;
		$authProvider.google({
			clientId: '349370840250-b7hb3fl263h9gu35e63l7idaufn0rbki.apps.googleusercontent.com',
            redirectUri: window.location.origin,
            scope: ['profile', 'email'],
			responseType:'token'
		});
		$authProvider.facebook({
            clientId: '130378890809499',
            scope: ['email'],
			responseType:'token'
		});

     // ;
	 $locationProvider.hashPrefix('');
		$urlRouterProvider.otherwise("/");
    	localStorageServiceProvider.setPrefix('modaink')
    	.setStorageType('sessionStorage');
});
app.directive('script', function() {
    return {
        restrict: 'E',
        scope: false,
        link: function(scope, elem, attr) {
            if (attr.type=='text/javascript-lazy') {
                var code = elem.text();
                var f = new Function(code);
                f();
            }
        }
    };
});
//Global helper methods
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (window.isEquivalent(this[i],obj)) {
            return true;
        }
    }
    return false;
}

window.isEquivalent = function (a, b) {
	
    // Create array of property name
    var aProps = Object.getOwnPropertyNames(a);

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if(propName.startsWith("$")) continue;
        // If values of same property are not equal, objects are not equivalent
        if (a[propName] !== b[propName]) {
           return false;
        }
    }

    // If we made it this far, objects are considered equivalent
    return true;
}
