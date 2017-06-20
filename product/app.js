var express = require('express');
var app = express();
var fs = require('fs')
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');



var router = express.Router();
router.post('/sendRecord', function(req, res) {
  console.log(req.body);
  fs.writeFile(path.join(__dirname, 'account.js'), JSON.stringify(req.body), function (err) {
    if (err) throw err;
    console.log("Export Account Success!");
    res.end()
  });
  //res.end()
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data
app.use(router);
app.use(express.static(__dirname + '/'));
//app.use(router);
//app.use(express.static(__dirname + '/'));

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});