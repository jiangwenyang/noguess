var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ObjectId=mongoose.Schema.Types.ObjectId;
var Mixed=mongoose.Schema.Types.Mixed;
var userSchema=new Schema({
    email:{type:String,unique:true,required:true},
    password:String,
    name:{type:String,required:true},
    nickname:{type:String,required:true},
    gender:{type:String,required:true},
    birthday:{
        year:{type:Number,required:true},
        month:{type:Number,required:true},
        day:{type:Number,required:true}
    },
    site:{type:String,required:true},
    height:{type:Number,required:true},
    education:{type:String,required:true},
    martial:{type:String,required:true},
    qa:{
        q:{type:String,required:true},
        a:{type:String,required:true}
    },
    avatar:{
        assign:{type:Boolean,default:false},
        path:{type:String,default:'baidu.com'},
    },
    album:[
        {
            time:Date,
            path:String
        }
    ],
    followers:[ObjectId],
    following:[ObjectId],
    dynamic:{
        time:Date,
        content:String,
        imgPath:String
    },
    mailbox:[{
        from:ObjectId,
        text:String
    }],
    activity:{
        organize:[{type:ObjectId,ref: 'activity'}],
        join:[{type:ObjectId,ref: 'activity'}]
    },
    topic:{
        publsh:[{type:ObjectId,ref:'topic'}],
        reply:[{type:ObjectId,ref:'topic'}]
    },
    fruit:{type:Number,default:0}
});
var User=mongoose.model('User',userSchema);
module.exports=User;