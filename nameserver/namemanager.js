var express = require('express');
var cors = require('cors');
var multer  = require('multer');
var pem = require('pem');
var https = require('https');
var fs = require('fs');

var upload = multer();
var sio = require('../common/sio.js');

var app = express();

app.use(cors());

var port = 3005; //0 makes the program just pick something free

var bindings;

app.post('/', upload.fields([]), function (req, res) {//TODO need some authentication here //TODO get rid of the damn file uploads
    console.log('POST received: ' + JSON.stringify(req.body));
    
    if (req.body != null){
        if (req.body.address != null && req.body.association != null){
            bindings[req.body.address] = req.body.association;
            sio.saveObjectAsync('bindings.json', bindings);
            res.send('Name successfully registered.');
        } else {
            res.status(400).send('Malformed POST (wrong fields)');
        }
    } else {
        res.status(400).send('Malformed POST (missing body)');
    }
});

app.get('/', upload.fields([]), function (req, res) {
    console.log('GET received: ' + JSON.stringify(req.query));
    //console.log(req);
    //res.set('Access-Control-Allow-Origin', '*');
    
    if (req.query != null && req.query.address != null){
        if (bindings[req.query.address] != null){
            res.send(bindings[req.query.address]);
        } else {
            res.status(404).send('Unknown name.');
        }
    } else {
        res.status(404).send('Malformed request.');
    }
});

bindings = sio.loadObjectIfExists('bindings.json');
if (!bindings) {
    bindings = {};
}

var listener = app.listen(port, function(){
    console.log('Now listening on port ' + listener.address().port);
});

