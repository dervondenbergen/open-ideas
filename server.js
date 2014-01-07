var http = require('http');
var jade = require('jade');
var url  = require('url');
var Trello = require('node-trello');

var config = require('./config.js');

var t = new Trello(config.trello.key, config.trello.token);

var idUrl =  new RegExp('^/id/(?=.)');
var listId = config.trello.listId;

http.createServer(function(req, res) {

  pathname = url.parse(req.url, true).pathname;

  if ( idUrl.test(pathname) ) {

    ideaId = pathname.replace("/idea/", "");

    var html;
    var error;

    t.get('/1/cards/' + ideaId,{ fields: 'name,desc,id'} , function (err, data) {

      if (err) {
        throw err;
        error = true;
        return;
      };

      if (data.id != listId) {
        error = true;
        return;
      };


      var options = { "name": data.name, "body": data.desc, "pretty": true };

      html = jade.renderFile('./jade/idea.jade', options);

      res.writeHead(200, {'content-type': 'text/html'});

    });

    if ( error ) {

      html = jade.renderFile('./jade/404.jade');
      res.writeHead(400, {'content-type': 'text/html'});

    };

    res.end(html);

  } else if ( pathname == ( "/" || "" ) ) {

    var html;
    var error;

    t.get('/1/lists/' + listId, function (err, data) {

      if (err) {
        throw err;
        error = true;
      };

      var options = { "ideas": data.cards, "pretty": true };

      html = jade.renderFile('./jade/index.jade', options);

      res.writeHead(200, {'content-type': 'text/html'});

    });

    if ( error ) {

      html = jade.renderFile('./jade/404.jade');
      res.writeHead(400, {'content-type': 'text/html'});

    };

    res.end(html);

  } else {

    res.writeHead(404, {'content-type': 'text/html'});

    var html = jade.renderFile('./jade/404.jade');

    res.end(html);

  }

}).listen(5678);



