/**
 * Created by M.C on 2017/8/17.
 */

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;

var url = 'mongodb://localhost:27017/test';

MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    // Test to find a object
    db.collection('Items').findOne({}, function (err, item) {
        assert.equal(null, err);
        console.log("Find one: " + JSON.stringify(item));

        console.log("Before Saveing: " + JSON.stringify(item));

        // Update the value of item
        item.name = "Bonds";

        // Get the id string of item
        var _id = item._id.toString();
        console.log("_id: " + _id);

        // Save the updated item
        db.collection('Items').updateOne({name: "James"}, {$set: {name: "Bond"}}, function (err, item) {
            assert.equal(null, err);
            console.log("After saved: " + JSON.stringify(item));

            // Test to find the item by id
            db.collection('Items').find({"name": "Bond", "_id": ObjectID(_id)}).toArray(function (err, docs) {
                assert.equal(null, err);

                console.log(docs);

                db.close();
            });
        });
    });
});