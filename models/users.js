var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed = mongoose.Schema.Types.Mixed;
var userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        default: '性别什么的是个秘密哦'
    },
    birthday: {
        year: {
            type: Number,
            required: true,
            default: 0
        },
        month: {
            type: Number,
            required: true,
            default: 0
        },
        day: {
            type: Number,
            required: true,
            default: 0
        }
    },
    site: {
        type: String,
        required: true,
        default: '火星上'
    },
    height: {
        type: Number,
        required: true,
        default: 0
    },
    education: {
        type: String,
        required: true,
        default: '学无止境'
    },
    marital: {
        type: String,
        required: true,
        default: '不告诉你'
    },
    qa: {
        q: {
            type: String,
            required: true,
            default: '床前明月光'
        },
        a: {
            type: String,
            required: true,
            default: '疑是地上霜'
        }
    },
    avatar: {
        isSetted: {
            type: Boolean,
            required: true,
            default: false
        },
        path: {
            type: String,
            required: true,
            default: 'avatar/avatar.gif'
        },
    },
    album: [{
        timeStamp: Date,
        path: String
    }],
    followers: [{
        type: ObjectId,
        ref: 'User'
    }],
    following: [{
        type: ObjectId,
        ref: 'User'
    }],
    dynamic: [{
        timeStamp: Date,
        content: String,
        imgPath: String
    }],
    mailbox: [{
        from: {
            type: ObjectId,
            ref: 'User'
        },
        text: String
    }],
    activity: {
        organize: [{
            type: ObjectId,
            ref: 'Activity'
        }],
        join: [{
            type: ObjectId,
            ref: 'Activity'
        }]
    },
    topic: {
        publish: [{
            type: ObjectId,
            ref: 'Topic'
        }],
        reply: [{
            type: ObjectId,
            ref: 'Topic'
        }]
    },
    fruit: {
        type: Number,
        default: 0
    }
});
var User = mongoose.model('User', userSchema);
module.exports = User;