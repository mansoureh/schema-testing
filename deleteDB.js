var Db = require('mongodb').Db,
    Server = require('mongodb').Server,
    Collection = require('mongodb').Collection;

var _db = new Db('googleResult', new Server('linus.mongohq.com', 10002, {
    auto_reconnect: true
}));
_db.open(function(err, db) {
    db.authenticate("mansoureh", "S2808706", function() {
        
        var collection = new Collection(db, 'results');

        collection.remove(function(err, result) {
            if (err) {
                console.log(err.message);
            }
            db.close();

        });
//       collection.insert({hello: 'world'}, {safe:true},
//                    function(err, objects) {
//       if (err) {console.log(err.message);}
//       if (err && err.message.indexOf('E11000 ') !== -1) {
//          console.log("oops");
//       }
//    });
   });
});



