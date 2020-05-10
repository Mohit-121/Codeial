const User=require('../models/user');
const ResetPasswordToken = require('../models/reset_password_token');
const Friend = require('../models/friendship');
const fs = require('fs');
const path = require('path');
const resetPasswordMailer = require('../mailers/forgot_password');
const crypto = require('crypto');

module.exports.profile = async function(req,res){
    let isFriend = "Make Friend";
    let friendship = await Friend.findOne({from_user:req.user._id,to_user: req.params.id});
    if(friendship) isFriend = "Remove Friend";
    await User.findById(req.params.id,function(err,user){
        return res.render('users_profile',{
            title:'Users Profile',
            profile_user:user,
            isFriend: isFriend
        });
    });
}

// For forgot password
module.exports.forgotPassword = function(req,res){
    return res.render('forgot_password',{
        title:'Forgot password'
    });
}

// for reset password
module.exports.resetPassword = function(req,res){
    // Find user with the given email
    User.findOne({email: req.body.email},function(err,user){
        if(err){req.flash('error',err);return;}
        if(!user){
            // If user not present go to sign-up page
            req.flash('error',"This email id doens't exist!!!");
            return res.redirect('/users/sign-up');
        }else{
            // Else find the user in reset_password_token
            ResetPasswordToken.findOne({user:user, isValid:true},function(err,userRef){
                if(err){req.flash('error',err);return;}
                req.flash('success','Email Sent successfully');
                if(userRef){
                    // If user is present and id is valid then send the same accessToken
                    console.log('UserRef already present',userRef.accesstoken);
                    resetPasswordMailer.resetPassword(user,userRef.accesstoken);
                }else{
                    // Else create accessToken
                    let accesstoken = crypto.randomBytes(20).toString('hex');
                    ResetPasswordToken.create({user:user,accesstoken:accesstoken,isValid:true},function(err,newUserRef){
                        if(err){console.log('error in creating tokens',err);return;}
                        console.log('User Token created successfully',newUserRef);
                        resetPasswordMailer.resetPassword(user,newUserRef.accesstoken);
                    });
                }
            });
            req.flash('success','Sent Mail Successfully');
            return res.redirect('back');
        }
    });
}

// reset password page
module.exports.resetPasswordPage = async function(req,res){
    let userRef = await ResetPasswordToken.findOne({accesstoken: req.params.id});
    return res.render('reset_password',{
        title:'Reset Password',
        accessToken: req.params.id,
        isValid: userRef.isValid
    });
}

// update password
module.exports.updatePassword = async function(req,res){
    console.log(req.params.id, req.body);
    console.log('Inside update password');
    if(req.body.password==req.body.confirm_password){
        // Check if password and confirm password is same, then find the user with access token
        // If found then reset password, else print Invalid token
        let userRef = await ResetPasswordToken.findOne({accesstoken:req.params.id, isValid:true});
        if(userRef){
            userRef = await userRef.populate('user').execPopulate();
            userRef.isValid = false;
            userRef.user.password = req.body.password;
            userRef.save();
            userRef.user.save();
            req.flash('success','Password changed successfully!!!');
            return res.redirect('/users/sign-in');
        }else{
            req.flash('error','Invalid Access Token');
        }
    }else{
        // Else return passwords don't match
        req.flash('error','Passwords do not match!!!');
    }
    return res.redirect('back');
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