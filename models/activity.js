var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var activitySchema = new Schema({
    leader: {
        type: ObjectId,
        ref: 'User'
    },
    timeStamp: Date,
    startTime: Date,
    stopTime: Date,
    title: String,
    place: String,
    content: String,
    followers: [{
        type: ObjectId,
        ref: 'User'
    }]
});
var Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;