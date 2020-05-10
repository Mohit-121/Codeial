const Friends = require('../models/friendship');
const User = require('../models/user');

module.exports.toggleFriendship = async function(req,res){
    try{
        let friendship = await Friends.findOne({from_user: req.query.from_id, to_user: req.query.to_id});
        if(!friendship){
            let newFriendShip = await Friends.create({
                from_user: req.query.from_id,
                to_user: req.query.to_id
            });
            let user = await User.findById({_id: req.query.from_id});
            user.friendships.push(newFriendShip);
            user.save();
            if(req.xhr){
                return res.json(200,{
                    message: "Friendship established successfully!!!",
                    data: {
                        hasFriendship: true
                    }
                });
            }
        }else{
            // console.log('Friendship already exists',friendship._id);
            let user = await User.findById({_id: req.query.from_id}).populate('friendships');
            user.friendships.pull(friendship);
            user.save();
            friendship.remove();
            if(req.xhr){
                return res.json(200,{
                    message: "Friendship Removed Successfully!!!",
                    data: {
                        hasFriendship: false
                    }
                })
            }
        }
        res.redirect('back');
    }catch(err){
        console.log('Error',err);
        return res.redirect('back');
    }
}