var app = angular.module("ModaInk", ["ui.router","LocalStorageModule","angular.filter"]);
window.app == app;
window.apiUrl = "http://dev.modaink.com/api";
 app.config(function($locationProvider, $stateProvider, $urlRouterProvider,localStorageServiceProvider){
	$stateProvider
		.state("index", {
			url: "/",
			templateUrl : "views/home.html",
			controller : "HomeController"
		})
		.state("madeToOrder",{ 	
			url : '/madeToOrder',
			templateUrl:"views/made-to-order.html",
			// controller : "loginController"
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
			// controller : "signupUserController"
		})
		.state("heals", {
			url: "/footwear/heals",
			templateUrl : "views/for-her-heals.html",
			// controller : "searchController"
		})
		.state("/", {
			url: "/products",
			templateUrl : "views/products.html",
			controller : "HomeController"
		})
		.state("products", {
			url: "/products/:topCategory/:subCategory",
			templateUrl : "views/products.html",
			controller : "HomeController"
		})
		.state("sale", {
			url: "/sale",
			templateUrl : "views/discount.html",
			// controller : "designerProfileController"
		}).state("designers-list", {
			url: "/designers",
			templateUrl : "views/designer-list.html",
			controller : 'DesignersController'
		})
		.state('designer-details', {
			templateUrl : "views/designer-details.html",
			url : "/designer-details/:designerId", 
			controller : 'DesignersController'
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
			templateUrl : "views/billing-details.html"
		})
		.state("payment-method", {
			url:"/checkout/payment",
			templateUrl : "views/payment-method.html"
		})
		.state("login", {
			url: "/login",
			templateUrl : "views/login.html"
		//	controller : "homeController"
		})
        .state("verifyEmail", {
            url: "/verifyEmail",
            templateUrl : "views/verifyEmail.html",
			controller :"LoginController"
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
			templateUrl : "views/user-profile.html"
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
		// ;
		$urlRouterProvider.otherwise("/");
    	$locationProvider.html5Mode(true);
    	localStorageServiceProvider.setPrefix('modaink')
    	.setStorageType('sessionStorage');
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
	
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different, objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        // If values of same property are not equal, objects are not equivalent
        if (a[propName] !== b[propName]) {
           return false;
        }
    }

    // If we made it this far, objects are considered equivalent
    return true;
}
