/**
 * Created by M.C on 2017/8/30.
 */
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

const ObjectId = mongoose.Schema.Types.ObjectId,
    Mixed = mongoose.Schema.Types.Mixed;

const bookSchema = mongoose.Schema({
    name: String,
    created_at: Date,
    updated_at: {type: Date, default: Date.now},
    published: Boolean,
    authorId: {type: ObjectId, required: true},
    description: {type: String, default: null},
    active: {type: Boolean, default: false},
    keywords: {type: [String], default: []},
    detail: {
        body: String,
        image: Buffer
    },
    version: {type: Number, default: function () {
        return 1;
    }},
    notes: Mixed,
    contributors: [ObjectId]
});

bookSchema.pre('sava', function (next) {
    console.log('save -=-=-=-= pre');
    return next();
});

bookSchema.pre('remove', function (next) {
    console.log('remove -=-=-=-= pre');
    return next();
});

const Book = mongoose.model('Book', { name: String});

const book = new Book({
    name: 'Node.js'
});

book.save(function (err, result) {
    if (err) {
        console.log(err);
        process.exit(1)
    } else  {
        console.log(result);
        process.exit(0);
    }
});