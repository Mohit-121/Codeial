const User=require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = function(req,res){
    User.findById(req.params.id,function(err,user){
        return res.render('users_profile',{
            title:'Users Profile',
            profile_user:user
        });
    });
}

module.exports.update = async function(req,res){
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            let prevavatar = user.avatar;
            User.uploadedAvatar(req,res,function(err){
                if(err){console.log("*****MULTER ERR: ",err)}
                // console.log(req.body.name,req.body.email,req.body.file);
                user.name=req.body.name;
                user.email=req.body.email;
                if(req.file){
                    if(user.avatar && fs.existsSync(path.join(__dirname,'..',user.avatar))){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }
                    // To set the path of the current user avatar
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                if(req.xhr){
                    return res.status(200).json({
                        data:{
                            user: user,
                            prevavatar: prevavatar
                        },
                        message: "Success!"
                    });
                }
                return res.redirect('back');
            });
            
        }catch(err){
            req.flash('error',err);
            return res.redirect('back');
        }
    }else{
            req.flash('error','You are not allowed to Update details!');
            return res.status(401).send('Unauthorized');
        }
}

// Render the sign up page
module.exports.signUp=function(req,res){
    if(req.isAuthenticated()){
       return res.redirect('/users/profile');
    }
    return res.render('user_sign_up',{
        title: "Codeial | Sign Up"
    });
}


//Render the sign in page
module.exports.signIn=function(req,res){
    if(req.isAuthenticated()){
       return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        title: "Codeial | Sign In"
    });
}

// get the sign up data
module.exports.create = function(req,res){
    if(req.body.password!=req.body.confirm_password){
        req.flash('error',"Password and confirm password don't match!");
        return res.redirect('back');
    }

    User.findOne({email: req.body.email},function(err,user){
        if(err){
            req.flash('error',err);
            return;
        }
        if(!user){
            User.create(req.body,function(err,user){
                if(err){
                    req.flash('error','Error in creating user while signing up');
                    return;
                }
                req.flash('success','Created User successfully');
                return res.redirect('/users/sign-in');
            });
        }else{
            req.flash('error','User already registered with this email!');
            return res.redirect('back');
        }
    });
}

// sign in and create Session for user
module.exports.createSession = function(req,res){
    req.flash('success','Signed in Successfully');
    return res.redirect('/');
}

// Destroy session
module.exports.destroySession = function(req,res){
    req.logout();
    req.flash('success','You have logged out!');
    return res.redirect('/');
}