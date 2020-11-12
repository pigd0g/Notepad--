var mongoose = require('mongoose');

let collections = {connected_db: false};

mongoose.connect(process.env.DBURL, { useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
  
	if (err) return console.log(err)
    //console.log(client)
    const db = client.connection;
	  //console.log(database);
	 collections.notes = db.collection('notes');
    collections.connected_db = true
})

module.exports = {mongo_session: mongoose.connection, collections: collections};
