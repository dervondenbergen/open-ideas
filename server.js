var http = require('http');
var jade = require('jade');
var url  = require('url');
var marked = require('marked');
var Trello = require('node-trello');

var config = require('./config.js');

var t = new Trello(config.trello.key, config.trello.token);

var idUrl =  new RegExp('^/idea/(?=.)');
var listId = config.trello.listId;

http.createServer(function(req, res) {

  pathname = url.parse(req.url, true).pathname;

  if ( idUrl.test(pathname) ) {

    ideaId = pathname.replace('/idea/', '');

    t.get('/1/cards/' + ideaId, { fields: 'name,desc,id'}, function (err, data) {

      if (err) {
        throw err;
      };

      if ( data == "The requested resource was not found.\n") {
        res.writeHead(404, {'content-type': 'text/html'});
        var html = jade.renderFile('./jade/404.jade');
        res.end(html);
      }

      var options = { "name": data.name, "body": marked(data.desc), "pretty": true };

      var html = jade.renderFile('./jade/idea.jade', options);

      res.writeHead(200, {'content-type': 'text/html'});

      res.end(html);

    });

  } else if ( pathname == ( "/" || "" ) ) {

    t.get('/1/lists/' + listId, { fields: 'name', cards: 'open', card_fields: 'name'}, function (err, data) {

      if (err) {
        throw err;
      };

      var options = { ideas: data.cards, pretty: true };

      var html = jade.renderFile('./jade/index.jade', options);

      res.writeHead(200, {'content-type': 'text/html'});

      res.end(html);

    });

  } else {

    res.writeHead(404, {'content-type': 'text/html'});

    var html = jade.renderFile('./jade/404.jade');

    res.end(html);

  }

}).listen(5678);



