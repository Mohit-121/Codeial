module.exports.profile = function(req,res){
    return res.render('users_profile',{
        title:'Users Profile'
    });
    // res.end('<h1>User Profile</h1>');
}

module.exports.post= function(req,res){
    return res.render('users_profile',{
        title:'Users Post'
    });
    // res.end('<h1>User liked</h1>');
}