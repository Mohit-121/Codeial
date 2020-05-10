const Post=require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req,res){
    try{
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path:'comments',
            populate:{
                path:'user likes'
            }
        }).populate({
            path:'likes'
        });

        for(let i=0;i<posts.length;i++){
            posts[i].comments.sort((a,b) => b.createdAt-a.createdAt);
        }

        let users = await User.find({});


        let cur_user=null;

        if(req.user){
            cur_user = await User.findById({_id:req.user._id}).populate({
                path:'friendships',
                populate: {
                    path:'from_user to_user'
                }
            });
        }

        return res.render('home',{
            title: "Home",
            posts: posts,
            all_users: users,
            cur_user: cur_user
        });
    }catch(err){
        console.log("Error",err);
        return;
    }
}
