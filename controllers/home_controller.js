module.exports.home = function(req,res){
    return res.render('home',{
        title:"Home"
    });

    // Used for static rendering
    // return res.end('<h1>Express is up for Codeial</h1>');
}

// module.exports.actionName=function(req,res){}