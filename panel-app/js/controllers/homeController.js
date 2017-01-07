var app = window.app;
app.controller('HomeController', function($scope,$location, httpService, storageService) {
    if (!storageService.get('accessToken')) {
        $location.path("/login");
    };
});
