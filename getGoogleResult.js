var myGoogle = require('./myGoogle'),
    fs = require('fs'),
    request = require('request'),
    mongo = require('mongodb');

myGoogle.resultsPerPage,
myGoogle.experiment;


var searchDepth = 1,
    nextCounter = 0,
    pageCounter = 0,
    counter;



var search_Items = [],
    searchItem;

var searchItemIdx = 0;


///Read from inputData file
fs.readFile('inputData.txt', 'utf8', function(error, filecontents) {
    if (error) console.log("Error in reading the file:  " + error);
    else {
        try {

            var content = JSON.parse(filecontents);
            myGoogle.experiment = content.ExperimentName;
            search_Items = content.SearchItems;
            searchDepth = content.SearchDepth;
            
            if (searchDepth <= 5) {
                myGoogle.resultsPerPage = searchDepth;
            }
            else if (searchDepth > 5){
                myGoogle.resultsPerPage=5;
                pageCounter = Math.ceil(searchDepth/myGoogle.resultsPerPage);          
            }
            if (myGoogle.experiment === "") myGoogle.experiment = Math.random();
            if (search_Items === "") console.log("You have not chosen any search item!");
            else {
               // console.log(myGoogle.resultsPerPage);
                startSearchNewItem();
            }

        }
        catch (error) {
            console.log("The format of your input data is not correct!");
        }
    }

});

function startSearchNewItem() {
    if (searchItemIdx < search_Items.length) {
        nextCounter = 0;
        searchItem = search_Items[searchItemIdx];
        myGoogle(searchItem, myGoogleCallback);
    }
}



function myGoogleCallback(err, next, links) {
    if (err) {
        console.error("Error in mygoogle callback" + err);
    }
    counter= links.length;
    getResult(0);

    function getResult(searchItemdetailIdx) {

        if (searchItemdetailIdx < links.length) {
            var url = links[searchItemdetailIdx].url;
            request(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.52 Safari/537.17'
                }
            }, function(err, resp, body) {
                
                if (!err && resp.statusCode == 200) {
                    links[searchItemdetailIdx].html = body;
                    counter--;
                    isItComplete(searchItemdetailIdx);
                }
                else {
                    console.log("Error in request method" + err);
                }

            });

        }

        function isItComplete(searchItemdetailIdx) {
            if (counter === 0) {
                //console.log(links);
                insertToDB(links);
                searchItemIdx++;
                startSearchNewItem();
            }
            else {
                searchItemdetailIdx++;
                getResult(searchItemdetailIdx);
            }

        }
    }
    
  

    if (nextCounter < pageCounter) {
        nextCounter += 1;
        if (next) next();
    }

}



function insertToDB(links) {
    insertTofile(links);

    var db = new mongo.Db('googleResult', new mongo.Server('linus.mongohq.com', 10002, {auto_reconnect: true, safe:true}));
    db.open(function(err, db) {
         db.authenticate("mansoureh", "S2808706", function() {
             var collection = new mongo.Collection(db, 'results');
             for (var i = 0; i < links.length; i++) {
                 collection.insert(links[i]);
                 if (i === links.length) 
                 {    
                     console.log("Done!");
                     db.close();
                 }
             }
             
         });
        
    });
}


function insertTofile(links){
    
      
}
