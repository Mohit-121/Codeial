{
    // Method to Submit the form data for new Post using Ajax
    let createPost = function(){
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    console.log(data);
                },error: function(err){
                    console.log(err.responseText);
                }
            });
        });
    }
    // Method to create Post in DOM
    createPost();
}