angular.module("ModaInk").directive('ngElevateZoom', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            attrs.$observe('zoomImage',function(newVal){
                linkElevateZoom(newVal);
            });

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
angular.module("ModaInk").directive('zoomContainer', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.$on('$routeChangeSuccess', function() {
                $.removeData($('img'), 'elevateZoom');
                $('.zoomContainer').remove();
            });
        }
    };
});
