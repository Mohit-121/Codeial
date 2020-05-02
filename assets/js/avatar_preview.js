{
    let updateForm = function(){
        let preview = $('#preview');
        preview.click(function(e){
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/users/update/'+userIdFunction(),
                data: new FormData(document.getElementById("update-form")),
                processData: false,
                contentType: false,
                dataType: 'json',
                success: function(data){
                    if(data.data.prevavatar!=data.data.user.avatar){
                        let imagePreview = createPreview(data.data.user);
                        $('#image-preview').empty().append(imagePreview);
                    }
                },error: function(err){
                    console.log('error',err);
                }
            });
        });
    }

    let createPreview = function(user){
        return `<img src="${ user.avatar }" alt="${ user.name }" width="80" >`;
    }
    updateForm();
}