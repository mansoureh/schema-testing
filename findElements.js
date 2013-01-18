 var request = require('request');
 var cheerio = require('cheerio');
 var querystring = require('querystring');


 var linkSel = 'h3.r',
     descSel = 'div.s',
     itemSel = 'li.g',
     nextSel = 'td.b a span';

 var URL = 'https://www.google.com.au/search?num=100&start=0&hl=en&tbo=d&site=&source=hp&q=sydney'
 //var URL = 'http://www.google.com/search?hl=en&q=paris&start=0&sa=N&num=3';

 request(URL, function(err, resp, body) {
     if ((err === null) && resp.statusCode === 200) {

         var $ = cheerio.load(body);

         $(itemSel).each(function(i, elem) {
             var linkElem;
             var qsObj
             var tagName= $(elem).children().first()['0']['name'];
             console.log($(elem).children().first()['0']['name']); 
             if(tagName === "h3")
             {
                 linkElem = $(elem).children(linkSel).first().children('a');
                 qsObj = querystring.parse($(linkElem).attr('href'));
                     if (qsObj['/url?q']) qsObj = qsObj['/url?q'];
                     console.log($(linkElem).attr('href'));  
             }
             else if(tagName === 'table')
             {
                 linkElem= $(elem).children().children().children().children(linkSel).children('a');
                 qsObj = querystring.parse($(linkElem).attr('href'));
                     if (qsObj['/url?q']) qsObj = qsObj['/url?q'];
                     console.log(linkElem);  
             }
                        
         });
     }
 });
         

