
 var myGoogle = require('./myGoogle'),
    fs = require('fs'),
    request = require('request'),
    mongo = require('mongodb');

myGoogle.resultsPerPage=3,
myGoogle.experiment="1";


var nextCounter = 0,
    counter;



var search_Items = "josh",
    searchItem;

var searchItemIdx = 0;



 myGoogle(search_Items, mygooglecallback);
 
 
 
 function mygooglecallback(err, next, links) {


    counter = links.length;

    function uploader(i) {
  if( i < links.length ) {
      var url = links[i].url;
    request(url, function(err, resp, body) {
      if( err ) {
        console.log('error: '+err)
      }
      else {
          links[i].html = body;
         counter--;
         if (counter === 0) console.log(links);
        uploader(i+1);
      }
    })
  }
}
uploader(0)


//        if (myGoogle.resultsPerPage>100) {
//            nextCounter += 1;
//            if (next) next();
//        }

}




