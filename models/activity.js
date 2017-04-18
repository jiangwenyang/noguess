var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var ObjectId=mongoose.Schema.Types.ObjectId;
var activitySchema=new Schema({
    leader:{type:ObjectId,ref:'User'},
    time:Date,
    content:String,
    followers:[{type:ObjectId,ref:'User'}]
});
var Activity=mongoose.model('Topic',topicSchema);
module.exports=Activity;