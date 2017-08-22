/**
 * Created by M.C on 2017/8/17.
 */

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/test';

MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    // Test to insert a object
    var item = {
        name: "James"
    };
    
    db.collection('Items').insertOne(item, function (err, item) {
        assert.equal(null, err);
        console.log("Insert successfully : " + item);

        // Close the db
        db.close();
    });
});