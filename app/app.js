var app = angular.module("ModaInk", ["ui.router","LocalStorageModule","angular.filter",'satellizer','ngMeta']);
window.app == app;
window.apiUrl = "http://modaink.com/api";
window.prerenderReady = false;
app.config(function($locationProvider, $stateProvider, $urlRouterProvider, $authProvider,localStorageServiceProvider,ngMetaProvider){


	ngMetaProvider.useTitleSuffix(true);
	ngMetaProvider.setDefaultTitle('Modaink');
	ngMetaProvider.setDefaultTitleSuffix(' | Marketplace for designer dresses, designer suits, handmade jewelry, fashion dresses, fashion scarves');
	ngMetaProvider.setDefaultTag('author', 'modaink');
	ngMetaProvider.setDefaultTag('description', 'Marketplace for designer dresses, designer suits, handmade jewelry, fashion dresses, fashion scarves');
	ngMetaProvider.setDefaultTag('robots', 'follow,index');

	//ngMetaProvider.setDefaultTag('og:locale', 'en');
	ngMetaProvider.setDefaultTag('og:type', 'website');
	//ngMetaProvider.setDefaultTag('og:url', 'modaink');
	ngMetaProvider.setDefaultTag('og:title', 'Modaink | Marketplace for designer dresses, designer suits, handmade jewelry, fashion dresses, fashion scarves');
	ngMetaProvider.setDefaultTag('og:image','http://54.236.60.117:8080/images/Modaink-Index-image.jpg');
	ngMetaProvider.setDefaultTag('og:description', 'Marketplace for designer dresses, designer suits, handmade jewelry, fashion dresses, fashion scarves');
	ngMetaProvider.setDefaultTag('og:site_name', 'Modaink');
	ngMetaProvider.setDefaultTag('og:image:type', '.jpg');
	ngMetaProvider.setDefaultTag('og:image:width', '1200');
	ngMetaProvider.setDefaultTag('og:image:height', '630');


	ngMetaProvider.setDefaultTag('twitter:card', 'summary');
	ngMetaProvider.setDefaultTag('twitter:title', 'Modaink | Marketplace for designer dresses, designer suits, handmade jewelry, fashion dresses, fashion scarves');
	ngMetaProvider.setDefaultTag('twitter:description', 'Marketplace for designer dresses, designer suits, handmade jewelry, fashion dresses, fashion scarves');
	ngMetaProvider.setDefaultTag('twitter:image', 'http://54.236.60.117:8080/images/Modaink-Index-image.jpg');







//	$locationProvider.html5Mode(true);


	$locationProvider.hashPrefix('!');

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
			data: {
				meta: {
					'title': 'Customization | Modaink',
					'og:title' : 'Customization | Modaink',
					'twitter:title' : 'Customization | Modaink'
				}
			}
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
			controller : "HomeController",
			data: {
				meta: {
					'title': 'Footwear | Modaink',
					'og:title' : 'Footwear | Modaink',
					'twitter:title' : 'Footwear | Modaink'
				}
			}
		})

		.state("/", {
			url: "/search-products?exclusive&brand&isCustomizable&isDiscounted&topCategory&subCategory",
			templateUrl : "views/products.html",
			controller : "HomeController",
			data: {
				meta: {
					'title': 'Search dresses, shoes and accessories | Modaink',
					'og:title' : 'Search dresses, shoes and accessories | Modaink',
					'twitter:title' : 'Search dresses, shoes and accessories | Modaink'
				}
			}
		})
		.state("products", {
			url: "/:gender/:topCategory/:subCategory",
			templateUrl : "views/products.html",
			controller : "HomeController",
			data: {
				meta: {
					'title': 'Search dresses, shoes and accessories | Modaink',
					'og:title' : 'Search dresses, shoes and accessories | Modaink',
					'twitter:title' : 'Search dresses, shoes and accessories | Modaink'
				}
			}
		})

		.state("designers-list", {
			url: "/designers",
			templateUrl : "views/designer-list.html",
			controller : 'DesignersController',
			data: {
				meta: {
					'title': 'Fashion Designers | Modaink',
					'og:title' : 'Fashion Designers | Modaink',
					'twitter:title' : 'Fashion Designers | Modaink'
				}
			}
		})
		.state('designer-details', {
			templateUrl : "views/designer-details.html",
			url : "/designer/:designerId?brand_name&designer_name",
			controller : 'DesignerDetailsController'
		})
		.state('designer-collections', {
			templateUrl : "views/designer-collections.html",
			url : "/designer/collections",
			// controller : 'designerLabelsController'
		})
		.state('product-details', {
			templateUrl : "views/product-details.html",
			url : "/:gender/:topCategory/:subCategory/:productId/:designerId/:product_name",
			//resolve : {
			//	just_run : function(){
			//	}
			//},
			controller : 'DesignerLabelsController'
		})
		.state("cart", {
			url: "/checkout/cart",
			templateUrl : "views/cart.html",
			controller : "cartController"
		})
		.state("billing-details", {
			url:"/checkout/billing-details",
			templateUrl : "views/billing-details.html",
			controller:'PaymentsController'
		})
		.state("login", {
			url: "/login",
			templateUrl : "views/login.html",
			controller : "HomeController"
		})
		.state("women", {
			url:"/women",
			templateUrl : "views/women.html",
			controller : "HomeController",
			data: {
				meta: {
					'title': 'Women dresses, shoes and accessories | Modaink',
					'og:title' : 'Women dresses, shoes and accessories | Modaink',
					'twitter:title' : 'Women dresses, shoes and accessories | Modaink'
				}
			}
		})
		.state("men", {
			url:"/men",
			templateUrl : "views/men.html",
			controller : "HomeController",
			data: {
				meta: {
					'title': 'Men dresses, shoes and accessories | Modaink',
					'og:title' : 'Men dresses, shoes and accessories | Modaink',
					'twitter:title' : 'Men dresses, shoes and accessories | Modaink'
				}
			}
		})
		.state("accessories", {
			url:"/accessories",
			templateUrl : "views/accessories.html",
			controller : "HomeController",
			data: {
				meta: {
					'title': 'Accessories | Modaink',
					'og:title' : 'Accessories | Modaink',
					'twitter:title' : 'Accessories | Modaink'
				}
			}
		})
		.state("diamond-designers", {
			url:"/diamond-designers",
			templateUrl : "views/dimond-designers.html"
		})
		.state("my-profile", {
			url:"/myProfile/:param",
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
		})
		.state("orderConfirmation", {
			url:"/orderConfirmation",
			templateUrl : "views/order-confirmation.html"
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

window.fbAsyncInit = function() {
	FB.init({
		appId      : '130378890809499',
		cookie     : true,  // enable cookies to allow the server to access
							// the session
		xfbml      : true,  // parse social plugins on this page
		version    : 'v2.5' // use graph api version 2.5
	});

	// Now that we've initialized the JavaScript SDK, we call
	// FB.getLoginStatus().  This function gets the state of the
	// person visiting this page and can return one of three states to
	// the callback you provide.  They can be:
	//
	// 1. Logged into your app ('connected')
	// 2. Logged into Facebook, but not your app ('not_authorized')
	// 3. Not logged into Facebook and can't tell if they are logged into
	//    your app or not.
	//
	// These three cases are handled in the callback function.

	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});

};

// Load the SDK asynchronously
(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
	console.log('Welcome!  Fetching your information.... ');
	FB.api('/me?scope=email', function(response) {
		console.log(response);
		console.log('Successful login for: ' + response.name);
		document.getElementById('status').innerHTML =
			'Thanks for logging in, ' + response.name + '!';
	});
}




app.run(function($rootScope,ngMeta){

	$rootScope.prettyUrl = function(str){
		if(str){
			//str.replace('&' , '-');
			return str.replace(/\s+/g, '-').toLowerCase();
		}
		else return;
	};

	ngMeta.init();

});
