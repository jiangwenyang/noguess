var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var topicSchema = new Schema({
    leader: {
        type: ObjectId,
        ref: 'User'
    },
    time: Date,
    content: String,
    followers: [{
        from: {
            type: ObjectId,
            ref: 'User'
        },
        time: Date,
        reply: String
    }]
});
var Topic = mongoose.model('Topic', topicSchema);
module.exports = Topic;