/**
 * Created by M.C on 2017/8/30.
 */
var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        validate: [function (value) {
            return value.length <= 120;
        }, 'Title is too long (120 max)'],
        default: 'New Post'
    },
    text: String,
    slug: {
        type: Boolean,
        set: function (value) {
            return value.toLowerCase().replace(' ', '-')
        }
    }
});

articleSchema.static({
    list: function (callback) {
        this.find({}, null, {sort: {_id: -1}}, callback);
    }
});

module.exports = mongoose.model('Article', articleSchema);