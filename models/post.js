const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Array of ids of all comments
    comments: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Comment'
        }
    ],
    // Array of likes
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
},{
    timestamps: true
});

const Post = mongoose.model('Post',postSchema);
module.exports=Post;