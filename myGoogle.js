var request = require('request'),
    cheerio = require('cheerio'),
    querystring = require('querystring'),
    util = require('util');


var linkSel = 'h3.r',
    descSel = 'div.s',
    itemSel = 'li.g',
    nextSel = 'td.b a span';

var URL = 'http://www.google.com/search?hl=en&q=%s&start=%s&sa=N&num=%s';

function myGoogle(query, callback) {
    igoogle(query, 0, callback);
}

myGoogle.resultsPerPage;
myGoogle.experiment;

var igoogle = function(query, start, callback) {
    if (myGoogle.resultsPerPage > 100) myGoogle.resultsPerPage = 100; //Google won't allow greater than 100 anyway

    var newUrl = util.format(URL, querystring.escape(query), start, myGoogle.resultsPerPage);
    request(newUrl, function(err, resp, body) {
        if ((err === null) && resp.statusCode === 200) {
            var $ = cheerio.load(body),
                links = [];


            $(itemSel).each(function(i, elem) {
                
                
                var linkElem = $(elem).children(linkSel).children('a'),
                    qsObj = querystring.parse($(linkElem).attr('href')),
                    item = {
                        experiment: null,
                        searchItem: query,
                        url: null,
                        html: null
                    };
                item.experiment = myGoogle.experiment;
                if (qsObj['/url?q']) qsObj = qsObj['/url?q'];
                if ($(linkElem).attr('href')) {
                    item.url = qsObj;
                    links.push(item);
                }
  
            });

            var nextFunc = null;
            if ($(nextSel).last().text() === 'Next') {
                nextFunc = function() {
                    igoogle(query, start + myGoogle.resultsPerPage, callback);
                }
            }

            callback(null, nextFunc, links);
        }
        else {
            callback(new Error('Error on response.'), null, null);
        }
    });
}

module.exports = myGoogle;
