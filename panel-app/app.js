var app = angular.module('portal-modaink', ['ui.router','LocalStorageModule','angular.filter','ngTagsInput']);
window.app == app;
window.apiUrl = "http://modaink.com/api";
app.config(function($stateProvider,$locationProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/views/products.html',
            controller:'HomeController'
        })
        .state('orders', {
            url: '/orders',
            templateUrl: '/views/orders.html',
            controller:'OrderController'
        })
        .state('addProduct', {
            url: '/addProduct',
            templateUrl: '/views/add-product.html',
            controller: 'ProductController'
        })
        .state('update-product', {
            url: '/update-product',
            templateUrl: '/views/add-product.html',
            controller: 'ProductController',
        })
        .state('product-requests', {
            url: '/product-requests',
            templateUrl: '/views/add-product-requests.html',
            controller: 'ProductController'

        })
        .state('designers', {
            url: '/designers',
            templateUrl: '/views/designers.html',
            controller : 'DesignerController'
        })
        .state('register-designer',{
            url: '/register-designer',
            templateUrl: '/views/register-designer-form.html',
            controller : 'DesignerController'

        })
        .state('designer-requests', {
            url: '/designer-requests',
            templateUrl: '/views/new-designer-request.html',
            controller : 'DesignerController'

        })
        .state('designer-profile',{
            url: '/designer-profile/:id',
            templateUrl: '/views/designer-profile.html',
            controller: "DesignerController"
        })
        .state('payouts',{
            url: '/payouts',
            templateUrl: '/views/payouts.html',
            controller: 'PayoutsController'
        })
        .state('login',{
            url: '/login',
            templateUrl: '/views/login.html',
            controller: 'LoginController'
        })
        .state('reset-pwd',{
            url: '/resetPassword?token&email&bearerType',
            templateUrl: '/views/reset-pwd.html',
            controller: 'LoginController'
        })
        .state('forgot-pwd',{
            url: '/forgot-pwd',
            templateUrl: '/views/forgot-pwd.html',
            controller: 'LoginController'
        })
        .state('linkSent',{
            url: '/reset-pwd/sentLink',
            templateUrl: '/views/link-sent.html',
            controller: 'LoginController'
        })
        .state('waiting',{
            url: '/waiting-for-approval',
            templateUrl: '/views/waiting-for-approval.html',
            controller: 'LoginController'
        })
        .state("verifyEmail", {
            url: "/verifyEmail",
            templateUrl : "views/verifyEmail.html",
            controller :"VerifyEmailController"
        })
        .state("sizeChart", {
            url: "/sizeChart",
            templateUrl : "views/sizeChart.html",
            controller :"VerifyEmailController"
        })




    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $urlRouterProvider.otherwise('/home');

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
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);