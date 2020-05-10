// {
//     let likes = $('.like-button').each(function(){
//         $(this).click(function(event){
//             let countspan = $(' span',$($(this).parent()));
//             let count = $(countspan).text();
//             event.preventDefault();
//             $.ajax({
//                 type: 'get',
//                 url: $(this).prop('href'),
//                 success: function(data){
//                     if(data.data.deleted) count=+count-1;
//                     else count=+count+1;
//                     $(countspan).text(count);
//                     notifications('success',data.message);
//                 },error: function(err){
//                     notifications('error',err.responseText);
//                 }
//             });
//         });
//     });
// }

let toggleLike = function(item){
    let countspan = $(' span',$($(item).parent()));
    let count = $(countspan).text();
    event.preventDefault();
    $.ajax({
        type: 'get',
        url: $(item).prop('href'),
        success: function(data){
            if(data.data.deleted) count=+count-1;
            else count=+count+1;
            $(countspan).text(count);
            notifications('success',data.message);
        },error: function(err){
            notifications('error',err.responseText);
        }
    });
}

// Method to call Noty Notifications
let notifications = function(type,text){
    new Noty({
        theme: 'relax',
        text: text,
        type: type,
        layout: 'topRight',
        timeout: 1000
    }).show();
}

