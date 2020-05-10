const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.toggleLike = async function(req,res){
    try{

        // likes/toogle/?abcdef=1234&type=Post
        let likeable;
        let deleted = false;
        let likedOrNot = "liked";

        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        // check if like already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });

        // If existing like
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();

            existingLike.remove();
            deleted = true;
            likedOrNot = "Unliked";
        }else{
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });
            likeable.likes.push(newLike._id);
            likeable.save();
        }

        if(req.xhr){
            return res.json(200,{
                message: req.query.type+" "+likedOrNot,
                data: {
                    deleted:deleted
                }
            });
        }
        res.redirect('back');
    }catch(err){
        console.log(err);
        if(req.xhr){
            return res.json(500,{
                message: 'Internal Server Error'
            });
        }
        res.redirect('back');
    }
}