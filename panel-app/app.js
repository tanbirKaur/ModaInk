var app = angular.module('portal-modaink', ['ui.router','LocalStorageModule','angular.filter']);
window.app == app;
window.apiUrl = "http://dev.modaink.com/api";
app.config(function($stateProvider,$locationProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/views/products.html'
        })
        .state('orders', {
            url: '/orders',
            templateUrl: '/views/orders.html'
        })
        .state('add-product', {
            url: '/add-product',
            templateUrl: '/views/add-product.html'
        })
        .state('product-requests', {
            url: '/product-requests',
            templateUrl: '/views/add-product-requests.html'
        })
        .state('designers', {
            url: '/designers',
            templateUrl: '/views/designers.html',
            controller : 'DesignerController'
        })
        .state('register-designer',{
            url: '/register-designer',
            templateUrl: '/views/register-designer-form.html'
        })
        .state('payouts',{
            url: '/payouts',
            templateUrl: '/views/payouts.html'
        })
        .state('login',{
            url: '/login',
            templateUrl: '/views/login.html',
            controller: 'LoginController'
        })
        .state('designer-profile',{
            url: '/designer-profile/:id',
            templateUrl: '/views/designer-profile.html',
            controller: "DesignerController"
        })
        $locationProvider.html5Mode(true);
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