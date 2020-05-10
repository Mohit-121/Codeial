{
    let toggleFriendship = $('#add-friend-form').submit(function(event){
        event.preventDefault();
        let form = $(this);
        $.ajax({
            type: 'post',
            url: $(this).attr('action'),
            success: function(data){
                let button = $(' button',form);
                if(data.data.hasFriendship) button.text('Remove Friend')
                else button.text('Make Friend');
                notifications('success',data.message);
            },error: function(err){
                notifications('error',err.responseText);
            }
        });
    });

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
}