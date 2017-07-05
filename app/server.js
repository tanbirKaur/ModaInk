//var express  = require('express');
//var app      = express();


//app.use(express.static(__dirname + ''));

//app.use(require('prerender-node').set('prerenderToken', 'LWRaw9u7sFk7m13Lpak8'));

//app.use(require('prerender-node').set('beforeRender', function(req, done) {
//	console.log('before render');
//}));
//
//app.use(require('prerender-node').set('afterRender', function(err, req, prerender_res) {
//	console.log('after render');
//}));

//app.get('/*', function(req, res) {
//    res.sendFile(__dirname + '/index.html')
//});
//app.get('/',function(req,res){
//	res.sendFile(__dirname + '/index.html');
//});

//app.listen(8080);
//console.log("App listening on port 8080");


var express = require('express');

var app = module.exports = express();
var Client = require('node-rest-client').Client;
var client = new Client();
var path = require("path");
var fs = require("fs");
var Q = require('q');

app.use(require('prerender-node').set('prerenderToken', 'LWRaw9u7sFk7m13Lpak8').set('protocol', 'http').set('prerenderServerRequestOptions', {ignoreTimeout: true, retries: 3}).set('afterRender',function(err,req,prerender_res){
    console.log('req' +  req);
    console.log('pre_res'  + prerender_res);
    console.log('err' + err);
}));
app.use(express.static('./'));

var baseUrl = "http://34.194.97.84";

// This will ensure that all routing is handed over to AngularJS
client.registerMethod("getProducts", "http://modaink.com/api/products/searchService/search/filteredSearch", "POST");

var findProductById = function (data,id) {
    return data.find(function(product){
        return product.id == id;
    });
};
function readFile(fileName){
    var deferred = Q.defer();
    fs.readFile(path.join(process.cwd(), "/", fileName), function (error, source) {
        if (error) {
            deferred.reject(error);
        }else{
            deferred.resolve({source: source});
        }
    });
    return deferred.promise;
}

function format(template,obj) {
    for(var key in obj){
        template = template.replace(key,obj[key]);
    }
    return template;
}
app.get('/:gender/:topCategory/:subCategory/:productId/:designerId/:product_name', function(req, res){
    var args = {
        data:"{}",
        parameters:{offset:0,limit:10000}
    };
    var deferred = Q.defer();
    var metaTags = {};
    function getProducts() {
        client.methods.getProducts(args,function (data, response) {
            var productId = req.params.productId;
            //custom methods
            var product = findProductById(data.products,productId);
            deferred.resolve(product);
        });
        return deferred.promise;
    }
    getProducts().then(function (product) {
        var productUrl = [baseUrl,
            req.params.gender,
            req.params.topCategory,
            req.params.subCategory,
            req.params.productId,
            req.params.designerId,
            req.params.product_name
        ].join("/");
        metaTags["{{ngMeta['og:type']}}"] = "website";
        var productTitle = product.productName + ' | ' +  product.brandName + ' | ModaInk';
        metaTags["{{ngMeta['og:title']}}"] = productTitle;
        metaTags["{{ngMeta['og:image']}}"] = product.previewImage;
        metaTags["{{ngMeta['og:description']}}"] = product.productDescription;
        metaTags["{{ngMeta['og:url']}}"] = productUrl;
        metaTags["{{ngMeta['twitter:card']}}"] = "summary";
        metaTags["{{ngMeta['twitter:title']}}"] = productTitle;
        metaTags["{{ngMeta['twitter:image']}}"] = product.previewImage;
        metaTags["{{ngMeta['twitter:description']}}"] = product.productDescription;
        metaTags["{{ngMeta['og:site_name']}}"] = "ModaInk";
        metaTags["ngMeta.title"] = productTitle;
        metaTags["{{ngMeta.robots}}"] = "follow,index";
        metaTags["{{ngMeta.description}}"] = product.productDescription;
        metaTags["{{ngMeta['author']}}"] = "ModaInk";
        return readFile('index.html');
    }).then(function (file,res) {
        var template = format(file.source.toString(),metaTags);
        return Q.when(template);
    }).then(function (result) {
        res.send(result);
    },function (err) {
        res.redirect("/");
    });
});

app.get('*', function(req, res){ 
  res.sendfile('./index.html'); 
});

app.listen(8080); 
console.log("Go Prerender Go!");