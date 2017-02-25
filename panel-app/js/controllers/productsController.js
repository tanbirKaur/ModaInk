var app = window.app;
app.controller('ProductController', function($scope,$rootScope,$location, httpService,storageService,$stateParams) {
    $scope.availableColors = [{"text":"aliceblue"},{"text":"antiquewhite"},{"text":"aqua"},{"text":"aquamarine"},{"text":"azure"},{"text":"beige"},{"text":"bisque"},{"text":"black"},{"text":"blanchedalmond"},{"text":"blue"},{"text":"blueviolet"},{"text":"brown"},{"text":"burlywood"},{"text":"cadetblue"},{"text":"chartreuse"},{"text":"chocolate"},{"text":"coral"},{"text":"cornflowerblue"},{"text":"cornsilk"},{"text":"crimson"},{"text":"cyan"},{"text":"darkblue"},{"text":"darkcyan"},{"text":"darkgoldenrod"},{"text":"darkgray"},{"text":"darkgreen"},{"text":"darkgrey"},{"text":"darkkhaki"},{"text":"darkmagenta"},{"text":"darkolivegreen"},{"text":"darkorange"},{"text":"darkorchid"},{"text":"darkred"},{"text":"darksalmon"},{"text":"darkseagreen"},{"text":"darkslateblue"},{"text":"darkslategray"},{"text":"darkslategrey"},{"text":"darkturquoise"},{"text":"darkviolet"},{"text":"deeppink"},{"text":"deepskyblue"},{"text":"dimgray"},{"text":"dimgrey"},{"text":"dodgerblue"},{"text":"firebrick"},{"text":"floralwhite"},{"text":"forestgreen"},{"text":"fuchsia"},{"text":"gainsboro"},{"text":"ghostwhite"},{"text":"gold"},{"text":"goldenrod"},{"text":"gray"},{"text":"green"},{"text":"greenyellow"},{"text":"grey"},{"text":"honeydew"},{"text":"hotpink"},{"text":"indianred"},{"text":"indigo"},{"text":"ivory"},{"text":"khaki"},{"text":"lavender"},{"text":"lavenderblush"},{"text":"lawngreen"},{"text":"lemonchiffon"},{"text":"lightblue"},{"text":"lightcoral"},{"text":"lightcyan"},{"text":"lightgoldenrodyellow"},{"text":"lightgray"},{"text":"lightgreen"},{"text":"lightgrey"},{"text":"lightpink"},{"text":"lightsalmon"},{"text":"lightseagreen"},{"text":"lightskyblue"},{"text":"lightslategray"},{"text":"lightslategrey"},{"text":"lightsteelblue"},{"text":"lightyellow"},{"text":"lime"},{"text":"limegreen"},{"text":"linen"},{"text":"magenta"},{"text":"maroon"},{"text":"mediumaquamarine"},{"text":"mediumblue"},{"text":"mediumorchid"},{"text":"mediumpurple"},{"text":"mediumseagreen"},{"text":"mediumslateblue"},{"text":"mediumspringgreen"},{"text":"mediumturquoise"},{"text":"mediumvioletred"},{"text":"midnightblue"},{"text":"mintcream"},{"text":"mistyrose"},{"text":"moccasin"},{"text":"navajowhite"},{"text":"navy"},{"text":"oldlace"},{"text":"olive"},{"text":"olivedrab"},{"text":"orange"},{"text":"orangered"},{"text":"orchid"},{"text":"palegoldenrod"},{"text":"palegreen"},{"text":"paleturquoise"},{"text":"palevioletred"},{"text":"papayawhip"},{"text":"peachpuff"},{"text":"peru"},{"text":"pink"},{"text":"plum"},{"text":"powderblue"},{"text":"purple"},{"text":"rebeccapurple"},{"text":"red"},{"text":"rosybrown"},{"text":"royalblue"},{"text":"saddlebrown"},{"text":"salmon"},{"text":"sandybrown"},{"text":"seagreen"},{"text":"seashell"},{"text":"sienna"},{"text":"silver"},{"text":"skyblue"},{"text":"slateblue"},{"text":"slategray"},{"text":"slategrey"},{"text":"snow"},{"text":"springgreen"},{"text":"steelblue"},{"text":"tan"},{"text":"teal"},{"text":"thistle"},{"text":"tomato"},{"text":"turquoise"},{"text":"violet"},{"text":"wheat"},{"text":"white"},{"text":"whitesmoke"},{"text":"yellow"},{"text":"yellowgreen"}];
    $scope.colors = [];
    $scope.mode = $location.search().mode;
    $scope.designerId = $location.search().designerId;
    $scope.newProduct = {skus:[],colours:[],images:[]};
    if($scope.mode == 've'){
        $scope.newProduct = storageService.get('product');
    }

    counter = 0;
    $scope.skus = [];

    if ($scope.mode === 'v') {
        $scope.colors = $scope.newProduct.colours.map(function (color) {
            return {text:color};
        });
    }

    httpService.onGetCategories = function(response){
        $scope.categories = response.data;
        if ($scope.mode != 'c') {
            for(var index in $scope.categories){
                var category = $scope.categories[index];
                if (category.id == $scope.newProduct.category.id) {
                    $scope.categoryIdx = index;
                    var subCategories = category.subCategories;
                    for(var subIndex in subCategories){
                        if (subCategories[subIndex].id == $scope.newProduct.category.subcategory.id) {
                            $scope.subCategoryIdx = subIndex;
                        }
                    }
                }
            }
        }
    }

    httpService.getProductCategories(httpService.onGetCategories);

    $scope.$watch('categoryIdx', function (newValue, oldValue, scope) {
        if (newValue) {
            $scope.subCategories = $scope.categories[newValue].subCategories;            
        };
    });

    $scope.uploadImages = function (imageName , descriptionId) {
        httpService.uploadImage('products',imageName,function(res){
            var imageUploaded = res.data;
            imageUploaded.forEach(function(image){
                alert('image uploaded successfully');
                description = $(descriptionId).val()
                $scope.newProduct.images.push({url:image.fileUrl, description: description});
            }, function (res) {
                alert('Something went wrong. Please try with some other image')
            })
        })
    }

    $scope.updateProduct = function(){
        Object.keys($scope.skus).forEach(function(skuName){
            $scope.newProduct.skus.push({sizeVariantValue:$scope.skus[skuName].sizeVariantValue,quantity: $scope.skus[skuName].quantity});
        });
        $scope.newProduct.skus = $scope.newProduct.skus.map(function (sku) {
            var newSku = {
                id : String(sku.id),
                quantity:sku.quantity
            };
            return newSku;
        });
        var productUpdates = {
            "description": $scope.newProduct.description,
            "price": $scope.newProduct.price,
            "discountPrice": $scope.newProduct.discountPrice,
            "images": $scope.newProduct.images,
            "skus": $scope.newProduct.skus,
            "shippingDays":$scope.newProduct.shippingDays,
            "returnDays":$scope.newProduct.returnDays
        };
        httpService.updateProduct($scope.newProduct.id,productUpdates,function (response) {
            $('#updateProductSuccess').modal();
        },
        function (response) {
            $scope.error = (response.data.message).match(/[^[\]]+(?=])/g);
            $('#updateProductFailed').modal()
        })
    };

    $scope.addNewProduct = function(){
        $scope.newProduct.colours.length = 0;
        $scope.colors.forEach(function(color){
            $scope.newProduct.colours.push(color.text);
        })
        $scope.newProduct.skus.length = 0;
        Object.keys($scope.skus).forEach(function(skuName){
            $scope.newProduct.skus.push({sizeVariantValue:$scope.skus[skuName].sizeVariantValue,quantity: $scope.skus[skuName].quantity});
        });
        if(!$scope.categoryIdx || !$scope.subCategoryIdx){
            return alert(!$scope.categoryIdx?"Please select category":"Please select sub category");
        }
        $scope.newProduct.category = $scope.subCategories[$scope.subCategoryIdx];
        $scope.newProduct.discountPrice = 0;
        $scope.newProduct.isExclusive = true;
        if($scope.designerId){
            $scope.newProduct.designer = {id:$scope.designerId};
        } else
            $scope.newProduct.designer = {id:$rootScope.userDetails.id};

        httpService.createProduct($scope.newProduct,function(res){
            $('#addProductSuccess').modal();
        }, function (res) {
            $scope.error = (res.data.message).match(/[^[\]]+(?=])/g);
            $('#addProductFailure').modal();
        });
    }

    $scope.addSku = function () {
        $scope.skus.push({sizeVariantValue:$scope.skuName,quantity:$scope.skuQuantity})
        $scope.skuName = "";
        $scope.skuQuantity= "";
    };
});
