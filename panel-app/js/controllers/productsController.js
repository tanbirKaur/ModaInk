var app = window.app;
app.controller('ProductController', function($scope,$rootScope,$location, httpService) {
    $scope.colors = [{"text":"aliceblue"},{"text":"antiquewhite"},{"text":"aqua"},{"text":"aquamarine"},{"text":"azure"},{"text":"beige"},{"text":"bisque"},{"text":"black"},{"text":"blanchedalmond"},{"text":"blue"},{"text":"blueviolet"},{"text":"brown"},{"text":"burlywood"},{"text":"cadetblue"},{"text":"chartreuse"},{"text":"chocolate"},{"text":"coral"},{"text":"cornflowerblue"},{"text":"cornsilk"},{"text":"crimson"},{"text":"cyan"},{"text":"darkblue"},{"text":"darkcyan"},{"text":"darkgoldenrod"},{"text":"darkgray"},{"text":"darkgreen"},{"text":"darkgrey"},{"text":"darkkhaki"},{"text":"darkmagenta"},{"text":"darkolivegreen"},{"text":"darkorange"},{"text":"darkorchid"},{"text":"darkred"},{"text":"darksalmon"},{"text":"darkseagreen"},{"text":"darkslateblue"},{"text":"darkslategray"},{"text":"darkslategrey"},{"text":"darkturquoise"},{"text":"darkviolet"},{"text":"deeppink"},{"text":"deepskyblue"},{"text":"dimgray"},{"text":"dimgrey"},{"text":"dodgerblue"},{"text":"firebrick"},{"text":"floralwhite"},{"text":"forestgreen"},{"text":"fuchsia"},{"text":"gainsboro"},{"text":"ghostwhite"},{"text":"gold"},{"text":"goldenrod"},{"text":"gray"},{"text":"green"},{"text":"greenyellow"},{"text":"grey"},{"text":"honeydew"},{"text":"hotpink"},{"text":"indianred"},{"text":"indigo"},{"text":"ivory"},{"text":"khaki"},{"text":"lavender"},{"text":"lavenderblush"},{"text":"lawngreen"},{"text":"lemonchiffon"},{"text":"lightblue"},{"text":"lightcoral"},{"text":"lightcyan"},{"text":"lightgoldenrodyellow"},{"text":"lightgray"},{"text":"lightgreen"},{"text":"lightgrey"},{"text":"lightpink"},{"text":"lightsalmon"},{"text":"lightseagreen"},{"text":"lightskyblue"},{"text":"lightslategray"},{"text":"lightslategrey"},{"text":"lightsteelblue"},{"text":"lightyellow"},{"text":"lime"},{"text":"limegreen"},{"text":"linen"},{"text":"magenta"},{"text":"maroon"},{"text":"mediumaquamarine"},{"text":"mediumblue"},{"text":"mediumorchid"},{"text":"mediumpurple"},{"text":"mediumseagreen"},{"text":"mediumslateblue"},{"text":"mediumspringgreen"},{"text":"mediumturquoise"},{"text":"mediumvioletred"},{"text":"midnightblue"},{"text":"mintcream"},{"text":"mistyrose"},{"text":"moccasin"},{"text":"navajowhite"},{"text":"navy"},{"text":"oldlace"},{"text":"olive"},{"text":"olivedrab"},{"text":"orange"},{"text":"orangered"},{"text":"orchid"},{"text":"palegoldenrod"},{"text":"palegreen"},{"text":"paleturquoise"},{"text":"palevioletred"},{"text":"papayawhip"},{"text":"peachpuff"},{"text":"peru"},{"text":"pink"},{"text":"plum"},{"text":"powderblue"},{"text":"purple"},{"text":"rebeccapurple"},{"text":"red"},{"text":"rosybrown"},{"text":"royalblue"},{"text":"saddlebrown"},{"text":"salmon"},{"text":"sandybrown"},{"text":"seagreen"},{"text":"seashell"},{"text":"sienna"},{"text":"silver"},{"text":"skyblue"},{"text":"slateblue"},{"text":"slategray"},{"text":"slategrey"},{"text":"snow"},{"text":"springgreen"},{"text":"steelblue"},{"text":"tan"},{"text":"teal"},{"text":"thistle"},{"text":"tomato"},{"text":"turquoise"},{"text":"violet"},{"text":"wheat"},{"text":"white"},{"text":"whitesmoke"},{"text":"yellow"},{"text":"yellowgreen"}]
    $scope.newProduct = {colors:[],skus:[]};
    $scope.skus = {XS:false,S:false,M:false,L:false,XL:false};
    var mode = $location.search().mode;

    //test data
    $scope.newProduct = {
        "name": "new Product",
        "description": "Product description",
        "isExclusive": true,
        "colours": ["red","white"],
        "price": 2550,
        "discountPrice": 0,
        "designer": {
            "id": $rootScope.userDetails.id
        },
        "skus":[],
        "images": [{url:"https://pickaface.net/gallery/avatar/Opi51c74dfa1fef6.png"}]
    }

    httpService.onGetCategories = function(response){
        $scope.categories = response.data;
    }
    if (mode == 'c') {
        httpService.getProductCategories(httpService.onGetCategories);
    };

    $scope.$watch('categoryIdx', function (newValue, oldValue, scope) {
        if (newValue) {
            $scope.subCategories = $scope.categories[newValue].subCategories;            
        };
    });

    $scope.addNewProduct = function(){
        // $scope.colors.forEach(function(color){
        //     $scope.newProduct.colors.push(color.text);
        // })
        Object.keys($scope.skus).forEach(function(skuName){
            if ($scope.skus[skuName]) {
                $scope.newProduct.skus.push({sizeVariantValue:skuName,quantity:1});
            };
        });
        $scope.newProduct.category = $scope.subCategories[$scope.subCategoryIdx];
        console.log(JSON.stringify($scope.newProduct));
        httpService.createProduct($scope.newProduct,function(res){
            console.log("Product created:"+JSON.stringify(res));
        });
    }
});
