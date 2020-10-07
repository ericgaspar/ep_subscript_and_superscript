var supertest = require('ep_etherpad-lite/node_modules/supertest'),
           fs = require('fs'),
         path = require('path'),
      request = require('ep_etherpad-lite/node_modules/request'),
        utils = require('../utils.js');
       apiKey = utils.apiKey,
    codeToBe0 = utils.codeToBe0,
          api = utils.api,
   apiVersion = utils.apiVersion,
 randomString = require('ep_etherpad-lite/static/js/pad_utils').randomString;

describe('export Subscript to HTML', function(){
  var padID;
  var html;

  //create a new pad before each test run
  beforeEach(function(done){
    padID = randomString(5);

    createPad(padID, function() {
      setHTML(padID, html(), done);
    });
  });

  context('when pad text has one Subscript', function() {
    before(function() {
      html = function() {
        return buildHTML("<sub>Hello world</sub>");
      }
    });

    it('returns ok', function(done) {
      api.get(getHTMLEndPointFor(padID))
      .expect('Content-Type', /json/)
      .expect(200, done);
    });

    it('returns HTML with Subscript HTML tags', function(done) {
      api.get(getHTMLEndPointFor(padID))
      .expect(function(res){
        let html = res.body.data.html;
        if(html.indexOf("<sub>Hello world</sub>") === -1) throw new Error("No sub tag detected");
      })
      .end(done);
    });

  });

  context('when pad text has multiple Subscripts on multiple lines', function() {
    before(function() {
      html = function() {
        return buildHTML("<sub>Hello world</sub><br/><sub>Foo</sub>");
      }
    });

    it('returns ok', function(done) {
      api.get(getHTMLEndPointFor(padID))
      .expect('Content-Type', /json/)
      .expect(200, done);
    });

    it('returns HTML with Multiple Subscripts HTML tags', function(done) {
      api.get(getHTMLEndPointFor(padID))
      .expect(function(res){
        let html = res.body.data.html;
        if(html.indexOf("<sub>Hello world</sub>") === -1) throw new Error("No sub tag detected");
        if(html.indexOf("<sub>Foo</sub>") === -1) throw new Error("No sub tag detected");
      })
      .end(done);
    });

  });
})

describe('export Superscript to HTML', function(){
  var padID;
  var html;

  //create a new pad before each test run
  beforeEach(function(done){
    padID = randomString(5);

    createPad(padID, function() {
      setHTML(padID, html(), done);
    });
  });

  context('when pad text has one Superscript', function() {
    before(function() {
      html = function() {
        return buildHTML("<sup>Hello world</sup>");
      }
    });

    it('returns ok', function(done) {
      api.get(getHTMLEndPointFor(padID))
      .expect('Content-Type', /json/)
      .expect(200, done);
    });

    it('returns HTML with Suberscript HTML tags', function(done) {
      api.get(getHTMLEndPointFor(padID))
      .expect(function(res){
        let html = res.body.data.html;
        if(html.indexOf("<sup>Hello world</sup>") === -1) throw new Error("No sup tag detected");
      })
      .end(done);
    });

  });

  context('when pad text has multiple Superscripts on multiple lines', function() {
    before(function() {
      html = function() {
        return buildHTML("<sup>Hello world</sup><br/><sup>Foo</sup>");
      }
    });

    it('returns ok', function(done) {
      api.get(getHTMLEndPointFor(padID))
      .expect('Content-Type', /json/)
      .expect(200, done);
    });

    it('returns HTML with Multiple Superscripts HTML tags', function(done) {
      api.get(getHTMLEndPointFor(padID))
      .expect(function(res){
        let html = res.body.data.html;
        if(html.indexOf("<sup>Hello world</sup>") === -1) throw new Error("No sup tag detected");
        if(html.indexOf("<sup>Foo</sup>") === -1) throw new Error("No sup tag detected");
      })
      .end(done);
    });

  });
})




// Creates a pad and returns the pad id. Calls the callback when finished.
var createPad = function(padID, callback) {
  api.get('/api/'+apiVersion+'/createPad?apikey='+apiKey+"&padID="+padID)
  .end(function(err, res){
    if(err || (res.body.code !== 0)) callback(new Error("Unable to create new Pad"));

    callback(padID);
  })
}

var setHTML = function(padID, html, callback) {
  api.get('/api/'+apiVersion+'/setHTML?apikey='+apiKey+"&padID="+padID+"&html="+html)
  .end(function(err, res){
    if(err || (res.body.code !== 0)) callback(new Error("Unable to set pad HTML"));

    callback(null, padID);
  })
}

var getHTMLEndPointFor = function(padID, callback) {
  return '/api/'+apiVersion+'/getHTML?apikey='+apiKey+"&padID="+padID;
}


var buildHTML = function(body) {
  return "<html><body>" + body + "</body></html>"
}

