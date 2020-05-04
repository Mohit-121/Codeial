const nodeMailer = require('../config/nodemailer');

// this is another way of exporting method
exports.newComment = (comment) => {
    console.log('inside newComment mailer',comment);

    let htmlString = nodeMailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from: 'frontendtest323@gmail.com',
        to: comment.user.email,
        subject: 'New Comment Published!',
        html: htmlString
    },(err,info) =>{
        console.log('yes');
        if(err){console.log('error in sending mail',err);return;}
        console.log('Message Sent',info);
        return;
    });
}