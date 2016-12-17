var app = angular.module("ModaInk", ["ui.router","LocalStorageModule"]);
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
		.state("exclusive", {
			url: "/exclusive",
			templateUrl : "views/exclusive.html",
		//	controller : "homeController"
		})
		.state("exclusive-men", {
			url: "/exclusive/men",
			templateUrl : "views/exclusive-men.html",
			// controller : "designerProfileController"
		})
		.state("exclusive-women", {
			url: "/exclusive/women",
			templateUrl : "views/exclusive-women.html",
			// controller : "designerProfileController"
		})
		.state("sale", {
			url: "/sale",
			templateUrl : "views/discount.html",
			// controller : "designerProfileController"
		}).state("designers-list", {
			url: "/designers",
			templateUrl : "views/designer-list.html",
			// controller : "designerProfileController"
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
			url : "/product-details", 
			// controller : 'designerLabelsController'
		})
		.state("cart", {
			url: "/checkout/cart",
			templateUrl : "views/cart.html",
			// controller : "userProfileController"
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

		
		
		
		// ;
		$urlRouterProvider.otherwise("/");
    	$locationProvider.html5Mode(true);
    	localStorageServiceProvider.setPrefix('modaink')
    	.setStorageType('sessionStorage');
});
