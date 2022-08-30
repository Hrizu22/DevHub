const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref: 'User',
    },
    text:{
        type:String,
        required:true,
    },
    name:{
        type:String,
    },
    avatar:{
        type:String,
    },
    likes:[
        {
            user:{
                type:Schema.Types.ObjectId,
                ref: 'Users',
            }
        }
    ],
    comments:[
        {
            user:{
                type:Schema.Types.ObjectId,
                ref: 'Users',
            },
            text: {
                type:String,
                required:true,
            },
            name: {
                type:String
            },
            avatar: {
                type:String
            },
            date:{
                type:Date,
                default:Date.now
            }

        }
    ],
    dat:{
        type:Date,
        default:Date.now
    }
});

module.exports = Post=mongoose.model('post',PostSchema);