var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ObjectId=mongoose.Schema.Types.ObjectId;
var Mixed=mongoose.Schema.Types.Mixed;
var userSchema=new Schema({
    email:{type:String,unique:true,required:true},
    password:{type:String,required:true},
    nickname:{type:String,required:true},
    gender:{type:String,required:true,default:'undefined'},
    birthday:{
        year:{type:Number,required:true,default:0},
        month:{type:Number,required:true,default:0},
        day:{type:Number,required:true,default:0}
    },
    site:{type:String,required:true,default:'undefined'},
    height:{type:Number,required:true,default:0},
    education:{type:String,required:true,default:'undefined'},
    marital:{type:String,required:true,default:'undefined'},
    qa:{
        q:{type:String,required:true,default:'undefined'},
        a:{type:String,required:true,default:'undefined'}
    },
    avatar:{
        isSetted:{type:Boolean,required:true,default:false},
        path:{type:String,required:true,default:'baidu.com'},
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