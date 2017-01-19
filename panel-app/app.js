var app = angular.module('portal-modaink', ['ui.router','LocalStorageModule','angular.filter','ngTagsInput']);
window.app == app;
window.apiUrl = "http://dev.modaink.com/api";
//window.apiUrl = "http://localhost:8000";
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
        .state('add-product', {
            url: '/add-product',
            templateUrl: '/views/add-product.html',
            controller: 'ProductController'
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