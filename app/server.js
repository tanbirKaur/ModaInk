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

app.use(require('prerender-node').set('prerenderToken', 'LWRaw9u7sFk7m13Lpak8').set('protocol', 'http').set('prerenderServerRequestOptions', {ignoreTimeout: true, retries: 3}).set('afterRender',function(err,req,prerender_res){
    console.log('req' +  req);
    console.log('pre_res'  + prerender_res);
    console.log('err' + err);
}));
app.use(express.static('./'));

// This will ensure that all routing is handed over to AngularJS 
app.get('*', function(req, res){ 
  res.sendfile('./index.html'); 
});

app.listen(8080); 
console.log("Go Prerender Go!");