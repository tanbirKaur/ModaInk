var express  = require('express');
var app      = express();


app.use(express.static(__dirname + ''));




app.use(require('prerender-node'));

app.use(require('prerender-node').set('prerenderToken', 'LWRaw9u7sFk7m13Lpak8'));
app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});

app.listen(8080);
console.log("App listening on port 8080");

