angular.module("ModaInk").directive('ngElevateZoom', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            attrs.$observe('zoomImage',function(newVal){
                linkElevateZoom(newVal);
            });
            $rootScope.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams){
                    $.removeData(element, 'elevateZoom');
                    $.removeData($('#gallery-preview'), 'elevateZoom');
                    $('.zoomContainer').remove();
                }
            );

            function linkElevateZoom(newImage){
                if (!newImage) return;
                element.attr('data-zoom-image',newImage);
                $(element).data('zoom-image',newImage).elevateZoom({
                    responsive:true,
                    scrollZoom:true,
                    cursor: 'pointer',
                    imageCrossfade: true,
                    easing:true,
                    zoomWindowWidth:300,
                    zoomWindowHeight:400
                });
                $(element).elevateZoom({
                    responsive:true,
                    scrollZoom:true,
                    cursor: 'pointer',
                    imageCrossfade: true,
                    easing:true,
                    zoomWindowWidth:300,
                    zoomWindowHeight:400
                });
            }
        }
    };
});
